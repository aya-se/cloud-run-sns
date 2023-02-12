from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
def read_root(name: str):
    return {'message': f'Hello {name}!'}

@app.post("/post")
def post_root(text: str):
    return {'message': f'OK {text}!'}