from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db,Esericzio
app=Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"]="sqlite:///gofit.db"
db.init_app(app)

with app.app_context():
    db.create_all()
CORS(app)
esercizi_del_giorno=[
    {"nome":"Panca piana","serie":[]},
    {"nome":"Chest press","serie":[]},
    {"nome":"Pec fly","serie":[]}
]


@app.route("/api/esercizi")
def get_esercizi():
    return jsonify(esercizi_del_giorno)

@app.route("/api/serie",methods=["POST"])
def aggiungi_serie():
    dati_ricevuti=request.get_json()
    print(dati_ricevuti)
    return jsonify({"messaggio":"Serie ricevuta"}),201


if __name__=="__main__":
    app.run(debug=True)