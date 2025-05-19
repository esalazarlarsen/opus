import graphene
from modules.column.schema import Mutation as ColumnMutation
from modules.card.schema   import Mutation as CardMutation

class RootMutation(ColumnMutation, CardMutation, graphene.ObjectType):
    pass
