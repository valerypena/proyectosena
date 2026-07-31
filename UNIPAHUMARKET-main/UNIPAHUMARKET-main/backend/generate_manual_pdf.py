# -*- coding: utf-8 -*-
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, "Manual de Usuario del Software - UNIMARKET", align="L")
            self.ln(10)
            self.set_draw_color(200, 200, 200)
            self.line(10, 18, 200, 18)
            
    def footer(self):
        if self.page_no() > 1:
            self.set_y(-15)
            self.set_font("helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, f"Página {self.page_no()}", align="R")

def create_pdf():
    pdf = PDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # ----------------------------------------------------
    # PAGE 1: PORTADA
    # ----------------------------------------------------
    pdf.add_page()
    pdf.set_font("helvetica", "B", 16)
    pdf.ln(20)
    pdf.multi_cell(0, 10, "MANUAL DE USUARIO DEL SOFTWARE\nDE COMERCIO ELECTRÓNICO\n(UNIMARKET)", align="C")
    
    pdf.ln(35)
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 7, "PRESENTADO POR:", align="C")
    pdf.ln(7)
    pdf.set_font("helvetica", "", 12)
    pdf.cell(0, 7, "VALERY GISEL PEÑA PINTO", align="C")
    
    pdf.ln(20)
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 7, "INSTRUCTOR(A):", align="C")
    pdf.ln(7)
    pdf.set_font("helvetica", "", 12)
    pdf.cell(0, 7, "EQUIPO EVALUADOR DE ANÁLISIS Y DESARROLLO DE SOFTWARE", align="C")
    
    pdf.ln(30)
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(0, 6, "SERVICIO NACIONAL DE APRENDIZAJE (SENA)", align="C")
    pdf.ln(6)
    pdf.cell(0, 6, "CENTRO NACIONAL DE HOTELERIA, TURISMO Y ALIMENTOS", align="C")
    pdf.ln(6)
    pdf.cell(0, 6, "ANÁLISIS Y DESARROLLO DE SOFTWARE (#2977475)", align="C")
    pdf.ln(6)
    pdf.cell(0, 6, "BOGOTA DC", align="C")
    pdf.ln(6)
    pdf.cell(0, 6, "2026", align="C")
    
    # ----------------------------------------------------
    # PAGE 2: INTRODUCCIÓN
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "1. Introducción", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "", 11)
    intro_text = (
        "El presente Manual de Usuario ha sido elaborado con el propósito de guiar a los usuarios "
        "de la plataforma UNIMARKET (tanto compradores como vendedores) en el uso correcto y eficiente "
        "de todas las funcionalidades del software.\n\n"
        "UNIMARKET es una robusta plataforma de comercio electrónico (Marketplace) inspirada en líderes "
        "de la industria como Mercado Libre, diseñada para conectar emprendimientos locales con compradores "
        "de la comunidad. Este manual detalla los pasos operativos para registrarse, buscar productos por "
        "categorías, gestionar el carrito de compras, simular pagos de forma segura y publicar inventarios "
        "en el módulo de vendedores."
    )
    pdf.multi_cell(0, 6, intro_text)
    
    # ----------------------------------------------------
    # PAGE 3: ACCESO A LA PLATAFORMA
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "2. Acceso a la Plataforma", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "", 11)
    access_text = (
        "Para acceder a la aplicación UNIMARKET, asegúrese de contar con un navegador de internet "
        "actualizado (como Google Chrome, Microsoft Edge o Mozilla Firefox) y una conexión a red.\n\n"
        "- Dirección URL de Acceso Local: Abra su navegador e ingrese a http://localhost:5173/\n"
        "- Dispositivos Soportados: La interfaz gráfica es responsiva, permitiendo una navegación "
        "cómoda tanto en computadoras de escritorio como en teléfonos móviles y tablets."
    )
    pdf.multi_cell(0, 6, access_text)

    # ----------------------------------------------------
    # PAGE 4: REGISTRO Y AUTENTICACIÓN
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "3. Registro y Autenticación de Usuarios", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.1. Creación de una Cuenta Nueva", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_1 = (
        "1. En el menú superior derecho, haga clic en 'Crea tu cuenta'.\n"
        "2. Ingrese Nombre Completo, Correo, Contraseña, Documento y Ocupación.\n"
        "3. Seleccione el Rol deseado y pulse en 'Registrarse'."
    )
    pdf.multi_cell(0, 6, p3_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "3.2. Inicio de Sesión y Perfil", ln=True)
    pdf.set_font("helvetica", "", 11)
    p3_2 = (
        "Haga clic en 'Ingresa', introduzca su correo y contraseña. Una vez iniciada la sesión, "
        "tendrá acceso a sus direcciones de entrega guardadas y configuración de tarjetas bancarias."
    )
    pdf.multi_cell(0, 6, p3_2)

    # ----------------------------------------------------
    # PAGE 5: BÚSQUEDA Y EXPLORACIÓN
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "4. Búsqueda y Exploración de Productos", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.1. Uso del Buscador Inteligente", ln=True)
    pdf.set_font("helvetica", "", 11)
    p4_1 = (
        "Escriba palabras clave del artículo en la barra de búsqueda superior. El sistema proporcionará "
        "sugerencias rápidas basadas en el stock disponible."
    )
    pdf.multi_cell(0, 6, p4_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "4.2. Filtro por Categorías", ln=True)
    pdf.set_font("helvetica", "", 11)
    p4_2 = (
        "Explore el catálogo de productos haciendo clic en 'Categorías' en el menú, visualizando "
        "fácilmente secciones como Tecnología, Moda, Herramientas o Supermercado."
    )
    pdf.multi_cell(0, 6, p4_2)

    # ----------------------------------------------------
    # PAGE 6: CARRITO Y CHECKOUT
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "5. Carrito de Compras y Proceso de Pago", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(3)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "5.1. Gestión del Carrito", ln=True)
    pdf.set_font("helvetica", "", 11)
    p5_1 = (
        "Haga clic en 'Agregar al carrito' en la ficha de un producto. Puede verificar cantidades, "
        "eliminar artículos y ver el total en cualquier momento."
    )
    pdf.multi_cell(0, 6, p5_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 8, "5.2. Checkout y Simulación de Pago", ln=True)
    pdf.set_font("helvetica", "", 11)
    p5_2 = (
        "Al presionar 'Proceder al pago', indique la dirección de entrega e introduzca una tarjeta de "
        "crédito de prueba para generar la orden y la factura digital."
    )
    pdf.multi_cell(0, 6, p5_2)

    # ----------------------------------------------------
    # PAGE 7: MÓDULO DE VENDEDORES Y SOPORTE
    # ----------------------------------------------------
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 82, 118)
    pdf.cell(0, 10, "6. Vendedores, Soporte y Conclusiones", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(5)
    
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "6.1. Módulo del Vendedor", ln=True)
    pdf.set_font("helvetica", "", 10)
    p6_1 = (
        "Registre su emprendimiento en la sección 'Vender'. Publique productos definiendo precio, "
        "stock e imágenes, controle ventas y responda dudas de sus clientes."
    )
    pdf.multi_cell(0, 6, p6_1)
    pdf.ln(4)
    
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "6.2. Sección de Ayuda", ln=True)
    pdf.set_font("helvetica", "", 10)
    p6_2 = (
        "Consulte políticas de devolución, dudas sobre formas de pago y configuraciones de privacidad "
        "en la sección de 'Ayuda' integrada en el sistema."
    )
    pdf.multi_cell(0, 6, p6_2)
    
    pdf.ln(20)
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 6, "Elaborado y Validado por:", ln=True)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 6, "Valery Gisel Peña Pinto", ln=True)
    pdf.cell(0, 6, "Aprendiz del programa Análisis y Desarrollo de Software - SENA", ln=True)
    pdf.cell(0, 6, "Fecha: 30 de Julio de 2026", ln=True)
    
    pdf.output("Manual_Usuario_Software.pdf")
    print("PDF creado con éxito: Manual_Usuario_Software.pdf")

if __name__ == "__main__":
    create_pdf()
