import uuid
from typing import List, Optional

from db.client import get_dynamo_resource
from db.migrations import TABLE_NAME
from .models import Card

class CardService:
    def __init__(self, table=None):
        ddb = get_dynamo_resource()
        self.table = table or ddb.Table(TABLE_NAME)

    def create_card(self, column_id: str, title: str, description: str) -> Card:
        resp = self.table.get_item(Key={"id": column_id})
        col = resp.get("Item")
        if not col:
            raise Exception(f"Column {column_id} not found")
        new_card = Card(id=str(uuid.uuid4()), title=title, description=description)
        updated = col.get("cards", []) + [new_card.__dict__]
        self.table.update_item(
            Key={"id": column_id},
            UpdateExpression="SET cards = :c",
            ExpressionAttributeValues={":c": updated},
        )
        return new_card

    def update_card(
        self,
        card_id: str,
        title: Optional[str] = None,
        description: Optional[str] = None
    ) -> Card:
        resp = self.table.scan()
        for item in resp.get("Items", []):
            cards = item.get("cards", [])
            for c in cards:
                if c["id"] == card_id:
                    if title is not None:
                        c["title"] = title
                    if description is not None:
                        c["description"] = description
                    self.table.update_item(
                        Key={"id": item["id"]},
                        UpdateExpression="SET cards = :c",
                        ExpressionAttributeValues={":c": cards},
                    )
                    return Card(**c)
        raise Exception(f"Card {card_id} not found")

    def delete_card(self, card_id: str) -> str:
        resp = self.table.scan()
        for item in resp.get("Items", []):
            cards = item.get("cards", [])
            if any(c["id"] == card_id for c in cards):
                filtered = [c for c in cards if c["id"] != card_id]
                self.table.update_item(
                    Key={"id": item["id"]},
                    UpdateExpression="SET cards = :c",
                    ExpressionAttributeValues={":c": filtered},
                )
                return card_id
        raise Exception(f"Card {card_id} not found")

    def move_card(
        self,
        card_id: str,
        from_column_id: str,
        to_column_id: str,
        to_position: int
    ) -> Card:
        from_item = self.table.get_item(Key={"id": from_column_id}).get("Item")
        to_item   = self.table.get_item(Key={"id": to_column_id}).get("Item")
        if not from_item or not to_item:
            raise Exception("One or both columns not found")

        cards_from = from_item.get("cards", [])
        card_data = None
        new_from = []
        for c in cards_from:
            if c["id"] == card_id:
                card_data = c
            else:
                new_from.append(c)
        if not card_data:
            raise Exception(f"Card {card_id} not in column {from_column_id}")

        cards_to = to_item.get("cards", [])
        cards_to.insert(to_position, card_data)

        self.table.update_item(
            Key={"id": from_column_id},
            UpdateExpression="SET cards = :c",
            ExpressionAttributeValues={":c": new_from},
        )
        self.table.update_item(
            Key={"id": to_column_id},
            UpdateExpression="SET cards = :c",
            ExpressionAttributeValues={":c": cards_to},
        )

        return Card(**card_data)

    def reorder_cards(self, column_id: str, order: List[str]) -> List[str]:
        resp = self.table.get_item(Key={"id": column_id})
        item = resp.get("Item")
        if not item:
            raise Exception(f"Column {column_id} not found")
        cards = item.get("cards", [])
        lookup = {c["id"]: c for c in cards}
        new_cards = [lookup[cid] for cid in order if cid in lookup]
        self.table.update_item(
            Key={"id": column_id},
            UpdateExpression="SET cards = :c",
            ExpressionAttributeValues={":c": new_cards},
        )
        return order
