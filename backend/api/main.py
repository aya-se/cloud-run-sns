from fastapi import FastAPI
from api.routers import post

app = FastAPI()
app.include_router(post.router)

@app.get("/hello")
def read_root(name: str):
    return {"message": f"Hello {name}!"}