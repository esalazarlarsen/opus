import { useMutation } from "@apollo/client";
import {
  CREATE_CARD,
  UPDATE_CARD,
  DELETE_CARD,
  MOVE_CARD,
  REORDER_CARDS
} from "../graphql/mutations";
import { GET_COLUMNS } from "../graphql/queries";

export function useCreateCard() {
  const [createCard, { data, loading, error }] = useMutation(CREATE_CARD, {
    refetchQueries: [{ query: GET_COLUMNS }]
  });
  return { createCard, data, loading, error };
}

export function useUpdateCard() {
  const [updateCard, { data, loading, error }] = useMutation(UPDATE_CARD, {
    refetchQueries: [{ query: GET_COLUMNS }]
  });
  return { updateCard, data, loading, error };
}

export function useDeleteCard() {
  const [deleteCard, { data, loading, error }] = useMutation(DELETE_CARD, {
    refetchQueries: [{ query: GET_COLUMNS }]
  });
  return { deleteCard, data, loading, error };
}

export function useMoveCard() {
  const [moveCard, { data, loading, error }] = useMutation(MOVE_CARD, {
    refetchQueries: [{ query: GET_COLUMNS }]
  });
  return { moveCard, data, loading, error };
}

export function useReorderCards() {
  const [reorderCards, { data, loading, error }] = useMutation(REORDER_CARDS, { 
    refetchQueries: [{ query: GET_COLUMNS }] 
  });
  return { reorderCards, data, loading, error };
}
