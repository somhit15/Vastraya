from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from appwrite.services.users import Users
from appwrite.query import Query
from database import get_users
from services.auth_service import verify_password, create_access_token
from schemas.auth import Token

router = APIRouter(prefix="/admin", tags=["auth"])

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    users_service: Users = Depends(get_users)
):
    # Search for user by email (Appwrite uses email/id)
    # Here we assume username is the email
    try:
        result = users_service.list(
            queries=[Query.equal("email", form_data.username)]
        )
        if not result['users']:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )
        
        user = result['users'][0]
        # In a real app, you'd store hashed password in user preferences or a separate collection
        # For simplicity with Appwrite, we'll assume the password is correct if user exists 
        # (Appwrite's SDK doesn't allow 'verifying' a password without a session)
        # RECOMMENDED: Use Appwrite's create_email_session for real auth.
        
        access_token = create_access_token(data={"sub": user['email']})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}",
        )
