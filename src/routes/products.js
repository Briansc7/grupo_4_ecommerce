const express = require("express");
const productsRouter =  express.Router();
const productsController = require("../controllers/productsController");

productsRouter.get("/productDetail/:id",productsController.productDetail);
productsRouter.get("/productCart",productsController.productCart);

module.exports = productsRouter;