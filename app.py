"""Flask app for Cupcakes"""

from flask import Flask, request, jsonify, render_template
from models import db, connect_db, Cupcake
from forms import CupcakeForm

app = Flask(__name__)
app.config["SECRET_KEY"] = "oh-so-secret"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)

#HTML Routes
@app.route('/')
def index():
    """Shows index page."""
    form = CupcakeForm()
    return render_template('index.html', form=form)

#API Routes

@app.route("/api/cupcakes")
def list_all_cupcakes():
    """Return JSON of all cupcakes. {cupcakes: [{id, flavor, size, rating, image}, ...]}."""
    cupcakes = Cupcake.query.all()
    serialized = [cupcake.serialize() for cupcake in cupcakes]
    return jsonify(cupcakes=serialized)

@app.route("/api/cupcakes/<int:id>")
def list_single_cupcake(id):
    """Return JSON of a single cupcake. {cupcake: {id, flavor, size, rating, image}}."""
    cupcake = Cupcake.query.get_or_404(id)
    serialized = cupcake.serialize()
    return jsonify(cupcake=serialized)

@app.route("/api/cupcakes", methods=["POST"])
def create_cupcake():
    """Creates a new cupcake and returns JSON for new cupcake. {cupcakes: [{id, flavor, size, rating, image}, ...]}."""
    flavor = request.json["flavor"]
    size = request.json["size"]
    rating = request.json["rating"]
    image = request.json["image"] or None

    new_cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image)
    db.session.add(new_cupcake)
    db.session.commit()
    
    serialized = new_cupcake.serialize()
    json = jsonify(cupcake=serialized)
    return (json, 201)

@app.route("/api/cupcakes/<int:id>", methods=["PATCH"])
def update_cupcake(id):
    """Update a cupcake using the cupcake id and return JSON for the new cupcake.  {cupcake: {id, flavor, size, rating, image}}"""
    cupcake = Cupcake.query.get_or_404(id)
    
    cupcake.flavor = request.json.get("flavor", cupcake.flavor)
    cupcake.size = request.json.get("size", cupcake.size)
    cupcake.rating = request.json.get("rating", cupcake.rating)
    cupcake.image = request.json.get("image", cupcake.image)

    db.session.commit()
    
    serialized = cupcake.serialize()
    return jsonify(cupcake=serialized)

@app.route("/api/cupcakes/<int:id>", methods=["DELETE"])
def delete_cupcake(id):
    """Delete a cupcake using the cupcake id and return JSON {message: "Deleted"}"""
    cupcake = Cupcake.query.get_or_404(id)
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message="Deleted")