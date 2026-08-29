from flask import Flask, jsonify, request,session
from flask_cors import CORS
from pymongo import MongoClient
from datetime import date
from werkzeug.security import generate_password_hash,check_password_hash
from dotenv import load_dotenv
import os
from pathlib import Path
from bson import ObjectId

app=Flask(__name__)
env_path=Path(__file__).resolve().parent/".env"
load_dotenv(env_path)
app.config["SECRET_KEY"]=os.environ.get("SECRET_KEY")
client=MongoClient("mongodb://localhost:27017/")
db=client["gofit"]
esercizi_collection=db["esercizi"]
allenamenti_collection=db["allenamenti"]
schede_collection=db["schede"]
utenti_collection=db["utenti"]
CORS(app,supports_credentials=True)



@app.route("/api/esercizi")
def get_esercizi():
    esercizi_db=list(esercizi_collection.find())
    esercizi = [{"nome":e["nome"],"gruppo_muscolare":e["gruppo_muscolare"]} for e in esercizi_db]
    return jsonify(esercizi)

def search_exercise(nome_esercizio,esercizi_svolti):
    for e in esercizi_svolti:
        if(e["nome"]==nome_esercizio):
            serie=e["serie"]
            n=serie[-1]['numero']
            return n+1
@app.route("/api/serie",methods=["POST"])
def post_serie():
    if "utente_id" not in session:
        return jsonify({"messaggio":"no login"}),401
    utente_id=session["utente_id"]
    dati_ricevuti=request.get_json()
    oggi=str(date.today())
    nome_esercizio=dati_ricevuti["esercizio"]
    rep_esercizio=dati_ricevuti["rep"]
    carico_esercizio=dati_ricevuti["carico"]
    esercizio_trovato=allenamenti_collection.find_one(
        {"utente_id":utente_id,"data":oggi,"esercizi_svolti.nome":nome_esercizio}
    )
    allenamenti_collection.update_one(
        {"utente_id":utente_id,"data":oggi},
        {"$setOnInsert":{"utente_id":utente_id,"data":oggi,"esercizi_svolti":[]}},
        upsert=True
    )
    if(esercizio_trovato is None):
        allenamenti_collection.update_one(
        {"utente_id":utente_id,"data":oggi},
        {"$push":{
            "esercizi_svolti":{
                "nome":nome_esercizio,
                "serie":[{"numero":1,"rep":rep_esercizio,"carico":carico_esercizio}]
            }
        }}
        )
    else:
        esercizi_svolti=esercizio_trovato["esercizi_svolti"]
        allenamenti_collection.update_one(
                {"utente_id":utente_id,"data":oggi,"esercizi_svolti.nome":nome_esercizio},
                {"$push":{
                    "esercizi_svolti.$.serie":{
                        "numero":search_exercise(nome_esercizio,esercizi_svolti),
                        "rep":rep_esercizio,
                        "carico":carico_esercizio
                    }
                }}
                )
    return jsonify({"messaggio":"Serie aggiunta"}),201

@app.route("/api/schede",methods=["POST"])
def post_schede():
    if "utente_id" not in session:
            return jsonify({"messaggio":"no login"}),401
    utente_id=session["utente_id"]
    scheda_ricevuta=request.get_json()
    nome_scheda=scheda_ricevuta["nome"]
    esercizi_pianificati=scheda_ricevuta["esercizi_pianificati"]
    schede_collection.insert_one(
        {
            "utente_id":utente_id,
            "nome":nome_scheda,
            "esercizi_pianificati":esercizi_pianificati
        }
    )
    return jsonify({"messaggio":"scheda aggiunta"}),201

@app.route("/api/schede")
def get_schede():
    if "utente_id" not in session:
        return jsonify({"messaggio":"no login"}),401
    utente_id=session["utente_id"]
    schede_db=list(schede_collection.find({"utente_id":utente_id}))
    scheda=[{"id":str(s["_id"]),"nome":s["nome"],"esercizi_pianificati":s["esercizi_pianificati"]} for s in schede_db]
    return jsonify(scheda)

#due to changes this is dead code. Could it be useful in the future??
@app.route("/api/schede/<scheda_id>")
def get_scheda_singola(scheda_id):
    if "utente_id" not in session:
            return jsonify({"messaggio":"no login"}),401
    oid=ObjectId(scheda_id)
    utente_id=session["utente_id"]
    scheda_scelta=schede_collection.find_one({"_id":oid,"utente_id":utente_id})
    scheda_ret={"id":str(scheda_scelta["_id"]),"nome":scheda_scelta["nome"],"esercizi_pianificati":scheda_scelta["esercizi_pianificati"]}
    return jsonify(scheda_ret),200


                
@app.route("/api/registrazione",methods=["POST"])
def registrazione():
    dati=request.get_json()
    email=dati["email"]
    password=dati["password"]
    dati_cercati=utenti_collection.find_one({"email":email})
    if(dati_cercati is not None):
        return jsonify({"messaggio":"Email presente nel sistema"}),409
    hash_pass=generate_password_hash(password)
    utenti_collection.insert_one({"email":email,"password":hash_pass})
    return jsonify({"messaggio":"registrazione effettuata con successo"}),201

@app.route("/api/login",methods=["POST"])
def login():
    dati=request.get_json()
    email=dati["email"]
    dati_cercati=utenti_collection.find_one({"email":email})
    if(dati_cercati is None):
        return jsonify({"messaggio":"Errore"}),401
    if(check_password_hash(dati_cercati["password"],dati["password"])==False):
        return jsonify({"messaggio":"Errore"}),401
    session["utente_id"]=str(dati_cercati["_id"])
    return jsonify({"messaggio":"Login OK"}),200

