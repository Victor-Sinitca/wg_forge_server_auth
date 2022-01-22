"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = __importDefault(require("../service/product-service"));
class ProductController {
    addProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, type } = req.body;
                console.log(`addProduct  data:${data} type:${type}`);
                const oneProduct = yield product_service_1.default.addProduct(data, type);
                yield res.json(oneProduct);
            }
            catch (e) {
                next(e);
            }
        });
    }
    addProductAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, filterData } = req.body;
                console.log(`addProductAdmin addProduct  data:${data} filterData${filterData} `);
                const oneProduct = yield product_service_1.default.addProductAdmin(data, filterData);
                yield res.json(oneProduct);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getOneProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, currency = "$" } = req.query;
                console.log(`getOneProduct id:${id} currency:${currency}`);
                const oneProduct = yield product_service_1.default.getOneProduct(id, currency);
                yield res.json(oneProduct);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getAllProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pageNumber = 1, pageSize = 20, currency = "$" } = req.query;
                console.log(`getOneProduct pageNumber:${pageNumber} pageSize:${pageSize} currency:${currency}`);
                const oneProduct = yield product_service_1.default.getAllProducts(+pageNumber, +pageSize, currency);
                yield res.json(oneProduct);
            }
            catch (e) {
                next(e);
            }
        });
    }
    deleteProductById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const oneProduct = yield product_service_1.default.deleteProductById(id);
                yield res.json(oneProduct);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getProductsByList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { listProductsId, currency = "$" } = req.body;
                console.log(`getProductsByList listProductsId:${listProductsId} currency:${currency}`);
                const products = yield product_service_1.default.getProductsByList(listProductsId, currency);
                yield res.json(products);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getProductsOnFilter(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, currency = "$" } = req.query;
                console.log(`getProductsOnFilter filter:${filter} `);
                const products = yield product_service_1.default.getProductsOnFilter(filter, currency);
                yield res.json(products);
            }
            catch (e) {
                next(e);
            }
        });
    }
    changedProductById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = req.body;
                const products = yield product_service_1.default.changedProductById(data, "S");
                yield res.json(products);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getProductsOnType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, currency = "$" } = req.query;
                console.log(`getProductsOnType filter:${filter} currency:${currency}`);
                const products = yield product_service_1.default.getProductsOnType(filter, currency);
                yield res.json(products);
            }
            catch (e) {
                next(e);
            }
        });
    }
    addManyProductsForType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { products_vehicles_0, type, products_gold_0, data } = req.body;
                const changedData = [];
                if (type === "Technique") {
                    products_vehicles_0.forEach((p) => {
                        let discountType = "";
                        if (p.original_price.real_price.amount !== p.price.real_price.amount) {
                            discountType = `percent`;
                        }
                        changedData.push({
                            name: p.metadata.name,
                            description: p.metadata.description,
                            filter: {
                                nation: p.filter_properties.nation[0],
                                type: p.filter_properties.type[0],
                                tier: p.filter_properties.level[0],
                            },
                            price: {
                                basic: {
                                    cost: p.original_price.real_price.amount,
                                },
                                actual: {
                                    cost: p.price.real_price.amount,
                                    discountType: discountType
                                },
                            },
                            images: {
                                span_1x1: p.metadata.grid_1x1_image,
                                span_2x1: p.metadata.grid_2x1_image,
                            },
                        });
                    });
                }
                else if (type === "Gold") {
                    products_gold_0.forEach((p) => {
                        if (p.original_price) {
                            let discountType = "";
                            if (p.original_price.real_price.amount !== p.price.real_price.amount) {
                                discountType = `percent`;
                            }
                            changedData.push({
                                name: p.metadata.name,
                                description: p.metadata.description,
                                price: {
                                    basic: {
                                        cost: p.original_price.real_price.amount,
                                    },
                                    actual: {
                                        cost: p.price.real_price.amount,
                                        discountType: discountType
                                    },
                                },
                                images: {
                                    span_1x1: p.metadata.grid_1x1_image,
                                    span_2x1: p.metadata.grid_2x1_image,
                                },
                            });
                        }
                    });
                }
                else if (type === "Premium") {
                    data.products_game_premium_0.forEach((p) => {
                        let discountType = "";
                        if (p.original_price.real_price.amount !== p.price.real_price.amount) {
                            discountType = `percent`;
                        }
                        changedData.push({
                            name: p.metadata.name,
                            description: p.metadata.description,
                            price: {
                                basic: {
                                    cost: p.original_price.real_price.amount,
                                },
                                actual: {
                                    cost: p.price.real_price.amount,
                                    discountType: discountType
                                },
                            },
                            images: {
                                span_1x1: p.metadata.grid_1x1_image,
                                span_2x1: p.metadata.grid_2x1_image,
                            },
                        });
                    });
                    data.products_wg_premium_1.forEach((p) => {
                        let discountType = "";
                        if (p.original_price.real_price.amount !== p.price.real_price.amount) {
                            discountType = `percent`;
                        }
                        changedData.push({
                            name: p.metadata.name,
                            description: p.metadata.description,
                            price: {
                                basic: {
                                    cost: p.original_price.real_price.amount,
                                },
                                actual: {
                                    cost: p.price.real_price.amount,
                                    discountType: discountType
                                },
                            },
                            images: {
                                span_1x1: p.metadata.grid_1x1_image,
                                span_2x1: p.metadata.grid_2x1_image,
                            },
                        });
                    });
                    data.products_premium_2.forEach((p) => {
                        let discountType = "";
                        if (p.original_price.real_price.amount !== p.price.real_price.amount) {
                            discountType = `percent`;
                        }
                        changedData.push({
                            name: p.metadata.name,
                            description: p.metadata.description,
                            price: {
                                basic: {
                                    cost: p.original_price.real_price.amount,
                                },
                                actual: {
                                    cost: p.price.real_price.amount,
                                    discountType: discountType
                                },
                            },
                            images: {
                                span_1x1: p.metadata.grid_1x1_image,
                                span_2x1: p.metadata.grid_2x1_image,
                            },
                        });
                    });
                }
                if (changedData.length > 0) {
                    const products = changedData.map((d) => __awaiter(this, void 0, void 0, function* () {
                        return yield product_service_1.default.addProduct(d, type);
                    }));
                    yield res.json(products);
                }
                else
                    yield res.json(changedData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    addManyProductsTech(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, type } = req.body;
                const products = data.map((d) => __awaiter(this, void 0, void 0, function* () {
                    return yield product_service_1.default.addProduct(d, type);
                }));
                yield res.json(products);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.default = new ProductController();
//# sourceMappingURL=product-controller.js.map