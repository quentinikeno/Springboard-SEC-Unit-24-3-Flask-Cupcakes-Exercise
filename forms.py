from flask_wtf import FlaskForm
from wtforms import StringField, FloatField
from wtforms.validators import InputRequired, Optional, URL

class CupcakeForm(FlaskForm):
    """Form for adding cupcakes."""
    
    flavor = StringField("Flavor", validators=[InputRequired(message="Flavor must be specified.")])
    size = StringField("Size", validators=[InputRequired(message="Size must be specified.")])
    rating = FloatField("Rating", validators=[InputRequired(message="Rating must be specified.")])
    image = StringField("Image URL", validators=[Optional(), URL()])