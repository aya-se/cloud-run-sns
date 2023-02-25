import os
from fastapi import HTTPException, Header
from google.oauth2 import id_token
from google.auth.transport import requests
  
def verify_token(x_id_token: str = Header(None)):
    if not x_id_token:
        raise HTTPException(status_code=401, detail="X-Id-Token header required")
    try:
        # IDトークンの検証
        id_info = id_token.verify_oauth2_token(x_id_token, requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        return id_info
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authentication")
