import os
import time
import sys
import platform
import psutil

def get_system_specs():
    specs = {}
    specs['os'] = platform.system()
    specs['os_release'] = platform.release()
    specs['os_version'] = platform.version()
    specs['architecture'] = platform.machine()
    specs['processor'] = platform.processor()
    specs['cpu_count_logical'] = psutil.cpu_count(logical=True)
    specs['cpu_count_physical'] = psutil.cpu_count(logical=False)
    
    virtual_mem = psutil.virtual_memory()
    specs['ram_total_gb'] = round(virtual_mem.total / (1024**3), 2)
    specs['ram_available_gb'] = round(virtual_mem.available / (1024**3), 2)
    
    disk_usage = psutil.disk_usage('.')
    specs['disk_total_gb'] = round(disk_usage.total / (1024**3), 2)
    specs['disk_free_gb'] = round(disk_usage.free / (1024**3), 2)
    
    return specs

def cpu_benchmark(n=5000):
    start = time.time()
    # Simple CPU intensive task: prime numbers calculation
    primes = []
    for num in range(2, n):
        is_prime = True
        for i in range(2, int(num**0.5) + 1):
            if num % i == 0:
                is_prime = False
                break
        if is_prime:
            primes.append(num)
    end = time.time()
    duration = end - start
    return duration, len(primes)

def disk_benchmark(filename="test_bench.tmp", size_mb=50):
    # Write test
    data = os.urandom(1024 * 1024) # 1MB chunk
    start_write = time.time()
    with open(filename, "wb") as f:
        for _ in range(size_mb):
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
    end_write = time.time()
    write_duration = end_write - start_write
    write_speed = size_mb / write_duration
    
    # Read test
    start_read = time.time()
    with open(filename, "rb") as f:
        while f.read(1024 * 1024):
            pass
    end_read = time.time()
    read_duration = end_read - start_read
    read_speed = size_mb / read_duration
    
    # Clean up
    if os.path.exists(filename):
        os.remove(filename)
        
    return write_speed, read_speed

def main():
    print("==================================================")
    print("   INICIANDO PRUEBA DE RENDIMIENTO DE HARDWARE    ")
    print("==================================================")
    
    try:
        specs = get_system_specs()
    except Exception as e:
        print(f"Error detectando especificaciones: {e}")
        specs = {}
        
    print(f"Sistema Operativo: {specs.get('os')} {specs.get('os_release')} ({specs.get('os_version')})")
    print(f"Arquitectura: {specs.get('architecture')}")
    print(f"Procesador: {specs.get('processor')}")
    print(f"Núcleos de CPU: {specs.get('cpu_count_physical')} físicos, {specs.get('cpu_count_logical')} lógicos")
    print(f"Memoria RAM: {specs.get('ram_total_gb')} GB Totales ({specs.get('ram_available_gb')} GB Disponibles)")
    print(f"Almacenamiento: {specs.get('disk_total_gb')} GB Totales ({specs.get('disk_free_gb')} GB Libres)")
    print("--------------------------------------------------")
    
    print("Ejecutando prueba de CPU (Cálculo de Primos)...")
    cpu_time, num_primes = cpu_benchmark(15000)
    print(f"Resultado CPU: Calculados {num_primes} primos en {cpu_time:.4f} segundos.")
    
    print("Ejecutando prueba de Disco (Lectura/Escritura 50MB)...")
    try:
        write_speed, read_speed = disk_benchmark()
        print(f"Velocidad de Escritura: {write_speed:.2f} MB/s")
        print(f"Velocidad de Lectura: {read_speed:.2f} MB/s")
    except Exception as e:
        print(f"Error en benchmark de disco: {e}")
        write_speed, read_speed = 0.0, 0.0
        
    print("==================================================")
    print("           FIN DE LA PRUEBA DE RENDIMIENTO        ")
    print("==================================================")

if __name__ == "__main__":
    main()
