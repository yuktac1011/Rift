from confluent_kafka import Producer, Consumer
import json
from app.core.logging import logger

class KafkaEventBus:
    def __init__(self, bootstrap_servers: str = "localhost:9092"):
        self.producer = Producer({'bootstrap.servers': bootstrap_servers})
        self.consumer = Consumer({
            'bootstrap.servers': bootstrap_servers,
            'group.id': 'rift-observation-group',
            'auto.offset.reset': 'earliest'
        })
    
    def produce(self, topic: str, key: str, value: dict):
        def delivery_report(err, msg):
            if err is not None:
                logger.error(f"Message delivery failed: {err}")
            else:
                logger.debug(f"Message delivered to {msg.topic()} [{msg.partition()}]")
                
        self.producer.produce(
            topic, 
            key=key.encode('utf-8'), 
            value=json.dumps(value).encode('utf-8'), 
            callback=delivery_report
        )
        self.producer.poll(0)
    
    def flush(self):
        self.producer.flush()

event_bus = KafkaEventBus()
