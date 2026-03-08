from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chat import get_response

app = Flask(__name__, template_folder='../templates', static_folder='../static')
CORS(app)  # Enable CORS for standalone frontend support

@app.get("/")
def index_get():
    """Serve the chatbot UI via Flask template."""
    return render_template("base.html")

@app.post("/predict")
def predict():
    """Receive a message and return the chatbot response."""
    data = request.get_json()
    text = data.get("message", "")
    if not text:
        return jsonify({"answer": "Please send a valid message."}), 400
    response = get_response(text)
    return jsonify({"answer": response})

if __name__ == "__main__":
    app.run(debug=True)
