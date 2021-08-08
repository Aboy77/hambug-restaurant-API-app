//configuraciones iniciales express y swagger
const express = require("express");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//importar usuarios
let users = require("./db/users")

//importar productos
let goods = require("./db/hamburg")

//importar metodos de pago
let payment = require("./db/payments")

//importar funcion que verifica los campos
const helpers = require("./librerias/helpers");
const swaggerJSDoc = require("swagger-jsdoc");

//estado de login
let logState = false;

//usuario logueado
let logUser = {
    user: "",
    id: "",
    adress: "",
    order: null
}

//admin logueado
let admin = {
    name: "",
    id: "",
    state: false
}

//lista de productos ordenados, historial
const orders = []

//middleware globales
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//configuracion swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Hamburg",
            description: "sprint proyect 1",
            version: "1.0.0",
            contact: {
                name: "Brian Cuenca",
                email: "brian@brian"
            }
        }
    },
    apis: ["./app.js"]
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

//verificacion de usuario logIn
const logIn = (req,res,next) => {
    req.user = users;
    next()
}


/**
 * @swagger
 * /:
 *  get:
 *    description: Pagina principal
 *    responses:
 *      200:
 *        description: Bienvenido
 * 
 */


//pagina principal de Hamburg
app.get("/", (req,res) => {
    //respuesta para el pagina principal
    let response;

    //verificacion de logueo, si el usuario esta logueado puede iniciar a ordenar caso contrario solo se puede visualizar los productos
    if(!logState) {
        response = {
            msj: "Bienvenido a Hamburg por favor inicie sesion para ordenar",
            productos: goods
        }
    } else {
        response = {
            msj: "Bienvenido puede comenzar a ordenar",
            usuario: logUser.user,
            id: logUser.id,
            productos: goods
        }
    }
    res.send(response)
})

/**
 * @swagger
 * /register:
 *  post:
 *    description: registro de usuario
 *    parameters:
 *    - name: user
 *      description: nombre de usuario
 *      in: formData
 *      required: true
 *      type: string
 *    - name: password
 *      description: contraseña
 *      in: formData
 *      required: true
 *      type: integer
 *    - name: fullname
 *      description: nombre completo
 *      in: formData
 *      required: true
 *      type: string
 *    - name: email
 *      description: email
 *      in: formData
 *      required: true
 *      type: string
 *    - name: telefono
 *      decription: telefono
 *      in: formData
 *      required: true
 *      type: integer
 *    - name: adress
 *      description: direccion actual
 *      in: formData
 *      required: true
 *      type: string
 *    responses:
 *      200:
 *        description: usuario registrado
 */

//registro de usuario
app.post("/register" ,(req,res) => {
//se creara un booleano para que la funcion pueda identificar si el usuario que se esta creando es un usuario o admin, esto es para otorgar un "id" diferente para cada tipo
let a = false

helpers.verify(req.body.user, req.body.password, req.body.fullname, req.body.email, req.body.telefono, req.body.adress, req ,res, a)
})

/**
 * @swagger
 * /login:
 *  post:
 *    description: Bienvenido por favor haga un log in para empezar a ordenar!
 *    parameters:
 *    - name: user
 *      description: nombre de usuario
 *      in: formData
 *      required: true
 *      type: string
 *    - name: password
 *      description: contraseña
 *      in: formData
 *      required: true
 *      type: integer
 *    responses:
 *      200:
 *        description: log
 */

//endpoint para logueo de usuairio
app.post("/login", logIn, (req,res) => {
    //respuesta
let response;
    //si el estado de logueo es falso se procede a ingresar, caso contrario, debera cerrar sesion


    let userLogin = req.user;

    // crear filtro para identificar usuario
    const logIn = userLogin.filter(u => u.user === req.body.user && u.password === req.body.password);

    // realizar validacion
    if(logIn.length >= 1) {
        //datos del usuario logueado
        const [{user, id, adress}] = logIn

        //se registra usuario logueado
        logUser = {
            user,
            id,
            adress
        }

        //respuesta
        response = {
            msj: `Bienvenido ${user}`,
            user: logIn,
            code: 200
        }

        
    //cambiar estado de logIn
    logState = true
    }  else {
        //si los datos son incorrectos
    response = {
        msj: "usuario no identificado",
        code: 403
    }
    
}

res.status(response.code).json(response)
})

