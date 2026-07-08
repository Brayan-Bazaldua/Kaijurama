# Kaijurama - Memorama Interactivo Responsivo

Este proyecto es una aplicación web interactiva basada en el clásico juego de memoria (memorama), ambientada con una temática visual de Kaijus. Desarrollada con tecnologías web estándar bajo la arquitectura de una sola página (Single Page Application), la aplicación está optimizada para ofrecer una experiencia fluida, responsiva y de alto rendimiento tanto en dispositivos móviles y tablets como en equipos de escritorio.

## Características Principales

* **Lógica de Juego Dinámica:** Sistema de emparejamiento automatizado con barajado aleatorio en cada sesión y cálculo en tiempo real de movimientos e intentos.
* **Diseño Fluido y Elástico:** Interfaz construida con CSS avanzado utilizando funciones `clamp()` y Media Queries específicas que aseguran una perfecta adaptabilidad dimensional sin pérdida de proporciones en pantallas táctiles o monitores de gran tamaño.
* **Animaciones y Física 3D:** Renderizado tridimensional en las cartas mediante propiedades de perspectiva CSS (`transform-style: preserve-3d` y `backface-visibility`), complementado con efectos visuales dinámicos de rotación, vibración ante errores y destellos de éxito.
* **Control Centralizado de Audio:** Sistema central de gestión para música de fondo (BGM) en bucle y efectos de sonido (SFX) para interacciones, incluyendo una función de silencio global (Mute) integrada y normalización de decibelios para protección auditiva.
* **Múltiples Modos de Dificultad:** Configuración de estados y límites de tiempo específicos adaptables según la experiencia del usuario (Modo Baby, Modo Jr, Modo King).

## Tecnologías Utilizadas

* **HTML5:** Estructuración semántica y manejo de contenedores multimedia.
* **CSS3:** Estilos avanzados, diseño responsivo, animaciones clave (`@keyframes`) y transformaciones tridimensionales.
* **JavaScript (Vanilla):** Manipulación dinámica del DOM, gestión de eventos del usuario, control de temporizadores e implementación del algoritmo de barajado.

## Estructura del Proyecto

```text
├── index.html          # Punto de entrada de la aplicación
├── style.css           # Estilos generales, adaptabilidad y animaciones
├── script.js           # Motor lógico del juego y gestión de estado
├── Audio/              # Recursos de audio (música y efectos de sonido)
└── Img/                # Recursos gráficos (fondos, cartas e interfaces)