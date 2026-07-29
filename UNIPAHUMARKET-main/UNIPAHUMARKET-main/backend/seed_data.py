from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Usuario, Emprendimiento, Categoria, Producto, RolUsuario
import bcrypt

# Función simple para hashear (sin passlib para evitar conflictos de versiones)
def get_password_hash(password):
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')

def seed_data():
    db = SessionLocal()
    
    print("Iniciando inserción de datos de prueba...")

    # 1. CATEGORIAS (Basadas en la imagen proporcionada)
    lista_categorias = [
        "Vehículos", "Supermercado", "Tecnología", "Farmacia", 
        "Electrodomésticos", "Hogar y Muebles", "Deportes y Fitness", 
        "Belleza y Cuidado Personal", "Accesorios para Vehículos", "Herramientas",
        "Construcción", "Mascotas", "Inmuebles", "Internacional", "Moda",
        "Juegos y Juguetes", "Bebés", "Productos Sustentables", 
        "Salud y Equipamiento Médico", "Industrias y Oficinas", "Servicios"
    ]

    categorias_db = []
    print("--- Creando Categorías ---")
    for nombre in lista_categorias:
        cat = db.query(Categoria).filter(Categoria.nombre == nombre).first()
        if not cat:
            cat = Categoria(nombre=nombre, descripcion=f"Productos relacionados con {nombre}")
            db.add(cat)
            print(f"  + Categoría añadida: {nombre}")
        categorias_db.append(cat)
    db.commit()

    # Recargar categorías desde la BD para tener sus IDs
    categorias_map = {c.nombre: c for c in db.query(Categoria).all()}

    # 2. USUARIOS (VENDEDORES) Y EMPRENDIMIENTOS
    datos_vendedores = [
        ("Juan Perez", "juan@techzone.com", "TechZone", "Tecnología", "Lo último en gadgets y computación."),
        ("Maria Gomez", "maria@modaurbana.com", "Moda Urbana", "Moda", "Ropa casual y tendencias actuales."),
        ("Carlos Ruiz", "carlos@autopartes.com", "AutoPartes Express", "Accesorios para Vehículos", "Repuestos y accesorios parea tu auto."),
        ("Ana Lopez", "ana@fitlife.com", "FitLife Store", "Deportes y Fitness", "Equipamiento para entrenar en casa."),
        ("Luis Torres", "luis@electrohogar.com", "ElectroHogar", "Electrodomésticos", "Equipa tu cocina con lo mejor."),
        ("Sofia Diaz", "sofia@beautyglow.com", "BeautyGlow", "Belleza y Cuidado Personal", "Cosméticos y cuidado de la piel."),
        ("Pedro Maza", "pedro@toyworld.com", "ToyWorld", "Juegos y Juguetes", "Diversión para todas las edades."),
        ("Elena Bo", "elena@greenmarket.com", "GreenMarket", "Productos Sustentables", "Productos ecológicos y orgánicos."),
        ("Jorge Viela", "jorge@constructora.com", "ConstruPro", "Construcción", "Materiales de alta calidad."),
        ("Lucia Miau", "lucia@petamigos.com", "PetAmigos", "Mascotas", "Todo para tu mejor amigo peludo."),
        ("Laura Muebles", "laura@home.com", "HomeStyle", "Hogar y Muebles", "Decoración y muebles de diseño."),
        ("Mario Market", "mario@market.com", "SuperMax", "Supermercado", "Alimentos y bebidas frescos.")
    ]

    print("\n--- Creando Vendedores y Emprendimientos ---")
    for nombre_user, email, marca, cat_principal, desc_marca in datos_vendedores:
        # Crear Usuario
        user = db.query(Usuario).filter(Usuario.email == email).first()
        if not user:
            user = Usuario(
                nombre_completo=nombre_user,
                email=email,
                contrasena_hash=get_password_hash("123456"),
                rol=RolUsuario.VENDEDOR
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"  + Usuario Vendedor creado: {nombre_user} ({email})")

        # Crear Emprendimiento
        venture = db.query(Emprendimiento).filter(Emprendimiento.nombre_marca == marca).first()
        if not venture:
            # Map category to keyword for logo
            cat_keyword = "business"
            if "Tecnología" in cat_principal: cat_keyword = "tech"
            elif "Moda" in cat_principal: cat_keyword = "fashion"
            elif "Mascotas" in cat_principal: cat_keyword = "pets"
            elif "Hogar" in cat_principal: cat_keyword = "furniture"
            
            venture = Emprendimiento(
                usuario_id=user.id,
                nombre_marca=marca,
                descripcion=desc_marca,
                url_logo=f"https://loremflickr.com/300/300/{cat_keyword}?lock={len(marca)}"
            )
            db.add(venture)
            db.commit()
            db.refresh(venture)
            print(f"    -> Emprendimiento creado: {marca}")

    # 3. PRODUCTOS EXTENDIDOS (100+ Productos)
    # Lista de tuplas: (Nombre, Descripcion, Precio, Stock, Indice_Emprendimiento, Nombre_Categoria, Keyword_Imagen)
    datos_productos = [
        # --- TEGNOLOGÍA (TechZone - 0) ---
        ("Smartphone Galaxy X", "Teléfono inteligente con cámara de 108MP y pantalla AMOLED.", 3500000, 50, 0, "Tecnología", "smartphone,samsung"),
        ("Laptop ProBook 15", "Portátil ligero para trabajo y diseño. 16GB RAM.", 4200000, 30, 0, "Tecnología", "laptop,notebook"),
        ("Auriculares Inalámbricos", "Cancelación de ruido activa, 20h de batería.", 250000, 80, 0, "Tecnología", "headphones,wireless"),
        ("Tablet 10 Pulgadas", "Ideal para estudiantes y multimedia.", 850000, 45, 0, "Tecnología", "tablet,ipad"),
        ("Smartwatch Deportivo", "Monitor de ritmo cardíaco y GPS.", 450000, 60, 0, "Tecnología", "smartwatch,watch"),
        ("Monitor Curvo 27", "Pantalla 4K con tasa de refresco 144Hz.", 1200000, 20, 0, "Tecnología", "monitor,screen"),
        ("Teclado Mecánico RGB", "Switches azules, iluminación personalizable.", 280000, 50, 0, "Tecnología", "keyboard,rgb"),
        ("Mouse Gamer", "Alta precisión 16000 DPI.", 120000, 70, 0, "Tecnología", "mouse,computer"),
        ("Impresora Multifuncional", "Wifi, escáner y copias a color.", 650000, 15, 0, "Tecnología", "printer,office"),
        ("Disco Duro Externo 2TB", "Almacenamiento portátil y resistente.", 320000, 40, 0, "Tecnología", "harddrive,technology"),
        
        # --- MODA (Moda Urbana - 1) ---
        ("Camiseta Algodón Básica", "Camiseta 100% algodón, varios colores.", 45000, 100, 1, "Moda", "tshirt,clothing"),
        ("Jeans Slim Fit", "Pantalones vaqueros de corte ajustado.", 120000, 60, 1, "Moda", "jeans,denim"),
        ("Zapatillas Urbanas", "Comodidad para el día a día.", 180000, 40, 1, "Moda", "sneakers,shoes"),
        ("Chaqueta de Cuero", "Estilo clásico, 100% cuero genuino.", 450000, 20, 1, "Moda", "jacket,leather"),
        ("Gorra Snapback", "Diseño moderno ajustable.", 65000, 80, 1, "Moda", "cap,hat"),
        ("Vestido de Verano", "Estampado floral, tela ligera.", 95000, 50, 1, "Moda", "dress,summer"),
        ("Sudadera con Capucha", "Interior polar, muy abrigada.", 110000, 45, 1, "Moda", "hoodie,sweatshirt"),
        ("Botines de Cuero", "Suela de goma, ideales para invierno.", 280000, 30, 1, "Moda", "boots,leather"),
        ("Traje de Baño", "Secado rápido, diseño deportivo.", 85000, 60, 1, "Moda", "swimsuit,beach"),
        ("Bufanda de Lana", "Tejida a mano, varios colores.", 45000, 90, 1, "Moda", "scarf,winter"),

        # --- ACCESORIOS VEHICULOS (AutoPartes - 2) ---
        ("Kit Limpieza Auto", "Shampoo, cera y paños de microfibra.", 85000, 40, 2, "Accesorios para Vehículos", "carwash,cleaning"),
        ("Soporte Celular Auto", "Soporte magnético universal para rejilla.", 35000, 150, 2, "Accesorios para Vehículos", "phoneholder,car"),
        ("Protector Parabrisas", "Evita el calentamiento del interior.", 45000, 70, 2, "Accesorios para Vehículos", "windshield,car"),
        ("Compresor Aire Portátil", "Infla neumáticos en minutos, conexión 12V.", 150000, 35, 2, "Accesorios para Vehículos", "compressor,tire"),
        ("Cámara de Retroceso", "Visión nocturna y pantalla LCD.", 180000, 25, 2, "Accesorios para Vehículos", "camera,car"),
        ("Aceite de Motor Sintético", "Protección avanzada para tu motor.", 120000, 50, 2, "Accesorios para Vehículos", "oil,engine"),
        ("Juego de Alfombras Auto", "Goma resistente y antideslizante.", 95000, 30, 2, "Accesorios para Vehículos", "carmats,floor"),
        ("Luces LED H4", "Mayor visibilidad en carretera.", 110000, 60, 2, "Accesorios para Vehículos", "led,headlights"),
        ("Cargador Batería Auto", "Arranca tu auto en emergencias.", 220000, 20, 2, "Accesorios para Vehículos", "battery,charger"),
        ("Organizador Maletero", "Mantén el orden en tu vehículo.", 55000, 45, 2, "Accesorios para Vehículos", "trunk,organizer"),

        # --- DEPORTES (FitLife - 3) ---
        ("Mancuernas 5kg (Par)", "Mancuernas de vinilo para ejercicio en casa.", 90000, 20, 3, "Deportes y Fitness", "dumbbell,gym"),
        ("Tapete Yoga Antideslizante", "Tapete ecológico de 6mm de grosor.", 75000, 45, 3, "Deportes y Fitness", "yogamat,exercise"),
        ("Banda Elástica Resistencia", "Set de 3 niveles de resistencia.", 45000, 100, 3, "Deportes y Fitness", "resistancebands,fitness"),
        ("Balón de Fútbol Pro", "Tamaño oficial, costuras reforzadas.", 110000, 50, 3, "Deportes y Fitness", "soccerball,football"),
        ("Botella Agua Deportiva", "Acero inoxidable, mantiene frío 24h.", 65000, 80, 3, "Deportes y Fitness", "waterbottle,sport"),
        ("Bicicleta Estática", "Pantalla LCD, resistencia ajustable.", 850000, 10, 3, "Deportes y Fitness", "exercisebike,cycling"),
        ("Rodillo Espuma Masaje", "Recuperación muscular post-entreno.", 55000, 60, 3, "Deportes y Fitness", "foamroller,massage"),
        ("Guantes de Boxeo", "Protección de muñeca, cuero sintético.", 130000, 25, 3, "Deportes y Fitness", "boxinggloves,boxing"),
        ("Cuerda para Saltar", "Rodamientos rápidos, cable ajustable.", 25000, 120, 3, "Deportes y Fitness", "jumprope,fitness"),
        ("Pesas Tobilleras", "Añade intensidad a tus caminatas.", 60000, 40, 3, "Deportes y Fitness", "ankleweights,exercise"),

        # --- ELECTRODOMESTICOS (ElectroHogar - 4) ---
        ("Licuadora Potente 500W", "Tritura hielo y frutas congeladas.", 220000, 25, 4, "Electrodomésticos", "blender,kitchen"),
        ("Freidora de Aire 4L", "Cocina sin aceite, capacidad familiar.", 350000, 35, 4, "Electrodomésticos", "airfryer,cooking"),
        ("Cafetera Programable", "Despierta con café recién hecho.", 180000, 30, 4, "Electrodomésticos", "coffeemaker,coffee"),
        ("Aspiradora Robot", "Limpieza automática con sensores.", 850000, 15, 4, "Electrodomésticos", "robotvacuum,cleaning"),
        ("Plancha a Vapor", "Suela antiadherente y golpe de vapor.", 120000, 40, 4, "Electrodomésticos", "iron,clothes"),
        ("Microondas Digital", "Varios programas de cocción.", 420000, 20, 4, "Electrodomésticos", "microwave,kitchen"),
        ("Tostadora 2 Rebanadas", "Niveles de tostado ajustables.", 95000, 50, 4, "Electrodomésticos", "toaster,kitchen"),
        ("Batidora de Mano", "Ideal para repostería.", 110000, 45, 4, "Electrodomésticos", "handmixer,baking"),
        ("Hervidor Eléctrico", "Hierve agua en segundos.", 85000, 60, 4, "Electrodomésticos", "kettle,kitchen"),
        ("Picadora de Alimentos", "Práctica y fácil de limpiar.", 130000, 35, 4, "Electrodomésticos", "foodchopper,kitchen"),

        # --- BELLEZA (BeautyGlow - 5) ---
        ("Crema Hidratante Facial", "Con ácido hialurónico y vitamina C.", 65000, 80, 5, "Belleza y Cuidado Personal", "facecream,skincare"),
        ("Set Brochas Maquillaje", "Kit profesional de 12 piezas.", 85000, 50, 5, "Belleza y Cuidado Personal", "makeupbrushes,beauty"),
        ("Secador de Pelo Profesional", "Motor potente, secado rápido.", 190000, 30, 5, "Belleza y Cuidado Personal", "hairdryer,hair"),
        ("Perfume Floral 100ml", "Fragancia fresca y duradera.", 150000, 40, 5, "Belleza y Cuidado Personal", "perfume,fragrance"),
        ("Mascarilla Capilar", "Reparación intensiva para cabello dañado.", 55000, 60, 5, "Belleza y Cuidado Personal", "hairmask,haircare"),
        ("Labial Mate", "Larga duración, no reseca.", 42000, 100, 5, "Belleza y Cuidado Personal", "lipstick,makeup"),
        ("Paleta de Sombras", "Tonos tierra y brillantes.", 95000, 40, 5, "Belleza y Cuidado Personal", "eyeshadow,makeup"),
        ("Rizador de Pestañas", "Curvatura perfecta al instante.", 25000, 70, 5, "Belleza y Cuidado Personal", "eyelashcurler,beauty"),
        ("Aceite Corporal Coco", "Hidratación profunda.", 48000, 55, 5, "Belleza y Cuidado Personal", "bodyoil,skincare"),
        ("Exfoliante Facial", "Elimina impurezas suavemente.", 52000, 65, 5, "Belleza y Cuidado Personal", "facescrub,skincare"),
        
        # --- JUGUETES (ToyWorld - 6) ---
        ("Juego de Mesa Estrategia", "Conquista territorios y gana la partida.", 130000, 15, 6, "Juegos y Juguetes", "boardgame,strategy"),
        ("Peluche Oso Gigante", "Oso de peluche suave de 1 metro.", 150000, 10, 6, "Juegos y Juguetes", "teddybear,toy"),
        ("Bloques de Construcción", "Set de 500 piezas creativas.", 95000, 45, 6, "Juegos y Juguetes", "buildingblocks,lego"),
        ("Muñeca Articulada", "Incluye accesorios y ropa.", 85000, 50, 6, "Juegos y Juguetes", "doll,toy"),
        ("Carro Control Remoto", "Todo terreno, batería recargable.", 160000, 25, 6, "Juegos y Juguetes", "rccar,toy"),
        ("Puzzle 1000 Piezas", "Paisaje de montaña.", 70000, 30, 6, "Juegos y Juguetes", "jigsawpuzzle,toy"),
        ("Set de Arte Infantil", "Pinturas, colores y libretas.", 65000, 40, 6, "Juegos y Juguetes", "artset,kids"),
        ("Balón Baloncesto Mini", "Para canasta pequeña.", 45000, 60, 6, "Juegos y Juguetes", "basketball,toy"),
        ("Juego de Cartas Uno", "Diversión para toda la familia.", 25000, 100, 6, "Juegos y Juguetes", "cardgame,uno"),
        ("Dinosaurio T-Rex", "Con sonidos y movimiento.", 90000, 35, 6, "Juegos y Juguetes", "dinosaur,toy"),

        # --- SUSTENTABLES (GreenMarket - 7) --- 
        ("Cepillo Dientes Bambú", "Pack de 4 cepillos biodegradables.", 35000, 200, 7, "Productos Sustentables", "toothbrush,bamboo"),
        ("Bolsas Reutilizables", "Set de bolsas de malla para frutas y verduras.", 28000, 150, 7, "Productos Sustentables", "ecobag,reusable"),
        ("Shampoo Sólido", "Sin plástico, natural y vegano.", 42000, 80, 7, "Productos Sustentables", "barshampoo,soap"),
        ("Botella Vidrio Filtro", "Agua pura en movimiento.", 75000, 60, 7, "Productos Sustentables", "glassbottle,eco"),
        ("Lámpara Solar Jardín", "Carga con el sol, encendido automático.", 65000, 40, 7, "Productos Sustentables", "solarlight,garden"),
        ("Popotes de Acero Inox", "Incluye cepillo limpiador.", 22000, 120, 7, "Productos Sustentables", "reuseablestraw,eco"),
        ("Cuaderno Papel Reciclado", "Hojas ecológicas sin blanquear.", 25000, 90, 7, "Productos Sustentables", "notebook,recycled"),
        ("Jabón Artesanal Avena", "Para pieles sensibles.", 18000, 100, 7, "Productos Sustentables", "soap,handmade"),
        ("Bolsa de Tela Algodón", "Diseño minimalista.", 15000, 200, 7, "Productos Sustentables", "totebag,cotton"),
        ("Vela de Cera de Soja", "Aroma lavanda natural.", 55000, 50, 7, "Productos Sustentables", "candle,soy"),

        # --- CONSTRUCCION y HERRAMIENTAS (ConstruPro - 8) ---
        ("Taladro Percutor", "Taladro inalámbrico con batería recargable.", 380000, 12, 8, "Herramientas", "powerdrill,tools"),
        ("Set Destornilladores", "Puntas magnéticas de alta resistencia.", 55000, 60, 8, "Herramientas", "screwdrivers,tools"),
        ("Caja de Herramientas", "Organizadora plástica resistente.", 85000, 30, 8, "Herramientas", "toolbox,tools"),
        ("Metro Láser 40m", "Medición precisa y rápida.", 190000, 20, 8, "Construcción", "lasermeasure,tool"),
        ("Guantes de Trabajo", "Protección y agarre antideslizante.", 25000, 100, 8, "Construcción", "workgloves,safety"),
        ("Martillo Mango Fibra", "Ligero y resistente.", 45000, 40, 8, "Herramientas", "hammer,tools"),
        ("Cinta Métrica 5m", "Retráctil con bloqueo.", 28000, 80, 8, "Herramientas", "tapemeasure,tools"),
        ("Juego Llaves Allen", "Diferentes tamaños milimétricos.", 35000, 55, 8, "Herramientas", "allenkeys,tools"),
        ("Sierra de Mano", "Corte rápido en madera.", 55000, 35, 8, "Construcción", "handsaw,tools"),
        ("Nivel de Burbuja", "Asegura la precisión.", 42000, 45, 8, "Construcción", "spiritlevel,tools"),

        # --- MASCOTAS (PetAmigos - 9) ---
        ("Cama para Perro Mediano", "Colchón ortopédico y lavable.", 160000, 25, 9, "Mascotas", "dogbed,pet"),
        ("Juguete Rascador Gato", "Torre con sisal y pelotas colgantes.", 110000, 18, 9, "Mascotas", "catscratcher,pet"),
        ("Collar con GPS", "Localiza a tu mascota en tiempo real.", 220000, 15, 9, "Mascotas", "dogcollar,pet"),
        ("Kit Comedero Bebedero", "Acero inoxidable, base antideslizante.", 65000, 50, 9, "Mascotas", "petbowl,dog"),
        ("Pelota Resistente Perro", "Ideal para morder y jugar.", 35000, 80, 9, "Mascotas", "dogball,toy"),
        ("Correa Retráctil", "5 metros, freno seguro.", 65000, 40, 9, "Mascotas", "dogleash,pet"),
        ("Arena para Gatos 10kg", "Aglomerante y control de olores.", 45000, 60, 9, "Mascotas", "catlitter,pet"),
        ("Champú Mascotas", "Hipoalergénico con aloe vera.", 38000, 50, 9, "Mascotas", "dogshampoo,pet"),
        ("Cepillo Quitapelos", "Elimina pelo suelto fácilmente.", 42000, 45, 9, "Mascotas", "petbrush,grooming"),
        ("Snacks para Perro", "Sabor carne, premio ideal.", 25000, 100, 9, "Mascotas", "dogtreats,pet"),

        # --- HOGAR (HomeStyle - 10) ---
        ("Sillón Reclinable", "Máximo confort para tu sala.", 950000, 5, 10, "Hogar y Muebles", "recliner,chair"),
        ("Mesa Centro Madera", "Estilo rústico moderno.", 450000, 10, 10, "Hogar y Muebles", "coffeetable,furniture"),
        ("Lámpara de Pie", "Iluminación ambiental cálida.", 280000, 15, 10, "Hogar y Muebles", "floorlamp,lighting"),
        ("Juego Sábanas King", "Algodón 300 hilos.", 160000, 20, 10, "Hogar y Muebles", "bedsheets,bed"),
        ("Cortinas Opacas", "Bloquean la luz exterior.", 120000, 30, 10, "Hogar y Muebles", "curtains,window"),
        ("Cojines Decorativos", "Set de 2, varios colores.", 75000, 40, 10, "Hogar y Muebles", "cushions,sofa"),
        ("Espejo de Pared", "Marco dorado elegante.", 220000, 12, 10, "Hogar y Muebles", "wallmirror,decor"),
        ("Alfombra Sala", "Suave al tacto, 2x3 metros.", 320000, 8, 10, "Hogar y Muebles", "rug,carpet"),
        ("Escritorio Moderno", "Ideal para home office.", 380000, 10, 10, "Hogar y Muebles", "desk,furniture"),
        ("Silla de Comedor", "Diseño ergonómico.", 190000, 24, 10, "Hogar y Muebles", "diningchair,furniture"),

        # --- SUPERMERCADO (SuperMax - 11) ---
        ("Pack Bebidas Gaseosas", "6 latas refrescantes.", 18000, 100, 11, "Supermercado", "soda,beverage"),
        ("Arroz Premium 5kg", "Grano entero seleccionado.", 28000, 200, 11, "Supermercado", "rice,food"),
        ("Aceite Oliva Virgen", "Prensado en frío.", 42000, 80, 11, "Supermercado", "oliveoil,food"),
        ("Café en Grano 1kg", "Tueste medio intenso.", 38000, 60, 11, "Supermercado", "coffeebeans,coffee"),
        ("Galletas Surtidas", "Caja familiar.", 22000, 90, 11, "Supermercado", "cookies,food"),
        ("Leche Descremada", "Pack de 12 litros.", 48000, 50, 11, "Supermercado", "milk,dairy"),
        ("Cereal Integral", "Desayuno nutritivo.", 18000, 100, 11, "Supermercado", "cereal,breakfast"),
        ("Detergente Líquido", "Lavado profundo 3L.", 35000, 70, 11, "Supermercado", "detergent,laundry"),
        ("Papel Higiénico", "Paquete de 24 rollos.", 45000, 80, 11, "Supermercado", "toiletpaper,groceries"),
        ("Pasta De Dientes", "Pack de 3 unidades.", 22000, 150, 11, "Supermercado", "toothpaste,hygiene")
    ]

    print("\n--- Creando/Actualizando Productos ---")
    for nombre, desc, precio, stock, idx_emprendimiento, nombre_cat, keywords in datos_productos:
        # Obtener ID de emprendimiento usando el nombre de la marca
        marca_emprendimiento = datos_vendedores[idx_emprendimiento][2]
        venture = db.query(Emprendimiento).filter(Emprendimiento.nombre_marca == marca_emprendimiento).first()
        
        # Obtener ID de categoría
        cat = categorias_map.get(nombre_cat)
        if not cat:
            cat_nombre_vendedor = datos_vendedores[idx_emprendimiento][3]
            cat = categorias_map.get(cat_nombre_vendedor, categorias_map.get("Otros"))
        
        # Generar URL de imagen específica con palabras clave
        image_url = f"https://loremflickr.com/400/400/{keywords.replace(' ','')}?lock={hash(nombre) % 1000}"

        # Buscar si ya existe
        prod = db.query(Producto).filter(Producto.nombre == nombre).first()
        if not prod:
            # CREATE
            prod = Producto(
                emprendimiento_id=venture.id,
                categoria_id=cat.id if cat else None,
                nombre=nombre,
                descripcion=desc,
                precio=precio,
                cantidad_stock=stock,
                url_imagen=image_url
            )
            db.add(prod)
            print(f"  + Producto añadido: {nombre}")
        else:
            # UPDATE
            # Force update image and category to fix potential mismatches
            prod.categoria_id = cat.id if cat else None
            prod.url_imagen = image_url
            prod.descripcion = desc
            prod.precio = precio
            print(f"  * Producto actualizado: {nombre}")
            
    db.commit()
    print("\n¡Datos de prueba insertados exitosamente!")
    db.close()

if __name__ == "__main__":
    seed_data()
