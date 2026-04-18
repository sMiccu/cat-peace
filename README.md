# CatPeace

猫のふにゃっと度で世界を柔らかくするプロジェクト。

## 技術スタック

- **Backend**: FastAPI 0.136.0 / uvicorn 0.42.0 (Python 3.11)
- **Frontend**: Next.js 16 (App Router, TypeScript, Tailwind CSS v4, Turbopack)
- **Container**: Docker / Docker Compose
- **Deploy (想定)**: AWS Lambda + Lambda Web Adapter 1.0.0

## ディレクトリ構成

```text
cat-peace/
├── backend/              # FastAPI
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile        # Lambda Web Adapter 同梱
│   └── .dockerignore
├── frontend/             # Next.js (App Router)
│   ├── src/app/
│   ├── Dockerfile
│   └── .dockerignore
└── docker-compose.yml
```

## 必要な環境

- Docker Desktop (Compose V2 以降)
- Node.js 20+ (ローカルで `npm` を直接使う場合)
- Python 3.11+ (ローカルで Python を直接使う場合)

## 起動方法

```bash
docker compose up --build
```

## 動作確認 URL

| 用途 | URL |
| :--- | :--- |
| Backend ルート | <http://localhost:8080/> |
| Backend Swagger UI | <http://localhost:8080/docs> |
| Frontend トップ | <http://localhost:3000/> |

## 停止

```bash
docker compose down
```

## 設計メモ

- Lambda 専用のコードを書かず、Lambda Web Adapter で抽象化することでベンダーロックインを回避する方針。
- Frontend → Backend の通信は `NEXT_PUBLIC_API_URL` で切り替え可能。
