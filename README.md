# Seguridad en el desarrollo de software #

## Trabajo Práctico Integrador ##
 
### Tema a desarrollar: Inicio sesión mediante el protocolo OAuth ###

### Integrantes ###
- Mariatti, Marcos
- Olivera, Nehuen

### Pasos para levantar el proyecto ###

1. Clonar el repositorio 
2. Pararse en la carpeta del proyecto y montar buildear la imagen de docker
    `docker  build. -t oauth-sds`
3. Correr la imagen de docker
    `docker run -p 49160:3000 oauth-sds`

Si queremos comprobar que la imagen esta corriendo correctamente podemos listar las imagenes de docker y 
luego imprimir los logs 

    Mostramos las imagenes activas:
    `docker ps` 
    Imprimos los logs de nuestra imagen
    `docker logs <id del contenedor>`
    Para saber que esta ejecutando correctamente deberia imprimirse el siguiente mensaje
    Running on http://localhost:3000

### Tecnologías utilizadas ###
 - Node js
 - Express js
 - MongoDB

### Paquetes utilizados ###
| Nombre                  | Versión | Descripción                                                                          |
|-------------------------|---------|--------------------------------------------------------------------------------------|
| body-parser             | 1.20.1  | Paquete que permite parsear a un formato especifico los bodies de las requests       |
| dotenv                  | 16.0.3  | Paquete que permite leer variables de entorno                                        |
| express                 | 4.18.1  | Framework backend para node js                                                       |
 | expresss-session        | 1.17.3  | Paquete que permite manejar sesiones en express                                      |   
 | moongose                | 6.6.5   | Paquete que permite manejar la base de datos MongoDB                                 |
| passport                | 0.6.0   | Paquete que permite manejar la autenticación de usuarios                             |
| passport-google-oauth20 | 2.0.0   | Paquete que permite manejar la autenticación de usuarios mediante el protocolo OAuth |
| passport-local          | 1.0.0   | Paquete que permite manejar la autenticación de usuarios mediante el protocolo local |
| passport-local-mongoose | 5.0.1   | Paquete que permite manejar la autenticación de usuarios mediante el protocolo local |

## Qué es OAuth? ##
Se trata de un protocolo para pasar la autorización de un servicio a otro sin compartir las 
credenciales de usuario reales, como un nombre de usuario y contraseña. Con esta herramienta, 
un usuario puede iniciar sesión en una plataforma y luego estar autorizado para realizar acciones 
y ver datos en otra plataforma.
La mayoria de las redes sociales permite el inicio de sesión mediante OAuth, como por ejemplo
Facebook, Twitter, Google, incluso GitHub.
En este ejemplo vamos a utilizar el protocolo OAuth para el iniciar sesión en nuestro sitio web a traves
de Google.

