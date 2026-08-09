from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()

class Esercizio(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    nome=db.Column(db.String(100),nullable=False)
    gruppo_muscolare=db.Column(db.String(100))