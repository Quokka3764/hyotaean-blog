"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-4">
        오류가 발생했습니다
      </h2>
      <p className="mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        다시 시도
      </button>
    </div>
  );
}
