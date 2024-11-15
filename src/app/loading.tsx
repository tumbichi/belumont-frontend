import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-main-500">
      <div className="duration-75 animate-pulse">
        <p className="text-black">Belu Mont - Cargando</p>
      </div>
    </div>
  );
}
