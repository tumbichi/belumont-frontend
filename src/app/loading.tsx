import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-300 rounded-full animate-spin border-t-gray-900" />
      {/* <p className="text-black">Belu Mont - Cargando</p> */}
    </div>
  );
}
