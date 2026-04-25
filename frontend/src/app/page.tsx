"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

type CatAnalysis = {
  is_cat: boolean;
  peace_score: number;
  message: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<CatAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (next: File | null) => {
    setResult(null);
    setError(null);
    if (!next) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    if (!next.type.startsWith("image/")) {
      setError("画像ファイルを選んでください");
      return;
    }
    if (next.size > MAX_UPLOAD_BYTES) {
      setError("10MB以下の画像にしてください");
      return;
    }
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const submit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_URL}/analyze-cat`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = (await res.json()) as CatAnalysis;
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50 px-4 py-10">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-orange-900">CatPeace.io</h1>
          <p className="mt-2 text-orange-700">ふにゃっといこう</p>
        </motion.header>

        <motion.div
          onDragOver={onDragOver}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          animate={{ scale: dragActive ? 1.03 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`w-full cursor-pointer rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragActive
              ? "border-orange-400 bg-orange-100"
              : "border-orange-200 bg-white"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onInputChange}
          />
          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.img
                key={previewUrl}
                src={previewUrl}
                alt="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mx-auto max-h-64 rounded-2xl object-contain"
              />
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-orange-700"
              >
                <p className="text-lg">🐾 画像をドロップ or クリックして選択</p>
                <p className="mt-1 text-sm text-orange-500">
                  PNG / JPG / WEBP（10MBまで）
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {file && !loading && (
            <motion.button
              key="submit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={submit}
              className="rounded-full bg-orange-300 px-8 py-3 font-bold text-orange-900 shadow-sm transition-colors hover:bg-orange-400"
            >
              ふにゃっと鑑定する
            </motion.button>
          )}
        </AnimatePresence>

        {loading && (
          <motion.p
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-orange-700"
          >
            猫を鑑定中...
          </motion.p>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </motion.p>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="w-full rounded-3xl bg-white px-6 py-8 text-center shadow-md"
            >
              <p className="text-sm text-orange-500">Peace Score</p>
              <motion.p
                initial={{ scale: 0.5 }}
                animate={{ scale: [0.5, 1.3, 1] }}
                transition={{ duration: 0.7 }}
                className="my-2 text-6xl font-bold text-orange-500"
              >
                {result.peace_score}
              </motion.p>
              <div className="mx-auto mt-4 h-3 w-full overflow-hidden rounded-full bg-orange-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.peace_score}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full bg-orange-400"
                />
              </div>
              <p className="mt-6 text-lg text-orange-800">{result.message}</p>
              <p className="mt-2 text-sm text-orange-400">
                {result.is_cat ? "🐱 Cat confirmed" : "🙅 Not a cat"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
