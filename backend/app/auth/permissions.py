from fastapi import HTTPException

def get_user_role(username: str):
    from app.auth.auth_routes import users_db
    user = users_db.get(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user["role"]

def require_role(required_role: str):
    def decorator(func):
        async def wrapper(user=Depends(get_current_user), *args, **kwargs):
            if user["role"] != required_role:
                raise HTTPException(status_code=403, detail="Forbidden")
            return await func(*args, **kwargs)
        return wrapper
    return decorator