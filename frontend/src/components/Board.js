import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import AddColumn from "./AddColumn";
import { useMoveCard, useReorderCards } from "../hooks/useCards";
import {
  useColumns,
  useCreateColumn,
  useReorderColumns,
} from "../hooks/useColumns";

export default function Board() {
  const { columns, loading, error } = useColumns();           
  const { moveCard } = useMoveCard();
  const { reorderCards } = useReorderCards();
  const { createColumn } = useCreateColumn();
  const { reorderColumns } = useReorderColumns();

  const sortedColumns = React.useMemo(
    () =>
      [...columns].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      ),
    [columns]
  );

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const col = sortedColumns.find((c) => c.id === source.droppableId);
      const newOrder = [...col.cards.map((c) => c.id)];
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, draggableId);
      reorderCards({
        variables: { columnId: col.id, order: newOrder },
      });
    } else {
      moveCard({
        variables: {
          cardId: draggableId,
          fromColumnId: source.droppableId,
          toColumnId: destination.droppableId,
          toPosition: destination.index,
        },
      });
    }
  };

  async function handleAddColumn(title) {
    const { data } = await createColumn({ variables: { title } });
    const newId = data.createColumn.column.id;        
        
    const newOrder = [...columns.map(c => c.id), newId];
    reorderColumns({ variables: { order: newOrder } });
  }

  if (loading) return <div>Loading board…</div>;
  if (error) return <div>Error loading board.</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4">
        <AddColumn onAdd={handleAddColumn} />
        {sortedColumns.map((col) => (
          <Column
            key={col.id}
            column={col}
            columns={sortedColumns}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
