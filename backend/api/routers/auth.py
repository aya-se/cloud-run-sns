import os
from google.oauth2 import id_token
from google.auth.transport import requests

def verify_id_token(jwt_token: str) -> bool:
  try:
    # IDトークンの検証
    id_info = id_token.verify_oauth2_token(jwt_token, requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))
    if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
      raise ValueError('Wrong issuer.')
    return True
  except ValueError:
    return False
