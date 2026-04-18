"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type ApiResponse = {
  status: string;
  message: string;
};

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((res) => res.json())
      .then((json: ApiResponse) => setData(json))
      .catch((e: unknown) => setError(String(e)));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">CatPeace</h1>
      <p className="text-sm text-zinc-500">Backend connection test</p>
      {error && <pre className="text-red-500">{error}</pre>}
      {data && (
        <pre className="rounded bg-zinc-100 p-4 dark:bg-zinc-900">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
      {!data && !error && <p>Loading...</p>}
    </main>
  );
}
