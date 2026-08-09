from flask import Flask, jsonify
from flask_cors import CORS
app=Flask(__name__)
CORS(app)
esercizi_del_giorno=[
    {"nome":"Panca piana","serie":[]},
    {"nome":"Chest press","serie":[]},
    {"nome":"Pec fly","serie":[]}
]


@app.route("/api/esercizi")
def get_esercizi():
    return jsonify(esercizi_del_giorno)

if __name__=="__main__":
    app.run(debug=True)