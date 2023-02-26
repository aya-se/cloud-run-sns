import os
from typing import List
import api.schemas.post as post_schema
from fastapi import APIRouter, Depends, HTTPException
from google.cloud import firestore
from .auth import verify_token

router = APIRouter()
# db = firestore.Client(os.getenv("GOOGLE_CLOUD_PROJECT"))


@router.get("/posts", response_model=List[post_schema.Post])
async def get_root():
    '''
    # 投稿を取得
    docs = db.collection(u"posts").order_by(
        u"timestamp", direction=firestore.Query.DESCENDING).get()
    # 投稿データを整形
    posts = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        posts.append(data)
    return posts
    '''


@router.post("/posts")
async def post_root(post_body: post_schema.PostCreate, id_info = Depends(verify_token)):
    '''
    # 投稿データ
    data = {
        u"timestamp": firestore.SERVER_TIMESTAMP,
        u"user_name": id_info["name"],
        u"user_email": id_info["email"],
        u"user_image": id_info["picture"],
        u"text": post_body.text
    }
    # 投稿を作成
    db.collection(u"posts").document().set(data)
    return {"message": "Post created successfully"}
    '''


@router.delete("/posts")
async def delete_root(post_delete_body: post_schema.PostDelete, id_info = Depends(verify_token)):
    '''
    doc = db.collection(u"posts").document(post_delete_body.id).get()
    # 存在しない投稿を削除しようとした場合
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Post not found")
    doc_email = doc.to_dict()["user_email"]
    # 他人の投稿を削除しようとした場合
    if doc_email != id_info["email"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    # 投稿を削除
    db.collection(u"posts").document(post_delete_body.id).delete()
    return {"message": "Post deleted successfully"}
    '''
