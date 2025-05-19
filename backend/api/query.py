import graphene
from modules.column.schema import Query as ColumnQuery

class RootQuery(ColumnQuery, graphene.ObjectType):
    pass
