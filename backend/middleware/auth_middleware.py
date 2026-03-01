from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from appwrite.services.users import Users
from appwrite.query import Query
from config import settings
from database import get_users
from schemas.auth import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/admin/login")

async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    users_service: Users = Depends(get_users)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
        
    try:
        result = users_service.list(
            queries=[Query.equal("email", token_data.username)]
        )
        if not result['users']:
            raise credentials_exception
        return result['users'][0]
    except Exception:
        raise credentials_exception
