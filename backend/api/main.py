from fastapi import FastAPI
from api.routers import post

app = FastAPI()
app.include_router(post.router)
