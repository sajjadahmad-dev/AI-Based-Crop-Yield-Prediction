from datetime import datetime, timedelta
from pathlib import Path
import os
import pickle
from typing import Optional

import numpy as np
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, relationship, sessionmaker

app = FastAPI()


def parse_frontend_origins(raw_origins: str):
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    if not origins:
        origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
    return origins


frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173,http://127.0.0.1:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_frontend_origins(frontend_origin),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

default_db_path = Path(__file__).resolve().parent / "crop.db"


def normalize_database_url(url: str):
    if url.startswith("sqlite:///"):
        db_file = url.replace("sqlite:///", "", 1)
        if db_file.startswith("./"):
            resolved = (Path(__file__).resolve().parent / db_file[2:]).resolve()
            return f"sqlite:///{resolved.as_posix()}"
    return url


DATABASE_URL = normalize_database_url(os.getenv("DATABASE_URL", f"sqlite:///{default_db_path.as_posix()}"))
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-this-secret-key-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    area = Column(Integer, nullable=False)
    item = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    average_rainfall = Column(Float, nullable=False)
    pesticides = Column(Float, nullable=False)
    avg_temp = Column(Float, nullable=False)
    predicted_yield = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="predictions")


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_password(plain_password: str, password_hash: str):
    return pwd_context.verify(plain_password, password_hash)


def get_password_hash(password: str):
    return pwd_context.hash(password)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
):
    if not token:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            return None
    except JWTError:
        return None

    return db.query(User).filter(User.email == email).first()


model_path = Path(__file__).resolve().parent / "model.pkl"
model = pickle.load(open(model_path, "rb"))


class RegisterInput(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class AuthUser(BaseModel):
    id: int
    name: str
    email: EmailStr


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: AuthUser


class RegisterResponse(BaseModel):
    message: str
    email: EmailStr


class CropInput(BaseModel):
    Area: int
    Item: int
    Year: int
    average_rainfall: float
    pesticides: float
    avg_temp: float


class PredictionHistoryOut(BaseModel):
    id: int
    area: int
    item: int
    year: int
    average_rainfall: float
    pesticides: float
    avg_temp: float
    predicted_yield: float
    created_at: datetime


@app.post("/auth/register", response_model=RegisterResponse)
def register(data: RegisterInput, db: Session = Depends(get_db)):
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    existing_user = db.query(User).filter(User.email == data.email.lower()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=data.name.strip(),
        email=data.email.lower(),
        password_hash=get_password_hash(data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Account created successfully. Please log in.",
        "email": new_user.email,
    }


@app.post("/auth/login", response_model=AuthResponse)
def login(data: LoginInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@app.get("/auth/me", response_model=AuthUser)
def me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email}


@app.get("/")
def home():
    return {"message": "Crop Yield Prediction API Running"}


@app.post("/predict")
def predict(
    data: CropInput,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    # The trained model expects 7 features due to a saved index-like column.
    # Keep it fixed at 0 to preserve the current request schema.
    input_data = np.array([
        [
            0,
            data.Area,
            data.Item,
            data.Year,
            data.average_rainfall,
            data.pesticides,
            data.avg_temp,
        ]
    ])

    prediction = model.predict(input_data)
    predicted_value = float(prediction[0])

    if current_user:
        prediction_record = Prediction(
            user_id=current_user.id,
            area=data.Area,
            item=data.Item,
            year=data.Year,
            average_rainfall=data.average_rainfall,
            pesticides=data.pesticides,
            avg_temp=data.avg_temp,
            predicted_yield=predicted_value,
        )
        db.add(prediction_record)
        db.commit()

    return {"predicted_yield": predicted_value}


@app.get("/predictions/history", response_model=list[PredictionHistoryOut])
def prediction_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    safe_limit = max(1, min(limit, 100))
    rows = (
        db.query(Prediction)
        .filter(Prediction.user_id == current_user.id)
        .order_by(Prediction.created_at.desc())
        .limit(safe_limit)
        .all()
    )
    return rows