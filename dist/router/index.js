"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = __importStar(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const product_controller_1 = __importDefault(require("../controllers/product-controller"));
const express_validator_1 = require("express-validator");
const auth_middleware_1 = __importDefault(require("../middlewares/auth-middleware"));
exports.router = express.Router();
exports.router.post(`/registration`, (0, express_validator_1.body)(`email`).isEmail(), (0, express_validator_1.body)(`password`).isLength({ min: 5, max: 35 }), user_controller_1.default.registration);
exports.router.post(`/login`, user_controller_1.default.login);
exports.router.post(`/logout`, user_controller_1.default.logout);
exports.router.get(`/activate/:link`, user_controller_1.default.activate);
exports.router.get(`/refresh`, user_controller_1.default.refresh);
exports.router.get(`/user`, auth_middleware_1.default, user_controller_1.default.getUserData);
exports.router.get(`/users`, user_controller_1.default.getAllUsers);
exports.router.get(`/product/filter`, product_controller_1.default.getProductsOnFilter);
exports.router.get(`/product/type`, product_controller_1.default.getProductsOnType);
exports.router.get(`/product`, product_controller_1.default.getOneProduct);
exports.router.get(`/allProducts`, product_controller_1.default.getAllProducts);
exports.router.get(`/deleteProduct`, product_controller_1.default.deleteProductById);
exports.router.post(`/products`, product_controller_1.default.getProductsByList);
exports.router.post(`/changeProduct`, product_controller_1.default.changedProductById);
exports.router.post(`/addProducts`, product_controller_1.default.addManyProductsForType);
exports.router.post(`/addProductsTech`, product_controller_1.default.addManyProductsTech);
exports.router.post(`/product`, product_controller_1.default.addProduct);
exports.router.post(`/productAdmin`, product_controller_1.default.addProductAdmin);
exports.router.post(`/user`, user_controller_1.default.addUser);
exports.router.post(`/userData`, user_controller_1.default.setUserData);
//# sourceMappingURL=index.js.map