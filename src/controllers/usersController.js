const path = require("path");
const { validationResult } = require("express-validator");
const usersDatabase = require(path.resolve(__dirname, "../database/jsonUsersDatabase"));

const loginHeadData = {title: "Login", stylesheet: "/css/login.css"};
const registerHeadData = {title: "Registro", stylesheet: "/css/register.css"};
const profileHeadData = {title: "Perfil", stylesheet: "/css/profile.css"};

const usersController = {
login: (req, res) => res.render("./users/login", {head: loginHeadData}),
register: (req, res) => res.render("./users/register", {head: registerHeadData}),
createUser: (req, res)=> {
    const errors = validationResult(req);
    
    if(errors.isEmpty()){
        if(usersDatabase.userRegister(req.body, req.files) == -1){ //se procede a registrar al usuario
            //No se pudo registrar porque ya existe un usuario con ese email
            errors.errors = [{
                value: "",
                msg: "Ya existe un usuario registrado con este email",
                param: "email",
                location: "body"
            }];

            const old = req.body;
        
            return res.render("./users/register", {errors: errors.mapped(), old: old, head: registerHeadData});

        };

        // El registro fue exitoso
        res.redirect("/");
    }

    //Hubo errores en el formato en el que se ingresaron los datos de registro

    const old = req.body;

    console.log(errors);

    return res.render("./users/register", {errors: errors.mapped(), old: old, head: registerHeadData});
},
loginSubmit: (req, res) => {
    const errors = validationResult(req);
    
    if(errors.isEmpty()){

        if(usersDatabase.checkPassword(req.body.email, req.body.password)){
            const name = usersDatabase.userGetName(req.body.email);
            const token = usersDatabase.userGetToken(req.body.email);
            req.session.user = {
                name: name,
                token: token
            };

            if(req.body.rememberUser == "on"){
                res.cookie("name", name, {maxAge: 9999999});
                res.cookie("token", token, {maxAge: 9999999});
            }

            return res.redirect("/");
        }
        else{
            errors.errors = [{
                value: "",
                msg: "Email o contraseña inválido",
                param: "email",
                location: "body"
            }];
        }

        
    }

    const old = {
        email: req.body.email
    };

    return res.render("./users/login", {errors: errors.mapped(), old: old, head: loginHeadData});
},
profile: (req, res) => {
    return res.render("./users/profile", {head: profileHeadData});
},
logout: (req, res) => {
    //borro de la sesion y de las cookies los datos del usuario
    req.session.user = null;
    res.clearCookie("name");
    res.clearCookie("token");

    return res.redirect("/");
}
}



module.exports = usersController;