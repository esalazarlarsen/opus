import graphene
from graphene import ObjectType, String, ID, List, Field, Mutation, Int

from .models import Column, Card
from .services import ColumnService

service = ColumnService()

class CardType(ObjectType):
    id = ID()
    title = String()
    description = String()

class ColumnType(ObjectType):
    id = ID()
    title = String()
    position = Int()              
    cards = List(CardType)

class Query(ObjectType):
    columns = List(ColumnType)

    def resolve_columns(self, info):
        return service.get_columns()

class CreateColumn(Mutation):
    class Arguments:
        title = String(required=True)

    column = Field(ColumnType)

    def mutate(self, info, title):
        col = service.create_column(title)
        return CreateColumn(column=col)

class UpdateColumn(Mutation):
    class Arguments:
        id = ID(required=True)
        title = String(required=True)

    column = Field(ColumnType)

    def mutate(self, info, id, title):
        col = service.update_column(id, title)
        return UpdateColumn(column=col)

class DeleteColumn(Mutation):
    class Arguments:
        id = ID(required=True)

    deleted_id = ID()

    def mutate(self, info, id):
        deleted = service.delete_column(id)
        return DeleteColumn(deleted_id=deleted)

class ReorderColumns(Mutation):
    class Arguments:
        order = List(ID, required=True)

    columns = List(ColumnType)

    def mutate(self, info, order):
        service.reorder_columns(order)
        return ReorderColumns(columns=service.get_columns())

class Mutation(ObjectType):
    create_column    = CreateColumn.Field()
    update_column    = UpdateColumn.Field()
    delete_column    = DeleteColumn.Field()
    reorder_columns  = ReorderColumns.Field()
