# Multiverse Dossier (React)

Versión en React 19 de Multiverse Dossier: buscador de personajes de Rick and Morty que consume [The Rick and Morty API](https://rickandmortyapi.com). Proyecto de Web Development I hecho con Vite. Añade un **expediente personal de favoritos** que se guarda en el navegador.

## Cómo probarlo
Necesitas Node.js instalado. En la carpeta del proyecto ejecuta:

```bash
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente `http://localhost:5173`). Busca un personaje, filtra por estado, cambia de página y pulsa ☆ para guardarlo; en la pestaña "★ Favoritos" verás tu expediente, que sigue ahí al recargar la página (se guarda en `localStorage`, clave `rm-favorites`). Con `npm run build` se genera la versión de producción en `dist/`.

## Tecnologías
React 19 · Vite · JavaScript (módulos ES) · CSS3 · localStorage

## Estructura
```
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                  # Monta <App /> en el DOM
    ├── App.jsx                   # Estado principal y composición de la UI
    ├── style.css
    ├── components/
    │   ├── SearchBar.jsx         # Buscador y filtro de estado
    │   ├── Tabs.jsx              # Pestañas Todos / Favoritos
    │   ├── Stats.jsx             # Estadísticas derivadas
    │   ├── CharacterList.jsx     # Lista con keys estables
    │   ├── CharacterCard.jsx     # Tarjeta de un personaje
    │   ├── Pagination.jsx        # Paginación
    │   └── StatusMessage.jsx     # Carga, error y vacío
    ├── hooks/
    │   ├── useFetch.js           # Petición con cancelación y reintento
    │   ├── useDebounce.js        # Retrasa el valor del buscador
    │   └── useLocalStorage.js    # useState persistente
    └── utils/
        └── characters.js         # URL y transformaciones (map/filter/reduce)
```

## Uso de IA
Usé Claude (Anthropic) como asistente de desarrollo. Generó la estructura del proyecto y el código base partiendo de mi app anterior, en un balance aproximado de 90% código generado/guiado y 10% trabajo propio (puesta en marcha, pruebas, depuración y entrega).

**Prompt real utilizado:**
1. "Reconstruye mi app de la misión anterior en React 19 con componentes, props, estado y efectos, manteniendo la misma API (Rick and Morty). Debe usar useState derivando valores, useEffect solo cuando haga falta con dependencias correctas, listas con key estable y renderizado condicional limpio, y un custom hook como bonus."

**Cómo lo verifiqué:**
Ejecuté la aplicación y probé: búsqueda sin resultados (mensaje "sin resultados", no error), modo Offline en DevTools (mensaje de error y botón *Reintentar*), escribir rápido en el buscador (en Network las peticiones antiguas aparecen canceladas), primera y última página (botones deshabilitados), y que los favoritos sigan ahí al recargar y al cambiar de pestaña. Comprobé también que `npm run build` termina sin errores y que no hay avisos de React en la consola.

**Lo que hice yo a mano:**
- Instalar y configurar el entorno (Node, Vite, VS Code) y arrancar el proyecto.
- Crear el repositorio, configurar el remoto y organizar el historial de commits.
- Probar toda la aplicación y adaptar este README con mis propias palabras.

## Autopsia
1. **`useEffect` solo donde hay un efecto real (y no para sincronizar estado):**
   * *Decisión tomada:* Los únicos efectos están en los hooks `useFetch` (pedir datos), `useDebounce` (temporizador) y `useLocalStorage` (guardar). Todo lo demás (personajes a mostrar, estadísticas, contador de favoritos, si una tarjeta es favorita) se calcula durante el render, y la página se reinicia a 1 en los manejadores de evento.
   * *Alternativa descartada:* Usar efectos para copiar datos a otro estado o reiniciar la página cuando cambia el filtro. La descarté porque provocan renders extra, datos desincronizados durante un instante y código más difícil de seguir.

2. **Cancelar peticiones con `AbortController` en el cleanup del efecto:**
   * *Decisión tomada:* `useFetch` crea un `AbortController` por petición y lo cancela en la función de limpieza, ignorando el `AbortError`. Así, si el usuario cambia de búsqueda o página, la respuesta antigua nunca pisa a la nueva.
   * *Alternativa descartada:* No limpiar nada. La descarté porque las respuestas pueden llegar desordenadas y mostrar resultados de una búsqueda anterior, y porque React en `StrictMode` ejecuta los efectos dos veces en desarrollo y dejaría peticiones duplicadas sin cancelar.

3. **Valores derivados en vez de estado duplicado:**
   * *Decisión tomada:* El estado se reduce a lo imprescindible (búsqueda, estado, página, pestaña y favoritos). `characters`, `pages`, `favoriteIds` y las estadísticas se derivan en cada render a partir de él y de los datos de la API.
   * *Alternativa descartada:* Guardar en `useState` la lista filtrada, el total o el contador. La descarté porque habría que actualizarlos a mano cada vez que cambia algo y es la fuente típica de bugs donde la pantalla muestra datos incoherentes.

4. **Custom hooks (`useFetch`, `useDebounce`, `useLocalStorage`) en vez de toda la lógica en `App`:**
   * *Decisión tomada:* Cada hook encapsula una responsabilidad y no sabe nada de personajes, así que se pueden reutilizar en cualquier otro proyecto. `App` solo los combina.
   * *Alternativa descartada:* Escribir los efectos directamente en `App`. La descarté porque la convertiría en un componente-dios con peticiones, temporizadores y almacenamiento mezclados con el JSX.

5. **Elevar el estado de favoritos a `App` en vez de usar Context o estado local en cada tarjeta:**
   * *Decisión tomada:* `App` es la única dueña de `favorites` y pasa `isFavorite` y `onToggleFavorite` por props. Así la pestaña (contador), las tarjetas y la vista de favoritos comparten la misma fuente de verdad.
   * *Alternativa descartada:* Que cada tarjeta guarde su propio estado de favorito, o crear un Context. Con estado local, el contador y la pestaña no se enterarían; y con solo dos niveles de componentes, un Context añadiría complejidad sin necesidad.
