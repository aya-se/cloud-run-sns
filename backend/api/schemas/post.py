from typing import Any, Optional
from pydantic import BaseModel, Field
from google.cloud import firestore

class PostBase(BaseModel):
    user_name: Optional[str] = Field(None, example="John Doe")
    user_email: Optional[str] =Field(None, example="example@gmail.com")
    user_image: Optional[str] =Field(None, example="https://example.com/image.png")
    text: Optional[str] =Field(None, example="Hello World!")

class PostCreate(PostBase):
    pass

class PostCreateResponse(PostCreate):
    pass

class Post(PostBase):
    id: str
    timestamp: Any = Field(None, example="2021-01-01T00:00:00.000000Z")