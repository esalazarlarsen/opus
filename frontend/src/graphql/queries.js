import { gql } from "@apollo/client";

export const GET_COLUMNS = gql`
  query GetColumns {
    columns {
      id
      title
      position          
      cards {
        id
        title
        description
      }
    }
  }
`;
