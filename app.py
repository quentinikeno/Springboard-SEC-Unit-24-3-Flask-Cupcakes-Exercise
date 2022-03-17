"""Flask app for Cupcakes"""

from flask import Flask, request, jsonify
from models import db, connect_db, Cupcake

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)

@app.route("/api/cupcakes")
def list_all_cupcakes():
    """Return JSON of all cupcakes."""
    cupcakes = Cupcake.query.all()
    serialized = [cupcake.serialize() for cupcake in cupcakes]
    return jsonify(cupcakes=serialized)

@app.route("/api/cupcakes/<int:id>")
def list_single_cupcake(id):
    """Return JSON of a single cupcake."""
    cupcake = Cupcake.query.get_or_404(id)
    serialized = cupcake.serialize()
    return jsonify(cupcake=serialized)
