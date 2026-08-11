from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os

app=Flask(__name__)
client=MongoClient("mongodb://localhost:27017/")
db=client["gofit"]
esercizi_collection=db["esercizi"]
CORS(app)



@app.route("/api/esercizi")
def get_esercizi():
    esercizi_db=list(esercizi_collection.find())
    esercizi = [{"nome":e["nome"],"gruppo_muscolare":e["gruppo_muscolare"]} for e in esercizi_db]
    return jsonify(esercizi)

@app.route("/api/serie",methods=["POST"])
def aggiungi_serie():
    dati_ricevuti=request.get_json()
    print(dati_ricevuti)
    return jsonify({"messaggio":"Serie ricevuta"}),201


if __name__=="__main__":
    app.run(debug=True)