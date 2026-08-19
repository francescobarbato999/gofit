from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from datetime import date
from werkzeug.security import generate_password_hash,check_password_hash

app=Flask(__name__)
client=MongoClient("mongodb://localhost:27017/")
db=client["gofit"]
esercizi_collection=db["esercizi"]
allenamenti_collection=db["allenamenti"]
schede_collection=db["schede"]
utenti_collection=db["utenti"]
CORS(app)



@app.route("/api/esercizi")
def get_esercizi():
    esercizi_db=list(esercizi_collection.find())
    esercizi = [{"nome":e["nome"],"gruppo_muscolare":e["gruppo_muscolare"]} for e in esercizi_db]
    return jsonify(esercizi)

@app.route("/api/serie",methods=["POST"])
def post_serie():
    dati_ricevuti=request.get_json()
    oggi=str(date.today())
    nome_esercizio=dati_ricevuti["esercizio"]
    rep_esercizio=dati_ricevuti["rep"]
    carico_esercizio=dati_ricevuti["carico"]
    esercizio_trovato=allenamenti_collection.find_one(
        {"data":oggi,"esercizi_svolti.nome":nome_esercizio}
    )
    allenamenti_collection.update_one(
        {"data":oggi},
        {"$setOnInsert":{"data":oggi,"esercizi_svolti":[]}},
        upsert=True
    )
    if(esercizio_trovato==None):
        allenamenti_collection.update_one(
        {"data":oggi},
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
                {"data":oggi,"esercizi_svolti.nome":nome_esercizio},
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
    scheda_ricevuta=request.get_json()
    nome_scheda=scheda_ricevuta["nome"]
    esercizi_pianificati=scheda_ricevuta["esercizi_pianificati"]
    schede_collection.insert_one(
        {
            "nome":nome_scheda,
            "esercizi_pianificati":esercizi_pianificati
        }
    )
    return jsonify({"messaggio":"scheda aggiunta"}),201

@app.route("/api/schede")
def get_schede():
    schede_db=list(schede_collection.find())
    scheda=[{"nome":s["nome"],"esercizi_pianificati":s["esercizi_pianificati"]} for s in schede_db]
    return jsonify(scheda)

def search_exercise(nome_esercizio,esercizi_svolti):
    for e in esercizi_svolti:
        if(e["nome"]==nome_esercizio):
            serie=e["serie"]
            n=serie[-1]['numero']
            return n+1
                
@app.route("/api/registrazione",methods=["POST"])
def registrazione():
    dati=request.get_json()
    email=dati["email"]
    password=dati["password"]
    dati_cercati=utenti_collection.find_one({"email":email})
    if(dati_cercati!=None):
        return jsonify({"messaggio":"Email presente nel sistema"}),409
    hash_pass=generate_password_hash(password)
    utenti_collection.insert_one({"email":email,"password":hash_pass})
    return jsonify({"messaggio":"registrazione effettuata con successo"}),201

@app.route("/api/login",methods=["POST"])
def login():
    dati=request.get_json()
    email=dati["email"]
    dati_cercati=utenti_collection.find_one({"email":email})
    if(dati_cercati==None):
        return jsonify({"messaggio":"Errore"}),401
    if(check_password_hash(dati_cercati["password"],dati["password"])==False):
        return jsonify({"messaggio":"Errore"}),401
    return jsonify({"messaggio":"Login OK"}),200

if __name__=="__main__":
    app.run(debug=True)