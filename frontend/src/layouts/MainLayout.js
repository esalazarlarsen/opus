import React from "react";

export default function MainLayout({ children }) {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 text-xl font-bold">
        Opus Challenge - Kanban Board
      </header>
      <main className="flex-1 p-4 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}
