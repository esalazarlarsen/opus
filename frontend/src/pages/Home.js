import React from "react";
import Board from "../components/Board";
import { useColumns } from "../hooks/useColumns";

export default function Home() {
  const { columns, loading, error } = useColumns();

  if (loading) return <div>Loading board…</div>;
  if (error) return <div>Error loading board.</div>;

  return <Board columns={columns} />;
}
