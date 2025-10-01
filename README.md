# 🚀 Gestión de Paquetes y Visitas (Full-Stack Dockerizado)

Este proyecto está configurado para ejecutarse completamente dentro de contenedores Docker, garantizando que el entorno de desarrollo (Node.js API, React Frontend y Base de Datos MariaDB) sea idéntico en cualquier máquina.

🛠️ Requisitos Previos
Necesitas tener Docker Desktop instalado y en ejecución en tu sistema operativo (Windows, macOS o Linux).

🔑 1. Configuración de Variables de Entorno
IMPORTANTE: Por razones de seguridad, las contraseñas y claves secretas no están incluidas directamente.

Copia el archivo de ejemplo /.env.example que se encuentra en la raíz del proyecto.

Renombra la copia a .env.

Abre el archivo .env y rellena los valores (especialmente las contraseñas DB_ROOT_PASSWORD y DB_PASSWORD) con valores seguros de tu elección.

Nota Clave sobre la Conexión:

DB_MARIA_HOST debe ser db para que la API se conecte dentro de la red Docker.

CLIENT_ORIGIN y VITE_API_URL deben apuntar a localhost:8080 (el puerto externo del Frontend y la API).

⚙️ 2. Construcción y Ejecución de Servicios
Ejecuta el siguiente comando en la terminal desde la carpeta raíz de este proyecto. Este comando se encarga de tres tareas:

Construir las imágenes del Backend (server) y Frontend (client).

Inicializar la base de datos (db) usando las variables de .env y ejecutar el script ./init/init.sql para crear las tablas.

Lanzar los tres servicios en segundo plano (-d).

docker compose up --build -d

✅ 3. Acceso a la Aplicación
Una vez que los tres servicios estén en estado Up (tarda unos segundos la primera vez), puedes acceder a la aplicación:

Servicio

URL

Puerto (Local)

Frontend (React)

<http://localhost:8080>

8080

Backend (API)

<http://localhost:3000>

3000

Base de Datos (MariaDB)

Host: localhost, Puerto: 3307

3307

🛑 Para Detener y Eliminar los Contenedores
Para liberar los puertos y eliminar los contenedores (manteniendo el volumen de la base de datos, es decir, los datos):

docker compose down

Para detener y eliminar todo, incluyendo los datos permanentes de la base de datos (volúmenes):

docker compose down -v
