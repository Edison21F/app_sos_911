# SOS 911 App

Aplicación móvil de asistencia de emergencia y seguridad comunitaria desarrollada en React Native con Expo. Su objetivo principal es brindar una herramienta rápida y eficaz para notificar situaciones de peligro a contactos de confianza y servicios de emergencia.

## 🌟 Funcionalidades Principales

*   **Botón de Pánico (SOS):** Envío inmediato de alertas con ubicación en tiempo real a tus contactos de emergencia.
*   **Red de Seguridad:** Creación de grupos (Familia, Vecinos, Trabajo) para compartir alertas y comunicarse vía chat.
*   **Contactos de Emergencia:** Gestión de una lista prioritaria de personas a notificar en caso de incidente.
*   **Mapa de Incidentes:** Visualización de alertas activas y reportes de seguridad en tu zona (Nearby Alerts).
*   **Perfil Médico y Personal:** Almacenamiento de información vital para socorristas.
*   **Modo Offline:** Cola de alertas que se sincronizan automáticamente cuando recuperas la conexión.

## ✅ Estado Actual de Implementación

Actualmente, la aplicación cuenta con los siguientes módulos desarrollados bajo **Clean Architecture**:

*   **Autenticación:**
    *   Inicio de sesión y Registro de usuarios.
*   **Gestión de Perfil:**
    *   Visualización y edición de datos personales y médicos.
    *   Gestión de múltiples números de teléfono.
*   **Sistema de Alertas:**
    *   Interfaz de activación de emergencia (SOS).
    *   Historial de alertas.
    *   Gestión de estados (Activa, Resuelta, Falsa Alarma).
*   **Grupos y Contactos:**
    *   Gestión de grupos de seguridad.
    *   Chat de grupo en tiempo real (Socket.io).
*   **Ubicación:**
    *   Rastreo en tiempo real durante emergencias.

## 🚀 Cómo Iniciar

1.  **Instalar dependencias:**
    ```bash
    npm install --force
    ```

2.  **Iniciar el servidor de desarrollo:**
    ```bash
    npx expo start
    ```

## 🏗 Arquitectura del Proyecto

El proyecto ha sido refactorizado para seguir los principios de **Clean Architecture (Arquitectura Limpia)**. Esto asegura que la lógica de negocio sea independiente de frameworks, bases de datos y UI.

### Estructura de Carpetas (`src/`)

```
src/
├── domain/                 # 1. Capa de Dominio (Reglas de Negocio Puras)
│   ├── entities/           # Objetos centrales del negocio (User, Alert, Contact).
│   └── value-objects/      # Objetos inmutables (Email, Coordinates).
│
├── application/            # 2. Capa de Aplicación (Casos de Uso)
│   ├── ports/              # Interfaces (Puertos) que definen contratos.
│   │   ├── repositories/   # Interfaces para acceso a datos (IAuthRepository).
│   │   └── services/       # Interfaces para servicios externos (ILocationService).
│   └── use-cases/          # Lógica de aplicación específica (LoginUseCase, SendAlertUseCase).
│       ├── auth/
│       ├── alerts/
│       └── ...
│
├── infrastructure/         # 3. Capa de Infraestructura (Implementaciones)
│   ├── di/                 # Inyección de Dependencias (Container).
│   ├── http/               # Cliente HTTP (Axios) y configuraciones de red.
│   ├── repositories/       # Implementación de repositorios (AuthRepositoryApi).
│   └── services/           # Implementación de servicios (SocketService, LocationService).
│
├── presentation/           # 4. Capa de Presentación (UI)
│   ├── components/         # Componentes visuales reutilizables.
│   ├── hooks/              # ViewModels (Custom Hooks) que conectan UI con Casos de Uso.
│   ├── screens/            # Pantallas de la aplicación.
│   ├── navigation/         # Configuración de rutas.
│   └── styles/             # Tema y estilos globales.
│
├── config/                 # Configuración ambiental (Constantes, ENV).
└── shared/                 # Utilidades compartidas (Formatters, Validators).
```

### 🧠 Justificación de la Arquitectura

1.  **Independencia de Frameworks:**
    La lógica de negocio (`domain` y `application`) no sabe que existe React Native o Expo. Esto facilita las pruebas unitarias y la migración futura.

2.  **Separación de Responsabilidades:**
    *   **Presentation Layer:** Solo pinta la UI. Delega toda la lógica a los `ViewModels` (`hooks/`).
    *   **ViewModels:** No llaman a APIs. Llaman a **Casos de Uso**.
    *   **Application Layer:** Contiene los Casos de Uso (`execute()`). Orquesta el flujo de datos usando las interfaces de repositorios.
    *   **Infrastructure Layer:** Implementa las interfaces. Aquí es donde vive Axios, Socket.io y AsyncStorage.

3.  **Inyección de Dependencias (DI):**
    Utilizamos un contenedor (`infrastructure/di/container.ts`) para instanciar las dependencias. Las pantallas y ViewModels importan este contenedor, lo que permite cambiar implementaciones fácilmente (por ejemplo, cambiar una API REST por Firebase sin tocar la UI).

4.  **Testeabilidad:**
    Al desacoplar la lógica de la UI y de la infraestructura, es trivial escribir tests para los Casos de Uso simulando (mocking) los repositorios.

### Flujo de Datos Típico

1.  **UI (`Dashboard.tsx`)** llama a una función del **ViewModel** (`useDashboardViewModel`).
2.  **ViewModel** llama a un **Caso de Uso** (`GetCurrentUserUseCase`).
3.  **Caso de Uso** pide datos a una **Interfaz de Repositorio** (`IAuthRepository`).
4.  **Infraestructura** (`AuthRepositoryApi`) realiza la petición HTTP real y devuelve datos al Caso de Uso.
5.  **Caso de Uso** devuelve Entidades de Dominio al ViewModel.
6.  **ViewModel** actualiza el estado local (React State) y la UI se renderiza.

---
**Proyecto Generado y Mantenido con Asistencia de IA Avanzada (Deepmind).**
