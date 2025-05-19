
import { useQuery, useMutation } from "@apollo/client";
import { GET_COLUMNS } from "../graphql/queries";
import {
  CREATE_COLUMN,
  UPDATE_COLUMN,
  DELETE_COLUMN,
  REORDER_COLUMNS
} from "../graphql/mutations";

export function useColumns() {
  const { data, loading, error, refetch } = useQuery(GET_COLUMNS);
  return {
    columns: data?.columns ?? [],
    loading,
    error,
    refetch
  };
}

export function useCreateColumn() {
  const [createColumn, { data, loading, error }] = useMutation(
    CREATE_COLUMN,
    { refetchQueries: [{ query: GET_COLUMNS }] }
  );
  return { createColumn, data, loading, error };
}

export function useUpdateColumn() {
  const [updateColumn, { data, loading, error }] = useMutation(
    UPDATE_COLUMN,
    { refetchQueries: [{ query: GET_COLUMNS }] }
  );
  return { updateColumn, data, loading, error };
}

export function useDeleteColumn() {
  const [deleteColumn, { data, loading, error }] = useMutation(
    DELETE_COLUMN,
    { refetchQueries: [{ query: GET_COLUMNS }] }
  );
  return { deleteColumn, data, loading, error };
}

export function useReorderColumns() {
  const [reorderColumns, { data, loading, error }] = useMutation(
    REORDER_COLUMNS,
    { refetchQueries: [{ query: GET_COLUMNS }] }
  );
  return { reorderColumns, data, loading, error };
}