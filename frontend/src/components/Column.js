import React, { useState } from "react";
import { Droppable, Draggable as CardDraggable } from "react-beautiful-dnd";
import Card from "./Card";
import {
  useUpdateColumn,
  useDeleteColumn,
  useReorderColumns,
} from "../hooks/useColumns";
import { useMoveCard, useCreateCard } from "../hooks/useCards";

export default function Column({ column, columns }) {
  const defaultCol = columns.find((c) => c.title === "Without Column");
  const defaultId = defaultCol?.id;

  const { updateColumn } = useUpdateColumn();
  const { deleteColumn } = useDeleteColumn();
  const { reorderColumns } = useReorderColumns();
  const { moveCard } = useMoveCard();
  const { createCard } = useCreateCard();

  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(column.title);

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const idx = columns.findIndex((c) => c.id === column.id);

  const handleSaveCol = async () => {
    await updateColumn({
      variables: { id: column.id, title: tempTitle },
    });
    setIsEditing(false);
  };

  const handleCancelCol = () => {
    setTempTitle(column.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete column "${column.title}"?`)) return;
    if (defaultId) {
      for (let i = 0; i < column.cards.length; i++) {
        const c = column.cards[i];
        await moveCard({
          variables: {
            cardId: c.id,
            fromColumnId: column.id,
            toColumnId: defaultId,
            toPosition: i,
          },
        });
      }
    }
    await deleteColumn({ variables: { id: column.id } });
  };

  const movePrev = () => {
    if (idx <= 0) return;
    const ids = columns.map((c) => c.id);
    [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
    reorderColumns({ variables: { order: ids } });
  };

  const moveNext = () => {
    if (idx >= columns.length - 1) return;
    const ids = columns.map((c) => c.id);
    [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
    reorderColumns({ variables: { order: ids } });
  };

  const handleAddClick = () => setIsAddingCard(true);
  const handleSaveCard = async () => {
    if (!newTitle.trim()) return;
    await createCard({
      variables: {
        columnId: column.id,
        title: newTitle,
        description: newDescription,
      },
    });
    setNewTitle("");
    setNewDescription("");
    setIsAddingCard(false);
  };
  const handleCancelCard = () => {
    setNewTitle("");
    setNewDescription("");
    setIsAddingCard(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow w-64 flex-shrink-0">
      <div className="flex items-center justify-between mb-2 group">
        {isEditing ? (
          <input
            className="flex-1 border rounded px-2 py-1"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
          />
        ) : (
          <h2 className="flex-1 font-bold">{column.title}</h2>
        )}
        {!isEditing && (
          <div className="opacity-0 group-hover:opacity-100 flex space-x-2 ml-2">
            <button onClick={() => setIsEditing(true)} className="text-blue-600 text-sm">
              Edit
            </button>
            <button onClick={handleDelete} className="text-red-600 text-sm">
              Delete
            </button>
            <button onClick={movePrev} disabled={idx === 0} className="text-gray-600 text-sm">
              ←
            </button>
            <button
              onClick={moveNext}
              disabled={idx === columns.length - 1}
              className="text-gray-600 text-sm"
            >
              →
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="mb-2 flex justify-end space-x-2">
          <button onClick={handleSaveCol} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
            Save
          </button>
          <button onClick={handleCancelCol} className="border px-3 py-1 rounded text-sm">
            Cancel
          </button>
        </div>
      )}

      <Droppable droppableId={column.id} type="CARD">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2 min-h-[50px]"
          >
            {isAddingCard ? (
              <div className="bg-gray-100 p-2 rounded border space-y-2">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  placeholder="Card title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea
                  className="w-full border rounded px-2 py-1"
                  rows={2}
                  placeholder="Card description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleSaveCard}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Add
                  </button>
                  <button
                    onClick={handleCancelCard}
                    className="border px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="cursor-pointer p-2 rounded border-2 border-dashed text-center text-gray-500"
                onClick={handleAddClick}
              >
                + Add card
              </div>
            )}

            {/* Existing cards */}
            {column.cards.map((card, idx) => (
              <CardDraggable key={card.id} draggableId={card.id} index={idx}>
                {(prov, snapshot) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                    className={snapshot.isDragging ? "opacity-75" : "opacity-100"}
                  >
                    <Card card={card} />
                  </div>
                )}
              </CardDraggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
