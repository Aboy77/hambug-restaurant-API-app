//usuarios
const users = require("../db/users")

//usuarios
let user;

//conteo de id, +1 por cada usuario creado
let id = 0;

//response
let response;

//funcion que verifica los campos de cada json o datos u = "user", p = "password", f = "fullname", e = "email", t = "telefono", a = "adress"
function verify(u, p, f, e, t, a, req, res, admin) {
        if(u !== undefined && p !== undefined && f !== undefined && e !== undefined && t !== undefined && a !== undefined) {
            //se verifica si ya existe un email con la misma caracteristicas que se envia en el formulario
            let email = users.filter(u => u.email === e);
            
            if(email.length === 0) {
                //no existe email con las mismas caracteristicas del que se envia en el formulario
                id += 1
                //si los datos fueron validados proceder a crear
                user = {
                    user: u,
                    password: p,
                    fullname: f,
                    email: e,
                    telefono: t,
                    adress: a
                }

                // si la cuenta a crear es un usuario el parametro "admin" sera falso por defecto
                if(!admin) {
                    user.id = parseInt(id)
                    user.admin = admin
                } else {
                    //si la cuenta a crear es admin se id sera diferente ej "1A"
                    user.id = id + "A"
                    user.admin = admin
                }

                //almacenar usuario
                users.push(user)

                //enviar respuesta
                response = {
                    msj: "usuario creado",
                    user: user,
                    code: 200
                }

                state = true
            } else {
                //ya existe un email creado con las mismas caracteristicas
                response = {
                    msj: "ya existe un email registrado con estas caracteristicas, por favor ingrese otro",
                    code: 401
                }
            }

        } else {
    
            response = {
                msj: "todos los campos son requeridos, user, password, fullname, email, telefono, adress",
                code: 403
            }
    
            state = false
        }

    res.status(response.code).json(response)
}


module.exports = {
    response,
    verify
}