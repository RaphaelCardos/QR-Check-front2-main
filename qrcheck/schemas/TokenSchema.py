from typing import Optional

from pydantic import BaseModel, ConfigDict


class Token(BaseModel):
    access_token: str
    token_type: str
    exp: Optional[int] = None  # Timestamp de expiração do token

    model_config = ConfigDict(from_attributes=True)


class TokenData(BaseModel):
    user_id: Optional[str] = None
    is_admin: Optional[bool] = False
    exp: Optional[int] = None  # Timestamp de expiração do token

    model_config = ConfigDict(from_attributes=True)
