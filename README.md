# hambug-APIs app
 
 //english below
 
 Bienvenido a Hambur que desea ordenar?
 
 en esta app, tu puedes crear y gestionar la tienda a como tu lo desees, empezaras con instalar las dependencias
 
 -npm install
 
 una vez instaladas, asegurate de abrir postman o swagger para empezar a gestionar o ordenar en Hamburg
 
 si opta por usar swagger en vez de postman dirigese a la siguiente url
 
 http://localhost:5000/api-docs
 
 en las siguientes urls contendran las enpoints necesarias para navegar, nota los metodos requeridos seran escritos antes de las urls
 
 una vez que tengas las dependencias instaladas podras empezar a ordenar o gestionar la tienda, cool
 la all se basa en la creacion de APIs, claro tendras que loguearte para realizar las fuciones de cada enpoint, empezaremos por lo primero
 
  nota importante!
 
 si desea ordenar con diferentes usuarios solo debe modificar la siguiente url
 
 post: http://localhost:5000/order en http://localhost:5000/order?id="numero"  el numero de id buscara el otro usuario registrado, si el usuario existe podra ordenar con ese usuario, solamente funciona con postman
 
 get: http://localhost:5000/ >> nota: la app correra en el puerto 5000
 "Bienvenido a Hamburg por favor inicie sesion para ordenar", sera lo primero que veras en la pagina principal, en las siguientes podras registrater y loguearte
 
 post: http://localhost:5000/register >> aqui te podras registar para luego logearte, los parametros obligatorios son, user "nombre de usuario", password "contraseña", fullname "nombre completo", email "hmm, tu sabes", telefono "numero de telefono", y, adress "direccion actual del usuario". Una vez que hayas llenado el formulario se creara el usuario, nota, si usas postman, escribelo en el cuerpo "body" formato "raw" en tipo "JSON", importante ejemplo {"user" "usuario} 
 
 post: http://localhost:5000/login >> aqui, te podras loguearm solamente llena o aplique los parametros (si es en postman, en formato JSON, claro), user "nombre de usuario", password "contraseña", una vez que llenes el formulario o apliques los parametros seras logueado, si escribes los datos mal, te saldra un mensaje que no existe tal usuario, yay! ok sigamos
 
 get: http://localhost:5000/order >> en aqui podras ver el historial de pedidos del usuario logueado, claro, si no esta logueado te saldra un mensaje indicando que no tienes permiso para acceder "Acceso denegado", uff quien no odia ese mensaje
 
 post: http://localhost:5000/order >> aqui comienzas a realizar tu primer pedido, acuerdese primero de ingresar en el enpoint de pagina principal "primer url" para ver los nombres de los productos disponibles, para iniciar a ordenar debe llenar (swagger) o aplicar (postman, en json) los parametros , name "nombre del producto", quantity "cantidad de unidades a ordenar", facil no?
 
 put: http://localhost:5000/order/edit >> en este magico enpoint, el usuario podra editar el pedido, siempre y cuando el usuario administrado no haya cerrado el pedido, debe llenar (swagger) o aplicar (postman) los paramentros, name "nombre del producto", quantity "numero de unidades", adress "direccion de envio" este punto es opcional
 
 get: http://localhost:5000/admin >> pagina principal del admin, primero deberas inicar sesion, una vez iniciado solo te dara algunas intrucciones de uso, como este
 
 post: http://localhost:5000/admin/register >> aqui se puede crear cuenta del usuario administrador, debe llenar (swagger) o aplicar (postman) los parametros obligatorios, user "nombre de usuario", password "contraseña", fullname "nombre completo", email "hmm, tu sabes", telefono "numero de telefono", y, adress "direccion actual del usuario"
 
 post: http://localhost:5000/admin/login >> aqui, te podras loguearm solamente llena o aplique los parametros (si es en postman, en formato JSON, claro), user "nombre de usuario", password "contraseña", una vez que llenes el formulario o apliques los parametros seras logueado, si escribes los datos mal, te saldra un mensaje que no existe tal usuario,... deja vu
 
 get: http://localhost:5000/admin/orders >> en este endpoint el administrador puede supervisar todos los pedidos realizados, claro, de estar logueado
 
 put: http://localhost:5000/admin/orders >> aqui en este endpoint el administrador puede acatualizar el estado de los pedidos, debe llenar (swagger) o aplicar (postman) los parametros, id "id del pedido creado" (obligatorio, este parametro buscara el pedido y su estado), state "actualiar el estado del pedido" (opcional)
 
 post: http://localhost:5000/admin/add >> en este endpoint el usuario administrador puede agregar un nuevo producto, solamente debes llenar (swagger) o aplicar (postman) los paramentros, name "nombre del producto", price "precio del producto", id "id para registrar el producto", todos los campos son obligatorios
 
 put: http://localhost:5000/admin/edit >> en este endpoint el usuario administrador puede cambiar el nombre o precio del producto, debes llenar (swagger) o aplicar (postman) los parametros, id "id de un producto registrado, este mismo buscara el producto" (obligatorio), name "nuevo nombre de usuario", price "nuevo precio",
 
 delete: http://localhost:5000/admin/delete >> en este punto el usuario administrador podra eliminar un producto, solamente debes llenar (swagger) o aplicar (postman) los parametros, id "id de un producto registrado" (obligatorio), cuando indiques el id, automaticamente se eliminar el producto con ese id
 
 get: http://localhost:5000/admin/payments >> en este endpoint el usuario administrador podra revisar todos los metodos de pagos registrados en la tienda
 
 post: http://localhost:5000/admin/payments >> aqui, el usuario administrador podra registrar un nuevo metodo de pago, solamente se debe llenar (swagger) o aplicar (postman) los parametros, payment "nombre de metodo de pago" (obligatorio), "su tarjeta ha sido rechazada" ,.... oh no
 
 put: http://localhost:5000/admin/payments/edit >> en este endpoint, el usuario administrador podra cambiar el nombre del metodo de pago, los parametros son, name "nombre del metodo de pago registrado" (obligatorio, este verificara si existe tal metodo), new "nuevo nombre" (opcional), bueno ya no es necesario repetir como lo quieras usar
 
 delete: http://localhost:5000/admin/payments/delete >> y finalmente el endpoint donde podra eliminar un metodo de pago, solamente se necesita el parametro, name "nombre del metodo de pago registrado" (obligatorio), si existe el metodo, lo eliminara automaticamente
 
 
 
 English:
 
 Welcome to Hambur What do you want to order?
 
 In this app, you can create and manage the store as you wish, you will start with installing the dependencies
 
 -npm install
 
 once installed, be sure to open postman or swagger to start managing or ordering in Hamburg
 
 if you choose to use swagger instead of postman go to the following url
 
 http: //localhost:5000/api-docs
 
 important note!
 
 if you want to order with different users you just have to modify the following url
 
 post: http: // localhost: 5000 / order at http: // localhost: 5000 / order? id = "number" the id number will look for the other registered user, if the user exists you can order with that user, it only works with postman
 
 In the following urls they will contain the necessary enpoints to navigate, note the required methods will be written before the urls
 
 once you have the dependencies installed you can start ordering or managing the store, cool
 the all is based on the creation of APIs, of course you will have to log in to perform the functions of each enpoint, we will start with the first
 
 get: http://localhost:5000/ >> note: the app will run on port 5000
 "Welcome to Hamburg please log in to order", it will be the first thing you will see on the main page, in the following you will be able to register and log in
 
 post: http://localhost:5000/register >> here you can register and then log in, the mandatory parameters are, user "username", password "password", fullname "full name", email "hmm, you know ", phone" phone number ", and, address" user's current address ". Once you have filled out the form the user will be created, note, if you use postman, write it in the body "body" format "raw" in type "JSON", important example {"user" "user}
 
 post: http://localhost:5000/login >> here, you can log in, just fill in or apply the parameters (if it is in postman, in JSON format, of course), user "username", password "password", a Once you fill out the form or apply the parameters, you will be logged in. If you type the data wrong, you will get a message that there is no such user, yay! OK let's continue
 
 get: http://localhost:5000/order >> here you can see the order history of the logged in user, of course, if you are not logged in you will get a message indicating that you do not have permission to access "Access Denied", uff who does not hate that message
 
 post: http://localhost:5000/order >> here you begin to place your first order, remember first to enter the enpoint of the main page "first url" to see the names of the available products, to start ordering you must fill out (swagger) or apply (postman, in json) the parameters, name "product name", quantity "number of units to order", easy isn't it?
 
 put: http://localhost:5000/order/edit >> in this magic enpoint, the user will be able to edit the order, as long as the managed user has not closed the order, he must fill (swagger) or apply (postman) the parameters, name "product name", quantity "number of units", address "shipping address" this point is optional
 
 get: http://localhost:5000/admin >> admin home page, you must first log in, once started it will only give you some instructions for use, like this
 
 post: http://localhost:5000/admin/register >> here you can create an administrator user account, you must fill (swagger) or apply (postman) the mandatory parameters, user "username", password "password", fullname "full name", email "hmm, do you know", phone "phone number", and, address "user's current address"
 
 post: http://localhost 5000/admin/login >> here, you can loguearm only fill in or apply the parameters (if it is in postman, in JSON format, of course), user "username", password "password" , once you fill out the form or apply the parameters you will be logged in, if you type the data wrong, you will get a message that there is no such user, ... deja vu
 
 get: http://localhost:5000/admin/orders >> in this endpoint the administrator can monitor all the orders made, of course, if logged in
 
 put: http://localhost:5000/admin/orders >> here in this endpoint the administrator can update the status of the orders, he must fill (swagger) or apply (postman) the parameters, id "id of the created order" ( mandatory, this parameter will search for the order and its status), state "update the order status" (optional)
 
 post: http://localhost:5000/admin/add >> in this endpoint the administrator user can add a new product, you just have to fill (swagger) or apply (postman) the parameters, name "product name", price " product price ", id" id to register the product ", all fields are required
 
 put: http://localhost:5000/admin/edit >> in this endpoint the administrator user can change the name or price of the product, you must fill (swagger) or apply (postman) the parameters, id "id of a registered product , it will search for the product "(required), name" new user name ", price" new price ",
 
 
delete: http://localhost:5000/admin/delete >> at this point the administrator user can delete a product, you just have to fill (swagger) or apply (postman) the parameters, id "id of a registered product" (mandatory ), when you indicate the id, the product with that id will automatically be eliminated
 
 get: http://localhost:5000/admin/payments >> in this endpoint the administrator user will be able to review all the payment methods registered in the store
 
 post: http://localhost:5000/admin/payments >> here, the administrator user can register a new payment method, you only have to fill (swagger) or apply (postman) the parameters, payment "name of payment method "(required)," your card has been declined ", .... oh no
 
 put: http://localhost:5000/admin/payments/edit >> in this endpoint, the administrator user can change the name of the payment method, the parameters are, name "name of the registered payment method" (mandatory, this It will check if there is such a method), new "new name" (optional), well it is no longer necessary to repeat as you want to use it
 
 delete: http://localhost:5000/admin/payments/delete >> and finally the endpoint where you can delete a payment method, you only need the parameter, name "name of the registered payment method" (mandatory), if it exists the method will automatically delete it
 
 
 
 
