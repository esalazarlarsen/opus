import React, { useState } from "react";

export default function AddColumn({ onAdd }) {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
    setActive(false);
  };

  if (active) {
    return (
      <div className="bg-white p-4 rounded shadow w-64 min-w-[16rem]">
        <input
          type="text"
          placeholder="Column title"
          className="w-full border px-2 py-1 rounded mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Add
          </button>
          <button
            onClick={() => setActive(false)}
            className="border px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-w-[16rem] h-24 flex items-center justify-center border-2 border-dashed text-gray-500 rounded cursor-pointer"
      onClick={() => setActive(true)}
    >
      + Add column
    </div>
  );
}
