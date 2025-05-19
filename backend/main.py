from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette_graphene3 import GraphQLApp

from db.client      import get_dynamo_resource
from db.migrations  import ensure_table_and_seed
from api import RootQuery, RootMutation


app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ddb = get_dynamo_resource()
ensure_table_and_seed(ddb)

from graphene import Schema
schema = Schema(query=RootQuery, mutation=RootMutation)

app.add_route("/graphql",  GraphQLApp(schema=schema))
app.add_route("/graphql/", GraphQLApp(schema=schema))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
