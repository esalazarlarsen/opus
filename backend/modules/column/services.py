import uuid
from typing import List

from db.client import get_dynamo_resource
from db.migrations import TABLE_NAME
from .models import Column, Card

class ColumnService:
    def __init__(self, table=None):
        ddb = get_dynamo_resource()
        self.table = table or ddb.Table(TABLE_NAME)

    def create_column(self, title: str) -> Column:
        all_cols = self.get_columns()
        max_pos = max((c.position for c in all_cols), default=-1)
        new_pos = max_pos + 1
        new_id = str(uuid.uuid4())
        col = Column(id=new_id, title=title, position=new_pos)
        self.table.put_item(Item=col.__dict__)
        return col

    def get_columns(self) -> List[Column]:
        resp = self.table.scan()
        items = resp.get("Items", [])
        result = []
        for item in items:
            cards = [
                Card(id=c["id"], title=c["title"], description=c["description"])
                for c in item.get("cards", [])
            ]
            result.append(Column(id=item["id"], title=item["title"], cards=cards, position=item["position"]))
        return result

    def update_column(self, id: str, title: str) -> Column:

        self.table.update_item(
            Key={"id": id},
            UpdateExpression="SET title = :t",
            ExpressionAttributeValues={":t": title},
        )

        item = self.table.get_item(Key={"id": id})["Item"]
        cards = [
            Card(id=c["id"], title=c["title"], description=c["description"])
            for c in item.get("cards", [])
        ]

        return Column(
            id=item["id"],
            title=item["title"],
            cards=cards,
            position=item.get("position", 0),
        )

    def delete_column(self, id: str) -> str:
        self.table.delete_item(Key={"id": id})
        return id

    def reorder_columns(self, order: List[str]) -> List[str]:
        for idx, col_id in enumerate(order):
            self.table.update_item(
                Key={"id": col_id},
                UpdateExpression="SET #pos = :p",
                ExpressionAttributeNames={"#pos": "position"},
                ExpressionAttributeValues={":p": idx},
            )
        return order
