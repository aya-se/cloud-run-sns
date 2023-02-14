import os
from typing import List
import api.schemas.post as post_schema
from fastapi import APIRouter
from google.cloud import firestore

router = APIRouter()
db = firestore.Client(os.getenv("GOOGLE_CLOUD_PROJECT"))


@router.get("/posts", response_model=List[post_schema.Post])
async def get_root():
    docs = db.collection(u"posts").order_by(
        u"timestamp", direction=firestore.Query.DESCENDING).get()
    posts = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        posts.append(data)
    return posts


@router.post("/posts", response_model=post_schema.PostCreateResponse)
async def post_root(post_body: post_schema.PostCreate):
    data = {
        u"timestamp": firestore.SERVER_TIMESTAMP,
        u"user_name": post_body.user_name,
        u"user_email": post_body.user_email,
        u"user_image": post_body.user_image,
        u"text": post_body.text
    }
    db.collection(u"posts").document().set(data)
    return post_schema.PostCreateResponse(**post_body.dict())


@router.delete("/posts/{id}")
async def delete_root(post_delete_body: post_schema.PostDelete):
    db.collection(u"posts").document(post_delete_body.id).delete()
    return {"message": "Post deleted successfully"}
