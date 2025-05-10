from flask import Flask, render_template
from .routes import gemini_bp, openai_bp
from dotenv import load_dotenv
from flask_cors import CORS


load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(gemini_bp)
app.register_blueprint(openai_bp)


@app.route("/")
def home_view():
    return render_template("index.html")
