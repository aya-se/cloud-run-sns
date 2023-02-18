import os
from fastapi import HTTPException, Header
from google.oauth2 import id_token
from google.auth.transport import requests
  
def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    token_type, jwt_token = authorization.split(" ")
    if token_type.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authentication")
    try:
      # IDトークンの検証
      id_info = id_token.verify_oauth2_token(jwt_token, requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))
      if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
        raise ValueError('Wrong issuer.')
      return True
    except ValueError:
      return False
