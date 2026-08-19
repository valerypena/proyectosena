import sys
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import redis
import json
from config import settings

REDIS_HOST = settings.REDIS_HOST
REDIS_PORT = settings.REDIS_PORT
REDIS_DB = settings.REDIS_DB

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
            print("--> Conectado a Redis exitosamente.")
        except Exception as e:
            print(f"[!] Redis no disponible ({e}). El sistema funcionara sin cache.")
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

    def delete_pattern(self, pattern: str):
        """Elimina todas las claves que coincidan con el patrón dado"""
        if not self.enabled:
            return
        try:
            keys = self.client.keys(pattern)
            if keys:
                self.client.delete(*keys)
        except Exception:
            pass

    def invalidate_all_products(self):
        """Borra todas las keys relacionadas con productos y sugerencias de búsqueda"""
        self.delete_pattern("productos:*")
        self.delete_pattern("sugerencias:*")

cache = RedisCache()
