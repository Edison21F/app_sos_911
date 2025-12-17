# SOS 911 App

Aplicación móvil de asistencia de emergencia y seguridad comunitaria desarrollada en React Native con Expo. Su objetivo principal es brindar una herramienta rápida y eficaz para notificar situaciones de peligro a contactos de confianza y servicios de emergencia.

## 🌟 Funcionalidades Principales

*   **Botón de Pánico (SOS):** Envío inmediato de alertas con ubicación en tiempo real a tus contactos de emergencia.
*   **Red de Seguridad:** Creación de grupos (Familia, Vecinos, Trabajo) para compartir alertas y comunicarse vía chat.
*   **Contactos de Emergencia:** Gestión de una lista prioritaria de personas a notificar en caso de incidente.
*   **Mapa de Incidentes:** Visualización de alertas activas y reportes de seguridad en tu zona (Nearby Alerts).
*   **Perfil Médico y Personal:** Almacenamiento de información vital para socorristas.

## ✅ Estado Actual de Implementación

Actualmente, la aplicación cuenta con los siguientes módulos desarrollados:

*   **Autenticación:**
    *   Inicio de sesión y Registro de usuarios.
    *   Pantalla de Bienvenida con botón SOS de acceso rápido.
*   **Gestión de Perfil:**
    *   Visualización y edición de datos personales.
    *   Gestión de múltiples números de teléfono.
    *   Actualización de foto de perfil con acceso a cámara/galería.
*   **Sistema de Alertas:**
    *   Interfaz de activación de emergencia (SOS / 911).
    *   Historial de notificaciones recibidas.
    *   Calificación y respuesta a alertas (Falsa alarma, Atendida, etc.).
*   **Navegación:**
    *   Estructura completa de navegación (Stack Navigator).
    *   Menú lateral (Sidebar) personalizado.
*   **UI/UX:**
    *   Diseño moderno con temas oscuros y degradados.
    *   Componentes visuales responsivos y animados.

## 🚀 Cómo Iniciar

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Instalar dependencias:**
    Asegúrate de tener Node.js instalado y ejecuta:
    ```bash
    npm install --force
    ```

2.  **Iniciar el servidor de desarrollo:**
    ```bash
    npx expo start
    o
    npm run start
    ```

3.  **Ejecutar en un dispositivo:**
    -   **Android/iOS:** Escanea el código QR monstrado en la terminal con la app "Expo Go".
    -   **Emulador:** Presiona `a` para Android o `i` para iOS en la terminal.

## 📂 Estructura del Proyecto

El proyecto sigue una **Arquitectura en Capas (Layered Architecture)** para garantizar la separación de responsabilidades, escalabilidad y facilidad de mantenimiento.

### Mapeo de Carpetas (`src/`)

```
src/
├── api/            # Capa de Red
│   └── api.ts      # Configuración de Axios, interceptores y manejo de tokens.
│
├── components/     # Componentes de Presentación (Reutilizables)
│   ├── Header/     # Encabezados de pantalla.
│   ├── Sidebar/    # Menú lateral de navegación.
│   └── ...         # Otros componentes de UI puros.
│
├── navigation/     # Configuración de Rutas
│   └── Navigator.ts # Definición de Stack/Tab navigators y tipos de rutas.
│
├── screens/        # Capa de Presentación (Vistas)
│   ├── Auth/       # Pantallas de autenticación (Login, Register).
│   ├── Emergency/  # Pantallas de alerta y SOS.
│   ├── Profile/    # Gestión de perfil de usuario.
│   └── ...         # Vistas principales de la aplicación.
│
├── services/       # Capa de Lógica de Negocio
│   ├── auth.service.ts         # (Propuesto) Lógica de sesión y autenticación.
│   ├── clientesService.ts      # Lógica relacionada con datos de clientes.
│   ├── location.service.ts     # Manejo de geolocalización.
│   └── socket.service.ts       # Comunicación en tiempo real.
│
├── theme/          # Estilos Globales
│   └── theme.ts    # Definición de colores, tipografía y constantes de diseño.
│
└── utils/          # Utilidades
    └── dimensions.ts # Helpers para diseño responsivo.
```

## 🏗 Justificación de la Arquitectura

Se ha elegido una **Arquitectura en Capas** por las siguientes razones:

1.  **Separación de Responsabilidades (SoC):**
    *   **Presentation Layer (`screens/`, `components/`)**: Se encarga únicamente de renderizar la UI y manejar la interacción del usuario. No debe contener lógica de negocio compleja ni llamadas directas a la base de datos o API cruda.
    *   **Service Layer (`services/`)**: Centraliza la lógica de negocio y las llamadas a la API. Actúa como intermediario, transformando datos del backend para que la UI los consuma fácilmente.
    *   **Data/Network Layer (`api/`)**: Maneja la configuración técnica de la comunicación HTTP (timeouts, headers, parseo de errores).

2.  **Escalabilidad:**
    Al tener servicios desacoplados, agregar nuevas funcionalidades (como un nuevo módulo de pagos o historial) no afecta a las pantallas existentes. Simplemente se inyecta el nuevo servicio.

3.  **Mantenibilidad:**
    Si cambia la URL de la API o la estructura de los endpoints, solo es necesario actualizar los archivos en `services/` o `api/`, sin tener que buscar y reemplazar en docenas de pantallas.

4.  **Reusabilidad:**
    Los componentes en `components/` son "tontos" (presentacionales), lo que permite usarlos en múltiples pantallas con diferentes datos.

## ℹ️ Información General

*   **Nombre:** app_sos_911
*   **Versión:** 2.1.0
*   **Framework:** Expo SDK 54
*   **Navegación:** React Navigation 7
*   **Cliente HTTP:** Axios
