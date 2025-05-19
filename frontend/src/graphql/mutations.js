import { gql } from "@apollo/client";

export const CREATE_COLUMN = gql`
  mutation CreateColumn($title: String!) {
    createColumn(title: $title) {
      column {
        id
        title
        position
      }
    }
  }
`;

export const UPDATE_COLUMN = gql`
  mutation UpdateColumn($id: ID!, $title: String!) {
    updateColumn(id: $id, title: $title) {
      column {
        id
        title
        position
      }
    }
  }
`;

export const DELETE_COLUMN = gql`
  mutation DeleteColumn($id: ID!) {
    deleteColumn(id: $id) {
      deletedId
    }
  }
`;

export const REORDER_COLUMNS = gql`
  mutation ReorderColumns($order: [ID!]!) {
    reorderColumns(order: $order) {
      columns {
        id
        position
      }
    }
  }
`;

export const CREATE_CARD = gql`
  mutation CreateCard($columnId: ID!, $title: String!, $description: String!) {
    createCard(columnId: $columnId, title: $title, description: $description) {
      card {
        id
        title
        description
      }
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: ID!, $title: String, $description: String) {
    updateCard(id: $id, title: $title, description: $description) {
      card {
        id
        title
        description
      }
    }
  }
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id) {
      deletedId
    }
  }
`;

export const MOVE_CARD = gql`
  mutation MoveCard(
    $cardId: ID!
    $fromColumnId: ID!
    $toColumnId: ID!
    $toPosition: Int!
  ) {
    moveCard(
      cardId: $cardId
      fromColumnId: $fromColumnId
      toColumnId: $toColumnId
      toPosition: $toPosition
    ) {
      card {
        id
        title
        description
      }
    }
  }
`;

export const REORDER_CARDS = gql`
  mutation ReorderCards($columnId: ID!, $order: [ID!]!) {
    reorderCards(columnId: $columnId, order: $order) {
      order
    }
  }
`;
