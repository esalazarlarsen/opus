import React, { useState } from "react";
import { useUpdateCard, useDeleteCard } from "../hooks/useCards";

export default function Card({ card }) {
  const { updateCard } = useUpdateCard();
  const { deleteCard } = useDeleteCard();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  const handleSave = async () => {
    await updateCard({ variables: { id: card.id, title, description } });
    setIsEditing(false);
  };
  const handleCancel = () => {
    setTitle(card.title);
    setDescription(card.description);
    setIsEditing(false);
  };
  const handleDelete = async () => {
    if (window.confirm(`Delete card “${card.title}”?`)) {
      await deleteCard({ variables: { id: card.id } });
    }
  };

  return (
    <div className="relative group bg-white p-2 rounded border">
      {isEditing ? (
        <div className="space-y-2">
          <input
            className="w-full border rounded px-2 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border rounded px-2 py-1"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="border px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-medium text-gray-800">{card.title}</h3>
          <p className="text-sm text-gray-600">{card.description}</p>
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex space-x-1">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 text-xs"
              aria-label="Edit card"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 text-xs"
              aria-label="Delete card"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