![Proceso de autorizacion OAuth](https://miro.medium.com/max/640/1*CDWi2lZNnmE0Wu7s4v0CWA.jpeg)

## Qué es Passport? ##
Es un middleware de autenticación para Node.js que maneja diferentes estrategias de autenticación.
En este ejemplo vamos a utilizar el paquete passport-google-oauth20 para manejar la autenticación.
Debemos indicarle una estrategia a utilizar, en este caso la estrategia de Google, y luego
indicarle a passport que utilice esa estrategia.

## Qué es MongoDB? ##
Es una base de datos NoSQL. En este ejemplo vamos a utilizar MongoDB para almacenar los datos de los
usuarios que se autentican mediante OAuth.

## Qué es Mongoose? ##
Es un ORM (Object Relational Mapping) para MongoDB. Nos permite definir modelos de datos
y luego utilizar esos modelos para interactuar con la base de datos.
En nuestro ejemplo vamos a utilizar Mongoose para definir un modelo de usuario.
Este modelo solo va a contener los datos que nos proporciona google, como el nombre, el email y el 
googleId. El googleId es un identificador unico que nos proporciona google para cada usuario.

## Explicación del código ##
### Configuración del sitio en google developers ###
 Lo primero que debemos hacer es ir a la [consola de desarrolladores de Google](http://console.developers.google.com) y crear un proyecto.
 Una vez en el dashboard  vamos a 'seleccionar proyecto' y luego a 'nuevo proyecto'. Agregamos un nombre a nuestro proyecto y lo creamos.
 Luego hacemos click en 'Habilitar API y servicios' y buscamos 'Google+ API' y la habilitamos.
 Una vez habilitada la API vamos a 'Credenciales' y creamos una nueva credencial. 
 Vamos a ser redirigidos a una pantalla donde debemos hacer click en 'Configurar pantalla de consentimiento'.
 Si deseamos que todos los usuarios de google puedan iniciar sesión en nuestro sitio web debemos seleccionar la opción 'externo'.
 Luego de guardar, nos dirigimos a 'Credenciales' y seleccionamos "Crear credenciales" y luego "ID de cliente OAuth".
 Se va a abrir un un form en el que debemos elegir el tipo de aplicación(En este caso web) y el nombre de la aplicación. Tambien en este mismo form nos pedira la URI del sitio, en este caso http://localhost:3000 y la de redireccionamiento http://localhost:3000/auth/google/redirect.
 Luego de guardar, nos va a abrir un modal en el que nos va a mostrar nuestro client_id y client_secret. Estos datos los vamos a utilizar en nuestro código. Es muy importante que estos datos los guardemos de manera que no sean accesibles al todo el mundo. En este ejemplo vamos a utilizar el paquete dotenv para guardar estas variables de entorno en un archivo .env.

### Configuración de passport ###
En el archivo passport-setup.js vamos a configurar passport para que utilice la estrategia de Google.
Lo primero que debemos hacer es importar el paquete passport y el paquete passport-google-oauth20.
Luego debemos importar el modelo de usuario que definimos en el archivo user.js.
Luego debemos configurar passport para que utilice la estrategia de Google. Para esto debemos crear una nueva instancia de GoogleStrategy y pasarle un objeto de configuración. En este objeto debemos pasarle el clientID y el clientSecret que nos proporciona google. Tambien debemos pasarle la URI de redireccionamiento. Luego debemos pasarle una función que se va a ejecutar cuando el usuario se autentique. Esta función va a recibir el accessToken, el refreshToken y el profile. El accessToken es un token que nos proporciona google para que podamos acceder a los datos del usuario. El refreshToken es un token que nos proporciona google para que podamos renovar el accessToken. El profile es un objeto que contiene los datos del usuario. En este ejemplo vamos a guardar el nombre, el email y el googleId en la base de datos. Luego de guardar el usuario en la base de datos, debemos llamar a la función done() para que passport sepa que el proceso de autenticación terminó.
Las funciones SerializeUser y DeserializeUser son funciones que se ejecutan cuando el usuario se autentica. SerializeUser se ejecuta cuando el usuario se autentica y se encarga de guardar el usuario en la sesión. DeserializeUser se ejecuta cuando el usuario hace una petición a la aplicación y se encarga de obtener el usuario de la sesión y guardarlo en la variable req.user.
Lo que hacemos en la base de datos a nivel de codigo, es preguntar si el usuario ya existe en la base de datos. Si existe, lo devolvemos. Si no existe, lo creamos y lo devolvemos.

### Configuracion de router ###
En el archivo auth.js ubicado en la carpeta routers vamos a configurar las rutas de autenticación.
Lo primero que debemos hacer es importar el paquete express y el paquete passport. 
El scope que definimos va a traer los datos del usuario que necesitamos para autenticarlo. En este caso el nombre, el email y el id de google.
Nos va a redirigir automaticamente a auth/google/redirect que es la ruta que definimos en el archivo passport-setup.js.

### Configuracion de server.js ###
En este archivo vamos a importar los modulos necesarios para que neustra aplicacion funcione.
Estos paquetes son todos los definidos en la sección de paquetes de este readme.
Aqui vamos a establecer las rutas de nuestra aplicación. En este caso solo tenemos una ruta que es la de autenticación y el index.
En este archivo definimos el manejo de sesion, la conexion a la base de datos y el puerto en el que va a correr nuestra aplicación.Tambien definimos el middleware de passport y el middleware de express-session y el manejo de errores en caso que se intente acceder a una ruta que no esta definida.

Lo que hacemos en este bloque de codigo es inicializar el passport y definir las rutas de autenticación.


```
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

```



## Problemas a los que nos enfrentamos ##
- Ninguno de los 2 teniamos experiencia usando Node y MongoDB por lo que primero realizamos los cursos gratis
de FreeCodeCamp y luego nos pusimos a investigar sobre el tema.
- El tutorial sobre el que nos guiamos para realizar el proyecto utilizaba passport 0.4.0. Dicha version presenta una 
vulnerabilidad llamada "Session Fixation" lo que hace que cuando un usuario cierra sesión, se le regenera en vez de 
cerrar la sesion. Para solucionar este problema se actualizo la version de passport a 0.6.0.
- Al actualizar la version de passport, se nos presentó un nuevo problema, era necesario utilizar el middleware de manejo
de sesiones express-session. Si bien fue un problema simple de resolver, hay que tener en cuenta que el secret a 
utilizar en sistema real no puede ser un string estatico, sino que debe ser un string aleatorio y debe estar guardado en
el archivo .env.

