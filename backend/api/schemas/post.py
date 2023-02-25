from typing import Any
from pydantic import BaseModel, Field


class PostBase(BaseModel):
    text: str = Field(..., example="Hello World!")


class PostCreate(PostBase):
    pass


class PostDelete(BaseModel):
    id: str


class Post(PostCreate):
    id: str
    timestamp: Any = Field(..., example="2021-01-01T00:00:00.000000Z")
    user_name: str = Field(..., example="John Doe")
    user_email: str = Field(..., example="example@gmail.com", regex=r".+@.+\..+", description="Email address")
    user_image: str = Field(None, example="https://example.com/example", regex=r"https?://.+\..+", description="URL to image")
