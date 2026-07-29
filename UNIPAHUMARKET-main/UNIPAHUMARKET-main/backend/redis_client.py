import redis
import json
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))

class RedisCache:
    def __init__(self):
        try:
            self.client = redis.Redis(
                host=REDIS_HOST,
                port=REDIS_PORT,
                db=REDIS_DB,
                decode_responses=True,
                socket_connect_timeout=1,
                socket_timeout=1
            )
            # Verificar conexión
            self.client.ping()
            self.enabled = True
            print("✅ Conectado a Redis exitosamente.")
        except Exception as e:
            print(f"⚠️ Redis no disponible: {e}. El sistema funcionará sin caché.")
            self.enabled = False

    def get(self, key: str):
        if not self.enabled:
            return None
        try:
            data = self.client.get(key)
            return json.loads(data) if data else None
        except:
            return None

    def set(self, key: str, value, expire: int = 300): # 5 min por defecto
        if not self.enabled:
            return
        try:
            self.client.setex(key, expire, json.dumps(value))
        except:
            pass

    def delete(self, key: str):
        if not self.enabled:
            return
        try:
            self.client.delete(key)
        except:
            pass

    def invalidate_all_products(self):
        """Borra todas las keys relacionadas con productos"""
        if not self.enabled:
            return
        try:
            keys = self.client.keys("productos:*")
            if keys:
                self.client.delete(*keys)
        except:
            pass

cache = RedisCache()
