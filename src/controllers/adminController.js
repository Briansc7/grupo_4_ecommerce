
const path = require("path");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const database = require(path.resolve(__dirname, "../legacyDatabase/jsonDatabase"));
const usersDatabase = require(path.resolve(__dirname, "../legacyDatabase/jsonUsersDatabase"));

const productCreateHeadData = {title: "Crear Producto", stylesheet: "/css/productCreate.css"};
const productEditHeadData = {title: "Modificar Producto", stylesheet: "/css/productEdit.css"};

const usersAddHeadData = {title: "Crear Nuevo Usuario", stylesheet: "/css/usersAdd.css"};
const usersEditHeadData = {title: "Modificar Usuario", stylesheet: "/css/usersAdd.css"};

const usersListHeadData = {title: "Listado de Usuarios", stylesheet: "/css/usersList.css"};
const usersDetailHeadData = {title: "Detalles de Usuario", stylesheet: "/css/usersDetail.css"};

const adminController = {

productCreate: async (req, res) => res.render("./admin/productCreate", {head: productCreateHeadData, categories: await database.getAllCategories()}),

productStore: async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){ //si hay errores
            let old = req.body;

            return res.render("./admin/productCreate", {head: productCreateHeadData, categories: await database.getAllCategories(), errors: errors.mapped(), old: old})
        }

        let newProduct = {
            subCategoryId: req.body.subCategory,
            brandId: req.body.brand,
            model: req.body.model,
            artNumber: Number(req.body.artNumber),
            price: Number(req.body.price),
            discountPorc: Number(req.body.discount),
            isOnSale: req.body.isOnSale=="on"?1:0,
            isNew: req.body.isNew=="on"?1:0,
            description: req.body.description
        };
    
        let createdProduct = await database.productCreate(newProduct);
        
        let imagesUploaded = [];
        req.files.forEach(img => {
            imagesUploaded.push(img.filename);
        });
    
        if(!imagesUploaded.isEmpty()){
            await database.AddProductImages(createdProduct.id, imagesUploaded);
        }
    
        return res.redirect("/products/productDetail/"+createdProduct.id);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error interno del servidor");
    }
    

    


},

productEdit: async (req, res) => res.render("./admin/productEdit",
    {head: productEditHeadData, product: await database.productDetailGetById(req.params.id), categories: await database.getAllCategories(), selectedCategory: await database.getSelectedCategory(req.params.id)}
    ),

productUpdate: async (req, res) => {
    try {
        let editedProduct = {
            brandId: req.body.brand,
            model: req.body.model,
            artNumber: Number(req.body.artNumber),
            price: Number(req.body.price),
            discountPorc: Number(req.body.discount),
            isOnSale: req.body.isOnSale=="on"?1:0,
            isNew: req.body.isNew=="on"?1:0,
            description: req.body.description
        };
    
        await database.productEdit(req.params.id, editedProduct);
    
        return res.redirect("/admin/productEdit/"+req.params.id);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error interno del servidor");
    }
    
},

productDestroy: async (req, res) => {
    try {
        await database.productDeleteById(req.params.id);
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error interno del servidor");
    }
    
},

usersAdd: (req, res) => {
    return res.render("./admin/usersAdd", {head: usersAddHeadData})
},

usersList: async (req, res) => {
    try {
        let users = await usersDatabase.getAllUsers();

        return res.render("./admin/usersList", {head: usersListHeadData, users});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error interno del servidor");
    }
    
},

usersDetail: async (req, res) =>{
    try {
        let id = req.params.id;

        let user = await usersDatabase.userFindById(id);

        user.id = id;

    return res.render("./admin/usersDetail", {head: usersDetailHeadData, userInfo: user});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error interno del servidor");
    }
    
},

usersCreate: async(req, res) => {
    try {
        let avatar = req.file

        let newUser={
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email:req.body.email,
            password:bcrypt.hashSync(req.body.password, 10),
            birthday:req.body.birthday,
            address:req.body.address,
            zipCode:req.body.zipCode,
            location:req.body.location,
            province:req.body.province,
            image: avatar?avatar.filename:null,
            roleId: req.body.roleId
        };
        await usersDatabase.userCreate(newUser);
    
        return res.redirect("/admin/users");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error interno del servidor");
    }

        
},

usersEdit:  async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await usersDatabase.userFindById(userId);

        return res.render("./admin/usersEdit", {
            head: usersEditHeadData,
            user: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error interno del servidor");
    }
}
,

usersUpdate:async (req, res) => {
    try {
        let id = req.params.id;

    /*Solamente se van a mandar al update los campos que no están vacíos*/
    let editedUser={};  //aca se van a cargar los inputs para el update
    Object.entries(req.body).forEach(entry => { //se iteran los campos del objeto req.body
        const [property, value] = entry;      //se separa en clave valor
    
        if(value&&value!=""){
            let updatedValue = value;

            if(property=="password"){ //si el input leido es password, se tiene que encriptar
                updatedValue = bcrypt.hashSync(updatedValue, 10);
            }
            
            editedUser[property] = updatedValue; //se almacena el input que se va a actualizar el valor
        }

    });
    
    await usersDatabase.userUpdate(id, editedUser);

    return res.redirect("/admin/users");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error interno del servidor");
    }

    
},

usersDestroy: async (req, res) => {
    try {
        await usersDatabase.userDeleteById(req.params.id);
        return res.redirect("/admin/users");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error interno del servidor");
    }
},

}


module.exports = adminController;
