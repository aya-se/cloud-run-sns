from fastapi import FastAPI
from api.routers import post, auth

app = FastAPI()
app.include_router(post.router)
