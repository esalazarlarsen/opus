import uuid
import time
import botocore

TABLE_NAME = 'KanbanColumns'

def ensure_table_and_seed(ddb):
    client = ddb.meta.client

    for _ in range(10):
        try:
            existing = client.list_tables().get('TableNames', [])
            if TABLE_NAME not in existing:
                print("Creating DynamoDB table…")
                ddb.create_table(
                    TableName=TABLE_NAME,
                    KeySchema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
                    AttributeDefinitions=[{'AttributeName': 'id', 'AttributeType': 'S'}],
                    BillingMode='PAY_PER_REQUEST'
                ).wait_until_exists()
            break
        except botocore.exceptions.EndpointConnectionError:
            time.sleep(2)
    else:
        raise RuntimeError("Cannot connect to DynamoDB.")

    table = ddb.Table(TABLE_NAME)
    count = table.scan().get('Count', 0)

    if count == 0:
        print("Seeding dummy Kanban data…")
        distributions = [4, 4, 4, 4, 4, 4, 6]
        card_num = 1

        for idx, num in enumerate(distributions):
            col_id = str(uuid.uuid4())
            cards = []
            for _ in range(num):
                cards.append({
                    'id': str(uuid.uuid4()),
                    'title': f"Card {card_num}",
                    'description': f"Desc for Card {card_num}"
                })
                card_num += 1

            table.put_item(Item={
                'id': col_id,
                'title': f"Column {idx+1}",
                'cards': cards,
                'position': idx      
            })
            print(f"  • Created Column {idx+1} at position {idx} with {num} cards")

        print("Seeding complete.")
    else:
        print("Table already has data; skipping seed.")
