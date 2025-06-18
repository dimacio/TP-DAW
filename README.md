Markdown

# Proyecto Full-Stack: Smart Home Dashboard

Este es un proyecto full-stack para controlar dispositivos de un hogar inteligente. La arquitectura está completamente dockerizada, separando las responsabilidades del backend y el frontend para un desarrollo y despliegue más limpios.

![Captura de Pantalla del Dashboard](/image.png)

## 🌟 Características

* **Backend:** Una API REST robusta construida con Node.js y Express, conectada a una base de datos MySQL para la gestión persistente de los dispositivos.
* **Frontend:** Una Single Page Application (SPA) moderna e interactiva, construida con TypeScript y MaterializeCSS, que permite el control en tiempo real de los dispositivos.
* **Contenerización:** Todo el entorno (backend, frontend y base de datos) está orquestado con Docker y Docker Compose para una configuración y puesta en marcha sencillas con un solo comando.
* **Desarrollo Moderno:** El frontend utiliza un `Dockerfile` multi-etapa para crear una imagen de producción ligera y optimizada, compilando el código TypeScript de forma automática.

## 🛠️ Stack Tecnológico

| Área          | Tecnología                                      |
|---------------|-------------------------------------------------|
| **Backend** | Node.js, Express.js, MySQL                      |
| **Frontend** | HTML5, CSS3, TypeScript, MaterializeCSS, Nginx  |
| **Entorno** | Docker, Docker Compose                          |

## 🚀 Puesta en Marcha del Proyecto

Para levantar todo el stack (backend, frontend y base de datos), solo necesitas tener Docker y Docker Compose instalados en tu sistema.

1.  Clona o descarga este repositorio en tu máquina local.
2.  Abre una terminal en la carpeta raíz del proyecto.
3.  Ejecuta el siguiente comando:

```bash
docker-compose up --build
Una vez que todos los contenedores se hayan iniciado, podrás acceder a:

Frontend (Dashboard): http://localhost:8080
API (Backend): http://localhost:8000
📁 Estructura del Proyecto
.
├── db/
│   └── dumps/
│       └── smart_home.sql      # Script de inicialización de la DB
├── src/
│   ├── backend/
│   │   ├── models/             # Lógica de datos de la API
│   │   ├── routes/             # Definición de endpoints de la API
│   │   ├── index.js            # Punto de entrada de la API
│   │   ├── package.json        # Dependencias del backend
│   │   └── Dockerfile          # Instrucciones para construir el backend
│   └── frontend/
│       ├── dist/               # (Generado automáticamente) JS compilado
│       ├── index.html          # Estructura de la SPA
│       ├── style.css           # Estilos personalizados
│       ├── main.ts             # Lógica del frontend en TypeScript
│       ├── package.json        # Dependencias y scripts de compilación
│       ├── tsconfig.json       # Configuración del compilador de TS
│       ├── nginx.conf          # Configuración de Nginx (Reverse Proxy)
│       └── Dockerfile          # Instrucciones para construir el frontend
├── .dockerignore
├── docker-compose.yml          # Orquestación de todos los servicios
└── README.md                   # Este archivo
⚙️ API Endpoints (Backend)
La API REST está disponible en http://localhost:8000.

Listar todos los dispositivos
Método: GET
Endpoint: /devices/
Respuesta Exitosa (200):
JSON

[
  { "id": 1, "nombre_id": "lampara-living-1", "ubicacion": "Living Room", "tipo": "lampara", "estado": 1, "nivel": 80 }
]
Listar tipos de dispositivos únicos
Método: GET
Endpoint: /devices/types/
Respuesta Exitosa (200):
JSON

["calefactor", "lampara", "ventilador"]
Crear un dispositivo
Método: POST
Endpoint: /devices/
Body (JSON):
JSON

{
  "nombre_id": "luz-cocina",
  "ubicacion": "Cocina",
  "tipo": "lampara",
  "estado": 0,
  "nivel": 100
}
Respuesta Exitosa (201): El objeto del dispositivo recién creado con su id.
Actualizar un dispositivo
Método: PUT
Endpoint: /devices/:id (ej: /devices/2)
Body (JSON): El objeto completo del dispositivo con los campos a modificar.
Eliminar un dispositivo
Método: DELETE
Endpoint: /devices/:id (ej: /devices/3)
Respuesta Exitosa (200): Mensaje de confirmación.
🎨 Funcionalidades del Frontend
La interfaz de usuario, accesible en http://localhost:8080, permite realizar todas las operaciones CRUD de forma visual e intuitiva:

Listado Dinámico: Al cargar, muestra todos los dispositivos existentes con su ícono, nombre, ubicación y controles.
Control de Estado: Un interruptor (On/Off) permite cambiar el estado de cada dispositivo en tiempo real.
Control de Nivel: Un slider permite ajustar el nivel de intensidad (0-100%).
Creación y Edición: Un formulario modal permite crear nuevos dispositivos o editar los existentes (nombre, ubicación y tipo).
Eliminación Segura: Un modal de confirmación previene el borrado accidental de dispositivos.
Interfaz Responsiva: El diseño se adapta a diferentes tamaños de pantalla, desde dispositivos móviles hasta monitores de escritorio.
<!-- end list -->
