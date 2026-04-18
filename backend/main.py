from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="CatPeace API")


class FunyattoStatus(BaseModel):
    message: str
    level: int


@app.get("/")
def read_root():
    return {"status": "fnyatto", "message": "World is getting softer."}


@app.get("/health")
def health_check():
    return {"status": "ok"}
