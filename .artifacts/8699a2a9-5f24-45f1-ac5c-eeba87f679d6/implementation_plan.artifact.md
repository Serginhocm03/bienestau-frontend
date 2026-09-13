# Plan de Implementación: Adaptación Dinámica de Imágenes

Este plan detalla los cambios necesarios para que las imágenes en la aplicación se adapten a cualquier tamaño y proporción, evitando recortes automáticos y asegurando una visualización completa tanto en la creación como en el consumo de contenido.

## Propuesta de Cambios

El objetivo es pasar de un modelo de "recorte para llenar" (`resizeMode="cover"`) a uno de "adaptación proporcional" (`resizeMode="contain"` o altura dinámica basada en el aspect ratio).

### 1. Pantalla de Creación/Edición
**Archivo:** [create.tsx](file:///C:/Users/sergi/Desktop/Practicas/bienestau-frontend-master/app/(protected)/bienestar/create.tsx)

*   **Lógica de Selección:** Al seleccionar una imagen con `ImagePicker`, guardaremos sus dimensiones (width/height) para calcular el aspect ratio.
*   **Preview Dinámico:** Cambiaremos el estilo del preview para que no tenga una altura fija de 200px. En su lugar, la altura se calculará dinámicamente según la proporción de la imagen seleccionada, asegurando que se vea completa.
*   **Estilo:** Usaremos `resizeMode="contain"` para garantizar que nada se corte si la imagen es muy extrema.

### 2. Componentes de Visualización (Cards)
Para mantener la armonía estética en las listas pero respetar la imagen:

*   **[EventCard.tsx](file:///C:/Users/sergi/Desktop/Practicas/bienestau-frontend-master/components/bienestar/sections/EventCard.tsx):** Cambiaremos el contenedor de imagen para que use `resizeMode="contain"` con un fondo neutro o adaptaremos la altura del contenedor.
*   **[NewsHero.tsx](file:///C:/Users/sergi/Desktop/Practicas/bienestau-frontend-master/components/bienestar/sections/NewsHero.tsx):** Al ser un elemento destacado, permitiremos que la imagen se vea completa usando un modo que combine estética y fidelidad.

### 3. Vista de Detalle (Modal)
**Archivo:** [DetailModal.tsx](file:///C:/Users/sergi/Desktop/Practicas/bienestau-frontend-master/components/bienestar/sections/DetailModal.tsx)

*   **Imagen Completa:** Es el lugar más importante para ver la foto. Cambiaremos la altura fija de 320px por una altura calculada en base al aspect ratio de la imagen (usando `Image.getSize` para imágenes remotas).
*   **Modo de Ajuste:** Usaremos `resizeMode="contain"` si es necesario, pero la meta es que el contenedor mismo mida lo que la imagen pida.

## User Review Required

> [!IMPORTANT]
> **Consistencia en Listas:** Al permitir que las imágenes tengan alturas diferentes, las "Cards" en la página de inicio podrían tener tamaños desiguales. Esto es más fiel a la imagen original pero rompe la cuadrícula uniforme. ¿Prefieres que las tarjetas mantengan un tamaño fijo (con la imagen contenida dentro y espacios a los lados si no encaja) o que la tarjeta crezca hacia abajo según la foto?

## Plan de Verificación

### Pruebas Manuales
1.  **Subida de imagen Vertical:** Seleccionar una foto de un documento o retrato alto y verificar que en el preview se vea completa.
2.  **Subida de imagen Horizontal (Panorámica):** Verificar que no se estire ni se corte en los bordes.
3.  **Visualización en Detalle:** Abrir una noticia creada con una foto inusual y confirmar que se desplaza correctamente y se ve entera.
4.  **Edición:** Verificar que al editar, la imagen existente también se adapte correctamente (usando `Image.getSize`).
