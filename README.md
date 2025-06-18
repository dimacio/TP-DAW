Proyecto Fullstack: Smart Home

Este es un proyecto fullstack para controlar dispositivos de un hogar inteligente. La arquitectura está montada sobre Docker y se divide en dos grandes partes:

    Backend (¡Terminado! 🎉): Una API REST hecha con Node.js y Express, que se conecta a una base de datos MySQL para gestionar los dispositivos.

    Frontend (Próximo paso 🗓️): Una interfaz web para interactuar con la API y controlar los dispositivos desde el navegador.

🚀 Puesta en Marcha del Backend

Para levantar el backend y la base de datos, solo tenés que correr este comando en la raíz del proyecto:

sudo docker compose up --build

Una vez que arranque, la API va a estar escuchando en http://localhost:8000.
⚙️ Uso de la API (Backend)

Ya podés probar la API con curl desde tu terminal para asegurarte de que todo funciona como se espera.
Listar todos los dispositivos

    Método: GET

    Endpoint: /devices

    Comando:

    curl http://localhost:8000/devices

Crear un dispositivo

    Método: POST

    Endpoint: /devices

    Comando:

    curl -X POST -H "Content-Type: application/json" -d '{
      "nombre_id": "luz-cocina",
      "ubicacion": "Cocina",
      "estado": 0,
      "nivel": 100
    }' http://localhost:8000/devices

Actualizar un dispositivo

    Método: PUT

    Endpoint: /devices/:id

    Comando (para el ID 2):

    curl -X PUT -H "Content-Type: application/json" -d '{
      "nombre_id": "ventilador-potente",
      "ubicacion": "Dormitorio",
      "estado": 1,
      "nivel": 90
    }' http://localhost:8000/devices/2

Eliminar un dispositivo

    Método: DELETE

    Endpoint: /devices/:id

    Comando (para el ID 3):

    curl -X DELETE http://localhost:8000/devices/3

🎨 Plan y Requisitos para el Frontend

Ahora que el backend está firme, el próximo objetivo es construir la interfaz de usuario.
Tecnologías a Utilizar

    Lenguaje: TypeScript, para tener un código más robusto, tipado y fácil de mantener.

    Estilos: Materialize CSS, para lograr una interfaz moderna, limpia y responsive, consistente con el diseño del proyecto de referencia.

Requisitos Funcionales del Frontend

La interfaz web debe cumplir con los siguientes requisitos:

    Listado Dinámico de Dispositivos:

        Al cargar la página (o al presionar un botón de "Actualizar"), se debe hacer una petición GET a /devices.

        La respuesta JSON se debe usar para dibujar dinámicamente cada dispositivo en la pantalla, mostrando su nombre, ubicación y estado.

        Se deben usar íconos de Materialize para representar visualmente cada tipo de dispositivo (ej: lightbulb para lámparas, air para ventiladores).

    Control de Estado (On/Off):

        Cada dispositivo en la lista debe tener un interruptor (switch) de Materialize que refleje su estado actual (on/off).

        Al hacer clic en el interruptor, se debe enviar una petición PUT al endpoint /devices/:id correspondiente, actualizando el campo estado.

        La interfaz debe reflejar el cambio visualmente de forma inmediata (por ejemplo, cambiando el color del ícono).

    Control de Nivel (0-100%):

        (Opcional, como mejora) Se podría añadir un slider de Materialize para controlar el nivel de los dispositivos que lo soporten (lámparas dimeables, velocidad del ventilador, etc.).

        Al mover el slider, se enviaría una petición PUT para actualizar el campo nivel del dispositivo.

    Feedback al Usuario:

        Mostrar un indicador de carga (preloader de Materialize) mientras se obtienen los datos de la API.

        Mostrar notificaciones (tipo "Toast" de Materialize) para confirmar acciones como "Dispositivo actualizado" o para informar errores si una petición a la API falla.