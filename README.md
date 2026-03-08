# AGN Chatbot – Flask + PyTorch + JavaScript

A chatbot built with a PyTorch neural network backend (Flask) and a JavaScript frontend.
Supports **two deployment modes**: served by Flask, or as a completely standalone HTML file.

---

## Project Structure

```
chatbot-project/
├── backend/
│   ├── app.py          ← Flask API server (entry point)
│   ├── chat.py         ← PyTorch model inference
│   ├── model.py        ← NeuralNet class definition
│   ├── nltk_utils.py   ← Tokenizer & bag-of-words
│   ├── train.py        ← Training script (run to retrain)
│   └── data/
│       ├── intents.json    ← Chatbot intents & responses
│       └── data.pth        ← Pre-trained model weights
├── static/             ← Served by Flask (Option A)
│   ├── app.js          ← JS using $SCRIPT_ROOT (Flask sets this)
│   ├── style.css
│   └── images/
├── templates/
│   └── base.html       ← Jinja2 template for Flask (Option A)
├── frontend/           ← Standalone HTML (Option B)
│   ├── base.html       ← Open directly in browser
│   ├── app.js          ← JS using hardcoded BACKEND_URL
│   ├── style.css
│   └── images/
└── requirements.txt
```

---

## Setup

### 1. Create a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Download NLTK data (first time only)
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('punkt_tab')"
```

---

## Running the Chatbot

### Start the Flask backend (required for both options)
```bash
cd backend
python app.py
```
The server starts at `http://127.0.0.1:5000`.

---

## Deployment Option A – Flask serves the UI

Visit `http://127.0.0.1:5000` in your browser.

Flask renders `templates/base.html` and serves `static/app.js`.
The `$SCRIPT_ROOT` variable is automatically set by Flask so the JS knows where to send requests.

---

## Deployment Option B – Standalone Frontend

Open `frontend/base.html` directly in any browser (no web server needed).

The `frontend/app.js` uses a hardcoded `BACKEND_URL`:
```js
const BACKEND_URL = 'http://127.0.0.1:5000';
```
Change this value if your Flask server runs on a different host/port.

CORS is already enabled on the backend so the browser won't block requests.

---

## Retraining the Model

Edit `backend/data/intents.json` to add/modify intents, then:
```bash
cd backend
python train.py
```
This overwrites `data/data.pth` with the new model.

---

## API Reference

### `POST /predict`
Send a chat message and receive a response.

**Request:**
```json
{ "message": "Hello!" }
```

**Response:**
```json
{ "answer": "Hi there! How can I help you?" }
```

---

## Bugs Fixed in This Version

| File | Bug | Fix |
|------|-----|-----|
| `backend/chat.py` | `FILE = "data.pth"` — FileNotFoundError when run from outside `backend/` | Changed to `os.path.join(BASE_DIR, 'data', 'data.pth')` |
| `templates/base.html` | `<link rel="stylesheets"` (typo) and `<link>` placed outside `<head>` | Fixed to `rel="stylesheet"` inside `<head>` |
| `static/app.js` | Bot name inconsistency | Unified to "Smith" |
| `frontend/app.js` | Used undefined `$SCRIPT_ROOT` in standalone mode | Replaced with `BACKEND_URL` constant |
| `frontend/app.js` | No error message shown to user on failure | Added user-facing error message in chat |