@app.route("/api/logout",methods=["POST"])
def logout():
    session.pop("utente_id",None)
    return jsonify({"messaggio":"Logout OK"}),200

@app.route("/api/allenamenti/nota",methods=["POST"])
def post_nota():
    if "utente_id" not in session:
        return jsonify({"messaggio":"no login"}),401
    utente_id=session["utente_id"]
    dati_ricevuti=request.get_json()
    nota=dati_ricevuti["nota"]
    oggi=str(date.today())
    allenamenti_collection.update_one(
        {"utente_id":utente_id,"data":oggi},
        {"$set":{"nota":nota},"$setOnInsert":{"utente_id":utente_id,"data":oggi,"esercizi_svolti":[]}},
        upsert=True
        )
    return jsonify({"messaggio":"Nota salvata"}),200

@app.route("/api/allenamenti")
def get_allenamenti():
    if "utente_id" not in session:
        return jsonify({"messaggio":"no login"}),401
    utente_id=session["utente_id"]
    allenamenti_db=allenamenti_collection.find({"utente_id":utente_id})
    allenamenti=[{"id":str(a["_id"]),"data":a["data"]} for a in allenamenti_db]
    return jsonify(allenamenti)

@app.route("/api/allenamenti/<allenamento_id>")
def get_allenamento_singolo(allenamento_id):
    if "utente_id" not in session:
            return jsonify({"messaggio":"no login"}),401
    utente_id=session["utente_id"]
    oid=ObjectId(allenamento_id)
    allenamento_scelto=allenamenti_collection.find_one({"utente_id":utente_id,"_id":oid})
    allenamento_ret={"id":str(allenamento_scelto["_id"]),"data":allenamento_scelto["data"],"esercizi_svolti":allenamento_scelto["esercizi_svolti"],"nota":allenamento_scelto.get("nota","")}
    return jsonify(allenamento_ret),200

@app.route("/api/allenamenti/oggi")
def get_allenamento_odierno():
    if "utente_id" not in session:
            return jsonify({"messaggio":"no login"}),401
    utente_id=session["utente_id"]
    oggi=str(date.today())
    allenamento_scelto=allenamenti_collection.find_one({"utente_id":utente_id,"data":oggi})
    if allenamento_scelto is None:
         return jsonify({"nota":"","scheda_id":None,"esercizi_svolti":[]}),200
    allenamento_ret={"id":str(allenamento_scelto["_id"]),"data":allenamento_scelto["data"],"esercizi_svolti":allenamento_scelto["esercizi_svolti"],"nota":allenamento_scelto.get("nota",""),
    "scheda_id":allenamento_scelto.get("scheda_id")}
    return jsonify(allenamento_ret),200

@app.route("/api/allenamenti/scheda",methods=["POST"])
def post_scheda_oggi():
    if "utente_id" not in session:
        return jsonify({"messaggio":"No login"}),400
    utente_id=session["utente_id"]
    dati_ricevuti=request.get_json()
    scheda_id=dati_ricevuti.get("scheda_id")
    forza=dati_ricevuti.get("forza",False)
    oggi=str(date.today())
    allenamento_esistente=allenamenti_collection.find_one({"utente_id":utente_id,"data":oggi})
    if allenamento_esistente is not None:
        scheda_attuale=allenamento_esistente.get("scheda_id")
        if scheda_attuale!=scheda_id and not forza:
            return jsonify({"messaggio":"conflitto","scheda_id_attuale":scheda_attuale}),409
    allenamenti_collection.update_one(
        {"utente_id":utente_id,"data":oggi},
        {"$set":{"scheda_id":scheda_id},
        "$setOnInsert":{"utente_id":utente_id,"data":oggi,"esercizi_svolti":[]}
        },
        upsert=True
    )
    return jsonify({"messaggio":"Scheda impostata"}),200

def trova_serie_svolte(nome_es,es_svolti):
    for e in es_svolti:
        if e["nome"]==nome_es:
            return e["serie"]
    return []

@app.route("/api/allenamenti/oggi/completo")
def get_allenamento_odierno_completo():
    if "utente_id" not in session:
          return jsonify({"messaggio":"No login"}),401
    utente_id=session["utente_id"]
    oggi=str(date.today())
    allenamento=allenamenti_collection.find_one({"utente_id":utente_id,"data":oggi})
    scheda_id=allenamento.get("scheda_id") if allenamento else None
    esercizi_svolti=allenamento.get("esercizi_svolti",[]) if allenamento else []
    nota=allenamento.get("nota","") if allenamento else ""
    if scheda_id is not None:
        scheda_trovata=schede_collection.find_one({"_id":ObjectId(scheda_id)})
    else:
         scheda_trovata=None
    if scheda_trovata is not None:
        esercizi_base=scheda_trovata["esercizi_pianificati"]
        nome_scheda=scheda_trovata["nome"]
    else:
        esercizi_base=list(esercizi_collection.find())
        nome_scheda="Allenamento libero"
    esercizi_uniti=[]
    for esercizio in esercizi_base:
        esercizi_uniti.append({
            "nome":esercizio["nome"],
            "target_rep":esercizio.get("target_rep"),
            "serie":trova_serie_svolte(esercizio["nome"],esercizi_svolti)
        })
    return jsonify({"nome":nome_scheda,"nota":nota,"esercizi":esercizi_uniti})

if __name__=="__main__":
    app.run(debug=True)