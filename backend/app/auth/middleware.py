from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request, HTTPException
from functools import wraps

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

def rate_limit(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        request: Request = args[0] if args else kwargs.get("request")
        try:
            limiter.check(request, "100/minute")
        except Exception:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        return await func(*args, **kwargs)
    return wrapper

def get_current_user(token: str):
    from app.auth.jwt_handler import decode_token
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload