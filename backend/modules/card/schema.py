import graphene
from graphene import ObjectType, ID, String, List, Field, Mutation, Int

from .services import CardService
from .models import Card

service = CardService()

class CardType(ObjectType):
    id = ID()
    title = String()
    description = String()

class CreateCard(Mutation):
    class Arguments:
        columnId    = ID(required=True)
        title       = String(required=True)
        description = String(required=True)

    card = Field(CardType)

    def mutate(self, info, columnId, title, description):
        c = service.create_card(columnId, title, description)
        return CreateCard(card=c)

class UpdateCard(Mutation):
    class Arguments:
        id          = ID(required=True)
        title       = String()
        description = String()

    card = Field(CardType)

    def mutate(self, info, id, title=None, description=None):
        c = service.update_card(id, title, description)
        return UpdateCard(card=c)

class DeleteCard(Mutation):
    class Arguments:
        id = ID(required=True)

    deleted_id = ID()

    def mutate(self, info, id):
        deleted = service.delete_card(id)
        return DeleteCard(deleted_id=deleted)

class MoveCard(Mutation):
    class Arguments:
        cardId       = ID(required=True)
        fromColumnId = ID(required=True)
        toColumnId   = ID(required=True)
        toPosition   = Int(required=True)

    card = Field(CardType)

    def mutate(self, info, cardId, fromColumnId, toColumnId, toPosition):
        c = service.move_card(cardId, fromColumnId, toColumnId, toPosition)
        return MoveCard(card=c)

class ReorderCards(Mutation):
    class Arguments:
        columnId = ID(required=True)
        order    = List(ID, required=True)

    order = List(ID)

    def mutate(self, info, columnId, order):
        new_order = service.reorder_cards(columnId, order)
        return ReorderCards(order=new_order)

class Mutation(ObjectType):
    create_card    = CreateCard.Field()
    update_card    = UpdateCard.Field()
    delete_card    = DeleteCard.Field()
    move_card      = MoveCard.Field()
    reorder_cards  = ReorderCards.Field()
