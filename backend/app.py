from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db,Esercizio
import os

basedir = os.path.abspath(os.path.dirname(__file__))
app=Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "gofit.db")
db.init_app(app)

with app.app_context():
    db.create_all()
CORS(app)



@app.route("/api/esercizi")
def get_esercizi():
    esercizi_db=Esercizio.query.all()
    esercizi = [{"nome":e.nome,"gruppo_muscolare":e.gruppo_muscolare} for e in esercizi_db]
    return jsonify(esercizi)

@app.route("/api/serie",methods=["POST"])
def aggiungi_serie():
    dati_ricevuti=request.get_json()
    print(dati_ricevuti)
    return jsonify({"messaggio":"Serie ricevuta"}),201


if __name__=="__main__":
    app.run(debug=True)