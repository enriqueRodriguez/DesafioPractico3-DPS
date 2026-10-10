# Biblioteca Digital

Tercer Desafío Práctico — opción **App de Biblioteca Digital / Catálogo de Libros y Préstamos**.

Aplicación móvil hecha con Expo (React Native + TypeScript) que consume un backend simulado en MockAPI.io mediante Axios. Permite explorar el catálogo, registrar libros, cambiar su estado de préstamo y calificación, y darlos de baja.

## Funcionalidades

| Operación | Endpoint | Pantalla |
| --- | --- | --- |
| GET | `/books` | Catálogo (`src/app/(tabs)/index.tsx`) |
| GET | `/books/:id` | Detalle (`src/app/detail/[id].tsx`) |
| POST | `/books` | Agregar (`src/app/(tabs)/create.tsx`) |
| PUT | `/books/:id` | Detalle: editar datos, estado y calificación |
| DELETE | `/books/:id` | Detalle: eliminar con confirmación |

- Buscador dinámico por título o autor, sin distinguir mayúsculas ni tildes.
- Badges de color según disponibilidad: verde para Disponible, naranja para Prestado.
- Calificación de 1 a 5 estrellas.
- Estados de carga, mensajes de error de red con botón para reintentar y estados vacíos.
- Formularios con validación por campo.
- Pantalla de Ajustes para ver, cambiar y probar la URL base de la API.

## Configurar el backend en MockAPI

1. Crea un proyecto en [mockapi.io](https://mockapi.io) con el prefijo `/api/v1`.
2. Crea el recurso `books` con este esquema y sin registros generados automáticamente:

   | Campo | Tipo |
   | --- | --- |
   | `id` | Object ID |
   | `createdAt` | Date |
   | `title` | String |
   | `author` | String |
   | `category` | String |
   | `year` | Number |
   | `imageUrl` | String |
   | `status` | String (`Disponible` o `Prestado`) |
   | `rating` | Number (0 a 5) |

3. Carga los 12 registros iniciales de `scripts/books.seed.json`:

   ```bash
   npm run seed -- https://TU_ID.mockapi.io/api/v1
   ```

4. Copia la URL del proyecto en `DEFAULT_BASE_URL`, dentro de `src/constants/config.ts`.

## Ejecutar la app

```bash
npm install
```

```bash
npx expo start
```

Escanea el código QR con Expo Go o presiona `a` para abrir el emulador de Android.

## Estructura del proyecto

```
src/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      Navegación por pestañas
│   │   ├── index.tsx        Catálogo: GET con FlatList y buscador
│   │   ├── create.tsx       Formulario de registro: POST
│   │   └── settings.tsx     Ver, cambiar y probar la URL base
│   ├── detail/[id].tsx      Detalle: GET, PUT y DELETE
│   └── _layout.tsx          Stack raíz
├── services/
│   ├── api.ts               Instancia centralizada de Axios
│   └── resourceService.ts   getItems, getItemById, createItem, updateItem, deleteItem
├── components/
│   ├── ItemCard.tsx         Tarjeta del FlatList
│   ├── CustomInput.tsx      Entrada de texto con etiqueta y error
│   ├── LoadingSpinner.tsx   Indicador de carga
│   ├── BookForm.tsx         Formulario compartido por registro y edición
│   ├── BookCover.tsx        Portada con respaldo si la imagen falla
│   ├── StatusBadge.tsx      Badge de disponibilidad
│   ├── StarRating.tsx       Calificación de 1 a 5 estrellas
│   └── StateMessage.tsx     Estados vacíos y de error
├── types/
│   └── Entity.ts            Interfaz Book y tipos derivados
└── constants/
    ├── config.ts            URL base, recurso y tiempo de espera
    └── colors.ts            Paleta de colores
```

## Comandos de verificación

```bash
npx tsc --noEmit
```

```bash
npm run lint
```
