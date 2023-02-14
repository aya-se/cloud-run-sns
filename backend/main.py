import os
from fastapi import FastAPI
from google.cloud import firestore

app = FastAPI()
db = firestore.Client(os.getenv("GOOGLE_CLOUD_PROJECT"))

@app.get("/hello")
def read_root(name: str):
    return {"message": f"Hello {name}!"}

@app.post("/post")
def post_root(text: str):
    doc_ref = db.collection(u"posts").document()
    doc_ref.set({
        u"text": text
    })
    return {"message": f"OK {text}!"}