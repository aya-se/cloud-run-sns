from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost:3000",
    "https://cloud-run-sns-github-frontend-sew3jfiyjq-uc.a.run.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello")
def read_root(name: str):
    return {'message': f'Hello {name}!'}

@app.post("/post")
def post_root(text: str):
    return {'message': f'OK {text}!'}