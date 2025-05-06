## Elección de axios

Manejo de errores más sencillo:

    Fetch: Solo rechaza una promesa si hay un error de red o algo similar. Si la respuesta del servidor es un código de error como 404 o 500, Fetch no rechaza automáticamente la promesa. Necesitas manejar esto manualmente verificando response.ok o response.status.

    Axios: Rechaza la promesa automáticamente si hay un código de estado de error (por ejemplo, 404, 500), lo que hace que el manejo de errores sea más intuitivo.

Soporte para JSON de manera predeterminada:

    Fetch: Necesitas llamar a response.json() para convertir la respuesta en formato JSON.

    Axios: Convierte automáticamente las respuestas a JSON, lo que hace que tu código sea más limpio.

## Utilización de react-router-dom

1. Navegación en aplicaciones SPA (Single Page Applications)

React es comúnmente utilizado para crear aplicaciones de una sola página. En una SPA, toda la aplicación se carga inicialmente en el navegador, y la navegación entre las diferentes vistas (páginas) se maneja sin recargar la página completa. react-router-dom permite esta funcionalidad de navegación sin recargar el navegador, manteniendo la experiencia de usuario fluida y rápida.

2. Manejo de Rutas

react-router-dom facilita la definición de diferentes rutas (URLs) en tu aplicación y qué componentes deben ser renderizados cuando se accede a esas rutas. Básicamente, te permite crear URLs amigables para el usuario y asociarlas con diferentes partes de tu aplicación.

Ejemplo: Si tienes una ruta /home en tu aplicación, puedes asociar esa ruta con un componente Home que se renderizará cuando el usuario navegue a esa URL.

react-router-dom se utiliza porque te permite manejar rutas y la navegación dentro de una SPA de manera sencilla y eficaz, además de manejar características avanzadas como parámetros en la URL, navegación programática, y rutas anidadas, todo mientras optimiza la experiencia del usuario con transiciones sin recarga de página.
