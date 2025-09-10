from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
import bcrypt
from app.auth.jwt_handler import create_access_token, create_refresh_token
from app.auth.permissions import get_user_role
from app.auth.middleware import rate_limit
from typing import Dict

router = APIRouter(prefix="/auth")
users_db: Dict[str, Dict] = {}  # username: {password_hash, role}

class RegisterModel(BaseModel):
    username: str
    password: str
    role: str = "user"

class LoginModel(BaseModel):
    username: str
    password: str

@router.post("/register")
@rate_limit
async def register(data: RegisterModel):
    if data.username in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    pwd_hash = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    users_db[data.username] = {"password_hash": pwd_hash, "role": data.role}
    return {"msg": "User registered successfully"}

@router.post("/login")
@rate_limit
async def login(data: LoginModel):
    user = users_db.get(data.username)
    if not user or not bcrypt.checkpw(data.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    role = user["role"]
    token_data = {"sub": data.username, "role": role}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh")
@rate_limit
async def refresh_token(request: Request):
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    payload = decode_token(token.split(" ")[1])
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    username = payload["sub"]
    role = get_user_role(username)
    token_data = {"sub": username, "role": role}
    access_token = create_access_token(token_data)
    return {"access_token": access_token, "token_type": "bearer"}