from flask import Flask, render_template
from routes import gemini_bp

app = Flask(__name__)


@app.route("/")
def health_check():
    return "OK"


app.register_blueprint(gemini_bp)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
