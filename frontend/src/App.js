import React from "react";
import { ApolloProvider } from "@apollo/client";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import { client } from "./services/apollo";

export default function App() {
  return (
    <ApolloProvider client={client}>
        <MainLayout>
          <Home />
        </MainLayout>
    </ApolloProvider>
  );
}
