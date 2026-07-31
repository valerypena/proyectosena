import requests
import time

def run_tests():
    base_url = "http://127.0.0.1:8000"
    endpoints = [
        {"name": "Verificar Servidor (Root)", "url": "/", "method": "GET"},
        {"name": "Obtener Categorías", "url": "/categorias", "method": "GET"},
        {"name": "Obtener Productos (Límite 10)", "url": "/productos?limit=10", "method": "GET"},
        {"name": "Sugerencias de búsqueda (Vacío)", "url": "/sugerencias?q=", "method": "GET"},
    ]
    
    print("=========================================")
    print("   PRUEBAS DE FUNCIONALIDAD Y RENDIMIENTO")
    print("=========================================")
    
    for ep in endpoints:
        full_url = base_url + ep["url"]
        start_time = time.time()
        try:
            if ep["method"] == "GET":
                response = requests.get(full_url, timeout=5)
            status = response.status_code
            latency = (time.time() - start_time) * 1000
            
            # Print test output in markdown table row format for easy copy/paste
            print(f"| {ep['name']} | {ep['method']} | {ep['url']} | {status} | {latency:.2f} ms | OK |")
        except Exception as e:
            print(f"| {ep['name']} | {ep['method']} | {ep['url']} | ERROR | - | FAILED ({e}) |")

if __name__ == "__main__":
    run_tests()