/**
 * @swagger
 * /order:
 *  get:
 *    description: historial de pedidos realizados
 *    responses:
 *      200:
 *        description: historial
 */


//historial de pedidos del usuario
app.get("/order", (req,res) => {
    //respuesta para el pagina principal
    let response;

    //verificacion de logueo, si el usuario esta logueado puede iniciar a ordenar caso contrario solo se puede visualizar los productos
    if(!logState) {
        response = {
            msj: "Acceso denegado",
            code: 403
        }
    } else {
        if(logUser.order !== null) {
            response = {
                msj: `historial de pedidos del usuario ${logUser.user}`,
                orders: logUser.order,
                code: 200
        }
        } else {
            response = {
                msj: "No se ha realizado ningun pedido",
                code: 200,
            }
          }
    }
    res.status(response.code).send(response)
})

/**
 * @swagger
 * /order:
 *  post:
 *    description: endpoint para realizacion de pedidos
 *    parameters:
 *    - name: name
 *      description: nombre del producto ej Focaccia
 *      in: formData
 *      required: true
 *      type: string
 *    - name: quantity
 *      description: cantidad de unidades a ordenar
 *      in: formData
 *      required: true
 *      type: integer
 *    responses:
 *      200:
 *        description: puede realizar pedido
 */

//enpoint para que el usuario puedar ordenar, para hacer una simulacion de compra con diferentes usuarios registrados en la tienda, se debe crear un endpoint singular, cuyo parametro que se pasara en la url sera un numero "id" "/order?id=numero", este numero id sera la identificacion del usuario que esta tratando de ordenar algo, si no hay tal numero id en el endpoint se pasara la cuenta logueada por defecto en el endpoint "/login"
app.post("/order", (req,res) => {
    let response;

    //cantidades agregadas por el usuario
    let q = req.body.quantity;

    //para tratar de obtener el numero de id que se aplica en los parametros llave, valor y descripcion ("key", "value", "description"), primero se debe extraer la url para tratar que informacion recolectar
    let url = req.url;

    //si desea hacer una compra con el usuario anteriormente logueado, no se debe modificar la url
    if(url.length === 6) {
    // //si el usuario esta logueado se procede
    if(logState) {
        //crear orden
        let checkIn;

        //se verifica si el producto existe
        let ordering = goods.filter(g => g.name === req.body.name)

        if(ordering.length !== 0 && q >= 1) {

            //se extrae los datos
            const [{name, price, id}] = ordering;

            checkIn = {
                name: name,
                quantity: q,
                user: logUser.user,
                id: id,
                price: `$ ${price}`,
                total: `$ ${price * q}`,
                payed: payment[0].name,
                state: "preparing"
            }

            //se el usuario agrega direccion de envio se registrara
            let adress = req.body.adress;
            if(adress !== undefined) {
                checkIn.adress = adress
            } else {
                //se no agrego dirreciion de envio se usara la direccion registrada en el usuario
                checkIn.adress = logUser.adress
            }

            //se registra la orden
            orders.push(checkIn)

            //se almazena el historial en el usuario logueado
            logUser.order = checkIn

            response = {
                msj: "orden realizada con exito",
                order: checkIn,
                code: 200
            }
        } else {
            response = {
                msj: "El producto no existe",
                code: 403
            }
        }
    } else {
        response = {
            msj: "Acceso denegado inicie sesion para continuar",
            code: 403
        }
    }
    } else if (q == undefined) {
        response = {
            msj: "Por favor ingrese parametro llamado, quantity, y la cantidad de unidades",
            code: 403
        }
    } else {
    //para realizar compras con multiples cuenta siga las instrucciones de los parametros de url, /order?id="numero"
    
    //una vez obtenida la url se puede extraer la informacion deseada mediante substring
    let number = url.substr(10, url.length)

    let id;
    id = parseInt(number);

    //se verifica que haya algun tipo de informacion calculando el numero de largo "length", de no haber nada dara "0", si es mayor a 0 hay algun tipo de informacion
    if(number.length !== 0) {
        id = parseInt(number);
        
        //ademas se debe verificar que lo que haya dentro de la informacion sea un numero, por que se necesita identificar el usuario por numero id
        if(isNaN(id)) {
            response = {
                msj: "si desea hacer una simulacion de compras de diferentes usuarios, por favor ingrese un numero valido en los parametros de la url /url?id=numero",
                code: 403
            }
        } else {
            //una vez validando la url, se crea un filtro para buscara el usuario median el numero de id puesto en la url
            let search = users.filter(u => u.id === id);

            //tambien se debe validar si el usuario existe
            if(search.length === 0) {
                response = {
                    msj: "No se encontro al usuario",
                    code: 404
                }
            } else {
                const [{user}] = search;
                response = {
                    msj: `Se encontro al usuario: ${user}, puede usar esta cuenta para simular compra`,
                    info: search,
                    code: 200
                }
                
                //una vez validado el usuario puede comenzar a ordenar con esta cuenta mediante postman
                
                //se verifica si el producto existe
                let ordering = goods.filter(g => g.name === req.body.name)

                if(ordering.length !== 0 && q >= 1) {
        
                    //se extrae los datos
                    const [{name, price, id}] = ordering;
        
                    checkIn = {
                        name: name,
                        user: user,
                        quantity: q,
                        id: id,
                        price: `$ ${price}`,
                        total: `$ ${price * q}`
                    }
        
                    //se registra la orden
                    orders.push(checkIn)
        
                    response = {
                        msj: "orden realizada con exito",
                        order: checkIn,
                        code: 200
                    }
                } else {
                    response = {
                        msj: "El producto no existe",
                        code: 403
                    }
                }
            }
        }
    } else {
        response = {
            msj: "Bienvenido, para hacer una simulacion de compras con cuentas diferentes por favor ingrese un numero, que se usara para identificar el usuario registrado la cual hara la compra o siga la estructura de url /url?id=numero",
            code: 403
        }
    }
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /order/edit:
 *  put:
 *    description: edita la orden mientras no se haya cerrado
 *    parameters:
 *    - name: name
 *      description: nombre del producto que desea ej pizza
 *      in: formData
 *      required: true
 *      type: string
 *    - name: quantity
 *      description: cantidad de unidades, nota no puede ser igual a "0"
 *      in: formData
 *      required: true
 *      type: integer
 *    - name: adress
 *      description: direccion de envio
 *      in: formData
 *      required: false
 *      type: string
 *    responses:
 *      200:
 *        description: actualizar pedido actual
 */

//editar el pedido mientras no se haya cerrado
app.put("/order/edit", (req,res) => {
    let response;

    if(!logState) {
        response = {
            msj: "Acceso denegado, inicie sesion",
            code: 403
        }
    } else {

        if(logUser.order.state === "preparing") {
            response = {
                msj: "su pedido sigue en estado de preparacion, puede editar el pedido con los parametros, name, quantity, adress",
                order: logUser.order,
                code: 200
            }

        if(req.body.name !== undefined && req.body.quantity !== undefined) {
        //cantidades agregadas por el usuario
        let q = req.body.quantity;

        //se verifica si el producto existe
        let ordering = goods.filter(g => g.name === req.body.name)

        if(ordering.length !== 0 && q >= 1) {
            //buscamos el pedido anterior del usuario
            let update = orders.filter(o => o.user === logUser.user)

            //se extrae los datos del nuevo pedido
            const [{name, price, id}] = ordering;

            //extraemos los datos del pedido anterior para editar
            update.forEach(u => {
                u.name = name;
                u.quantity = q;
                u.user = logUser.user;
                u.id = id;
                u.price = `$ ${price}`;
                u.total = `$ ${price * q}`;
                u.payed = payment[0].name;
                u.state = "preparing";

            //se el usuario agrega direccion de envio se registrara
            let adress = req.body.adress;
            if(adress !== undefined) {
                u.adress = adress
            } else {
                //se no agrego dirreciion de envio se usara la direccion registrada en el usuario
                u.adress = logUser.adress
            }
            })


            //se almazena el historial en el usuario logueado
            logUser.order = update

            response = {
                msj: "orden cambiado con exito",
                order: update,
                code: 200
            }
        } else {
            response = {
                msj: "El producto no existe",
                code: 403
            }
        }
        }

        } else {
            response = {
                msj: "su pedido ya ha sido cerrado y no puede ser editado",
                code: 200
            }
        }
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /admin:
 *  get:
 *    description: pagina principal de administrado
 *    responses:
 *      200:
 *        description: admin
 */

//para saber qeu administrador esta logueado debe iniciar sesion primero
app.get("/admin", (req,res) => {
    let response;
    if(!admin.state) {
        response = {
            msj: "Debe iniciar sesion",
            code: 403
        }
    } else {
        response = {
            msj: `Bienvenido ${admin.name}, puede comenzar a navegar por los endpoints, recuerde que solo estan disponible los siguiente, /admin/register, /admin/login, /admin/orders`,
            code: 200
        }
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /admin/register:
 *  post:
 *    description: area de registro de usuarios administradores
 *    parameters:
 *    - name: user
 *      description: nombre de usuario
 *      in: formData
 *      required: true
 *      type: string
 *    - name: password
 *      description: contraseña
 *      in: formData
 *      required: true
 *      type: integer
 *    - name: fullname
 *      description: nombre completo
 *      in: formData
 *      required: true
 *      type: string
 *    - name: email
 *      description: email
 *      in: formData
 *      required: true
 *      type: string
 *    - name: telefono
 *      decription: telefono
 *      in: formData
 *      required: true
 *      type: integer
 *    - name: adress
 *      description: direccion actual
 *      in: formData
 *      required: true
 *      type: string
 *    responses:
 *      200:
 *        description: usuario registrado
 */

//se debe registrar un administrador para iniciar sesion
app.post("/admin/register", (req,res) => {
    //se creara un booleano para que la funcion pueda identificar si el usuario que se esta creando es un usuario o admin, esto es para otorgar un "id" diferente para cada tipo
    let a = true

    //se utilizara la funcion creada en el archivo helpers.js para verificar los datos del formulario
    helpers.verify(req.body.user, req.body.password, req.body.fullname, req.body.email, req.body.telefono, req.body.adress, req, res, a)
})

/**
 * @swagger
 * /admin/login:
 *  post:
 *    description: Bienvenido por favor haga un log in para empezar a ordenar!
 *    parameters:
 *    - name: user
 *      description: nombre de usuario
 *      in: formData
 *      required: true
 *      type: string
 *    - name: password
 *      description: contraseña
 *      in: formData
 *      required: true
 *      type: integer
 *    responses:
 *      200:
 *        description: log
 */

//una vez creado, puede iniciar sesion con la cuenta de usuario
app.post("/admin/login", logIn, (req,res) => {
    let response;
    let userLogin = req.user;

        // crear filtro para identificar usuario
        const logIn = userLogin.filter(u => u.user === req.body.user && u.password === req.body.password);

        // realizar validacion
        if(logIn.length >= 1) {
            //datos del usuario logueado
            const [{user, id}] = logIn
    
            //se registra usuario logueado
            admin = {
                name: user,
                id: id,
                state: true
            }
    
            //respuesta
            response = {
                msj: `Bienvenido ${user}`,
                user: logIn,
                code: 200
            }
    
            
        //cambiar estado de logIn
        logState = true
        }  else {
            //si los datos son incorrectos
        response = {
            msj: "usuario no identificado",
            code: 401
        }
        
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /admin/orders:
 *  get:
 *    description: pedidos de usuarios
 *    responses:
 *      200:
 *        description: pedidos
 */

//cuando el admin este logueado podra revisar todos los pedidos de los usuarios
app.get("/admin/orders", (req,res) => {
    let response;

    if(!admin.state) {
        response = {
            msj: "Debes iniciar sesion, acceso denegado",
            code: 401
        }
    } else {
        response = {
            msj: "Lista de pedidos",
            orders: orders,
            code: 200
        }
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /admin/orders:
 *  put:
 *    description: actualizacion de estado de pedidos
 *    parameters:
 *    - name: id
 *      description: id del estado del producto que se desee actualizar
 *      in: formData
 *      required: true
 *      type: integer
 *    - name: state
 *      description: actualizar estado del pedido
 *      in: formData
 *      required: false
 *      type: string
 *    responses:
 *      200:
 *        description: estado de pedidos
 */

//actualizacion de estado de los productos
app.put("/admin/orders", (req,res) => {
    let response;

    if(!admin.state) {
        response = {
            msj: "Debes iniciar sesion, acceso denegado",
            code: 401
        }
    } else {
        //para editar el estado de un pedido es fundamental agregar un id para identificar que producto editar
            let id = req.body.id;

            let edit = orders.filter(o => o.id === id);
    
            const [{state}] = edit

            if(req.body.state == undefined) {
            
            response = {
                msj: `Producto encontrado, su estado actual es ${state}`,
                order: edit,
                code: 200
            }

        } else {
            //se actualiza el estado
            edit.forEach(e => {
                e.state = req.body.state
            })

            response = {
                msj: `Producto actualizado, su estado actual es ${req.body.state}`,
                order: edit,
                code: 200
            }
        }
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /admin/add:
 *  post:
 *    description: agregar nuevos productos a la tienda
 *    parameters:
 *    - name: name
 *      description: nombre del producto
 *      in: formData
 *      required: true
 *      type: string
 *    - name: price
 *      description: precio del producto
 *      in: formData
 *      required: true
 *      type: integer
 *    - name: id
 *      description: id del producto
 *      in: formData
 *      required: true
 *      type: integer
 *    responses:
 *      200:
 *        description: agregar producto
 */

//los usuarios administradores podran dar de alta nuevos productos
app.post("/admin/add", (req,res) => {
    let response;

    if(!admin.state) {
        response = {
            msj: "Acceso denegado",
            code: 403
        }
    } else {
        //nombre del producto
        let name = req.body.name;

        //precio del producto
        let price = req.body.price;

        //id del producto
        let id = req.body.id;

        //se verifica el formulario
        if(name == undefined && price == undefined && id == undefined) {
            response = {
                msj: "Debes llenar todos los campos",
                code: 204
            }
        } else {
            //se crea el nuevo producto con los parametros anteriormente mecionados

            //para no agregar un producto con el mismo id, se verificara si existe alguno con un id similar
            let verifyId = goods.filter(g => g.id === id);

            if(verifyId.length === 0) {
                //si no existe un producto con el mismo id se creara el mismo
                let add = {
                    name,
                    price,
                    id
                }
    
                response = {
                    msj: "Producto añadido con exito",
                    product: add,
                    code: 200
                }
    
                //se almacena el producto
                goods.push(add)
            } else {
                response = {
                    msj: "Ya existe un producto con este id, agregue uno diferente",
                    code: 401
                }
            }
        }
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /admin/edit:
 *  put:
 *    description: actualizacion productos
 *    parameters:
 *    - name: id
 *      description: buscar el producto con el id
 *      in: formData
 *      required: true
 *      type: integer
 *    - name: name
 *      description: cambiar nombre del producto
 *      in: formData
 *      required: false
 *      type: string
 *    - name: price
 *      description: cambiar precio del producto
 *      in: formData
 *      required: false
 *      type: integer
 *    responses:
 *      200:
 *        description: acualizacion de productos
 */

app.put("/admin/edit", (req,res) => {
    let response;

    if(!admin.state) {
        response = {
            msj: "Acceso denegado",
            code: 403
        }
    } else {
        response = {
            msj: "Bienvenido esta esta la lista de productos disponibles para actualizar, por favor envie un parametro id y el numero del producto que desee editar",
            products: goods,
            code: 200
        }

        //se identifica el producto que se desee editar con el parametro id enviado
        if(req.body.id !== undefined) {
            let id = req.body.id;

            let edit = goods.filter(g => g.id === id)

            response = {
                msj: "Producto identificado, puede enviar los parametros name y price para agregar nuevo valor",
                product: edit,
                code: 200
            }

            if(req.body.name !== undefined && req.body.price !== undefined) {
                let nameEdit = req.body.name;
                let priceEdit = req.body.price;

                edit.forEach(e => {
                    e.name = nameEdit;
                    e.price = priceEdit;
                })

                response = {
                    msj: "Producto cambiado con exito",
                    product: edit,
                    code: 201
                }
            }
        }
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /admin/delete:
 *  delete:
 *    description: eliminar un producto de la tienda
 *    parameters:
 *    - name: id
 *      description: buscar el producto con el id para eliminar
 *      in: formData
 *      required: true
 *      type: integer
 *    responses:
 *      200:
 *        description: eliminar producto
 */

//eliminar un producto
app.delete("/admin/delete", (req,res) => {
    let response;

    if(!admin.state) {
        response = {
            msj: "Acceso denegado",
            code: 403
        }
    } else {
        response = {
            msj: "Bienvenido, para eliminar un producto debe enviar un parametro id para buscar el producto que se quiere eliminar",
            code: 200
        }

        if(req.body.id !== undefined) {
            let id = req.body.id;

            let del = goods.filter(g => g.id !== id)

            goods = [...del]

            response = {
                msj: "Producto eliminado",
                list: goods,
                code: 200
            }
            
        }
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /admin/payments:
 *  get:
 *    description: lista de metodos de pagos registrados
 *    responses:
 *      200:
 *        description: lista
 */

//los usuarios administradores pueden ver metodos de pago
app.get("/admin/payments", (req,res) => {
    let response;

    if(!admin.state) {
        response = {
            msj: "Acceso denegado",
            code: 403
        }
    } else {
        response = {
            msj: "Bienvenido, estos son los metodos de pagos actuales de la tienda",
            payments: payment,
            code: 200
        }
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /admin/payments:
 *  post:
 *    description:
 *    parameters:
 *    - name: payment
 *      description: nuevo metodo de pago
 *      in: formData
 *      required: false
 *      type: string
 *    responses:
 *      200:
 *        description: metodos de pago
 */

app.post("/admin/payments", (req,res) => {
    let response;

    if(!admin.state) {
        response = {
            msj: "Acceso denegado",
            code: 403
        }
    } else {
        if(req.body.payment !== undefined) {
            //registrar el metodo de pago
            let pay = {
                name: req.body.payment
            }
            payment.push(pay)


            response = {
                msj: "metodo de pago registrado",
                payment: req.body.payment,
                code: 200
            }
        } else {
            response = {
                msj: "Bienvenido puede agregar un metodo de pago nuevo con el parametro, payment",
                code: 200
            }
        }
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /admin/payments/edit:
 *  put:
 *    description:
 *    parameters:
 *    - name: name
 *      description: buscar metodo de pago ej "cash"
 *      in: formData
 *      required: true
 *      type: string
 *    - name: new
 *      description: nuevo nombre metodo de pago
 *      in: formData
 *      required: false
 *      type: string
 *    responses:
 *      200:
 *        description: metodos de pago
 */

//editar metodos de pagos
app.put("/admin/payments/edit", (req,res) => {
    let response;

    if(!admin.state) {
        response = {
            msj: "Debes iniciar sesion, acceso denegado",
            code: 401
        }
    } else {
        //para editar el estado de un pedido es fundamental agregar un id para identificar que producto editar
            let id = req.body.name;

            let edit = payment.filter(p => p.name === id);
    
            const [{name}] = edit

            if(req.body.new !== undefined) {
            //se actualiza el estado
            edit.forEach(e => {
                e.name = req.body.new
            })

            response = {
                msj: `Producto actualizado, su estado nombre es ${req.body.new}`,
                pay: edit,
                code: 200
            }

        } else {
            response = {
                msj: `Producto encontrado, su nombre actual es ${name}`,
                pay: edit,
                code: 200
            }
        }
    }

    res.status(response.code).json(response)
})

/**
 * @swagger
 * /admin/payments/delete:
 *  delete:
 *    description: elimincion de metodos de pago
 *    parameters:
 *    - name: name
 *      description: nombre del metodo del pago que se desea eliminar ej "cash"
 *      in: formData
 *      required: true
 *      type: string
 *    responses:
 *      200:
 *        description: eliminar metodo de pago
 */

//eliminar metodos de pagos
app.delete("/admin/payments/delete", (req,res) => {
    let response;

    if(!admin.state) {
        response = {
            msj: "Debes iniciar sesion, acceso denegado",
            code: 401
        }
    } else {
        //para editar el estado de un pedido es fundamental agregar un id para identificar que producto editar
            let id = req.body.name;

            let edit = payment.filter(p => p.name !== id);

            if(req.body.name == undefined) {
            
            response = {
                msj: `Bienvenido, puedes eliminar metodo de pago buscando por su nombre registrado`,
                payments: payment,
                code: 200
            }

        } else {
            //se actualiza el estado
            payment = [...edit]

            response = {
                msj: `metodos de pago actualizado`,
                payments: edit,
                code: 200
            }
        }
    }

    res.status(response.code).json(response)
})

app.listen(5000, () => {
    console.log("escuchando el puerto 5000")
})