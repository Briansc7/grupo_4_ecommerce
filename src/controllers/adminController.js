
const path = require("path");

const database = require(path.resolve(__dirname, "../database/jsonDatabase"));

const productCreateHeadData = {title: "Crear Producto", stylesheet: "/css/productCreate.css"};
const productEditHeadData = {title: "Modificar Producto", stylesheet: "/css/productEdit.css"};

const adminController = {

productCreate: (req, res) => res.render("./admin/productCreate", {head: productCreateHeadData}),

productStore: (req, res) => {
    let newProduct = {
        id: null,
        category: req.body.category,
        brand: req.body.brand,
        model: req.body.model,
        artNumber: req.body.artNumber,
        price: req.body.price,
        availability: req.body.availability,
        discount: req.body.discount,
        isOnSale: false,
        characteristics: {
            sonido: {"Cantidad de parlantes": 8}
        },
        images: []
    };

    let newProductId = database.productCreate(newProduct);

    //res.redirect("/products/productDetail/"+newProductId);

    res.redirect("/");

},

productEdit: (req, res) => res.render("./admin/productEdit",
    {head: productEditHeadData, product: database.productGetById(req.params.id)}
    ),

productUpdate: (req, res) => {
    let editedProduct = {
        id: req.params.id,
        category: req.body.category,
        brand: req.body.brand,
        model: req.body.model,
        artNumber: req.body.artNumber,
        price: req.body.price,
        availability: req.body.availability,
        discount: req.body.discount,
        isOnSale: false,
        characteristics: {
            sonido: {"Cantidad de parlantes": 8}
        },
        images: []
    };

    database.productEdit(editedProduct);

    res.redirect("/admin/productEdit/"+req.params.id);
},

productDestroy: (req, res) => {
    database.productDeleteById(req.params.id);
    res.redirect("/");
},



}


module.exports = adminController;