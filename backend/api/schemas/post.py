from typing import Any, Optional
from pydantic import BaseModel, Field


class PostBase(BaseModel):
    user_name: Optional[str] = Field(None, example="John Doe")
    user_email: Optional[str] = Field(None, example="example@gmail.com")
    user_image: Optional[str] = Field(
        None, example="/google-cloud.png")
    text: Optional[str] = Field(None, example="Hello World!")


class PostCreate(PostBase):
    pass


class PostCreateResponse(PostCreate):
    pass


class PostDelete(BaseModel):
    id: str


class Post(PostBase):
    id: str
    timestamp: Any = Field(None, example="2021-01-01T00:00:00.000000Z")
