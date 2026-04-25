import random

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CatPeace API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_UPLOAD_BYTES = 10 * 1024 * 1024

PEACE_MESSAGES = [
    "Liquid cat detected!",
    "Ultimate softness achieved.",
    "ふにゃっと度、最高潮です。",
    "Purring frequency: off the charts.",
    "Your world just got squishier.",
]


class CatAnalysis(BaseModel):
    is_cat: bool
    peace_score: int
    message: str


@app.get("/")
def read_root():
    return {"status": "fnyatto", "message": "World is getting softer."}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze-cat", response_model=CatAnalysis)
async def analyze_cat(file: UploadFile = File(...)) -> CatAnalysis:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    contents = await file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image exceeds 10 MB limit.")

    # AWS Rekognition 連携の準備（接続設定が整うまで Mock 応答を返す）:
    # import boto3
    # rekognition = boto3.client("rekognition")
    # response = rekognition.detect_labels(Image={"Bytes": contents}, MaxLabels=10)
    # labels = [label["Name"].lower() for label in response.get("Labels", [])]
    # is_cat = "cat" in labels

    return CatAnalysis(
        is_cat=True,
        peace_score=random.randint(60, 100),
        message=random.choice(PEACE_MESSAGES),
    )
