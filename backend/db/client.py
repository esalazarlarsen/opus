import boto3
from botocore.config import Config
from config import settings

def get_dynamo_resource():
    return boto3.resource(
        'dynamodb',
        endpoint_url=settings.DYNAMODB_ENDPOINT_URL,
        region_name=settings.AWS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        config=Config(retries={'max_attempts': 0})
    )
