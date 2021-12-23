import * as express from "express";
import userController from "../controllers/user-controller"
import productController from "../controllers/product-controller"
import {body} from 'express-validator'
import authMiddleware from "../middlewares/auth-middleware"


export const router = express.Router()



router.post(`/registration`,
    body(`email`).isEmail(),
    body(`password`).isLength({min:5,max:35}),
    userController.registration)
router.post(`/login`,userController.login)
router.post(`/logout`,userController.logout)
router.get(`/activate/:link`,userController.activate)
router.get(`/refresh`,userController.refresh)





router.get(`/user`,authMiddleware,userController.getUserData)


//не исп
router.get(`/users`,userController.getAllUsers)



router.get(`/product/filter`,productController.getProductsOnFilter)
router.get(`/product/type`,productController.getProductsOnType)
router.get(`/product`,productController.getOneProduct)
router.get(`/allProducts`,productController.getAllProducts)
router.get(`/deleteProduct`,productController.deleteProductById)




router.post(`/products`,productController.getProductsByList)
router.post(`/changeProduct`,productController.changedProductById)


router.post(`/addProducts` ,  productController.addManyProductsForType)
router.post(`/addProductsTech` , productController.addManyProductsTech)

router.post(`/product` , productController.addProduct)

router.post(`/productAdmin` , productController.addProductAdmin)

router.post(`/user` , userController.addUser)
router.post(`/userData` , userController.setUserData)


