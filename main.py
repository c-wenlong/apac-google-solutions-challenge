from flask import Flask, render_template
from routes import gemini_bp
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)


@app.route("/")
def health_check():
    return "OK"


app.register_blueprint(gemini_bp)


if __name__ == "__main__":
    app.run(port=os.getenv("PORT"))
