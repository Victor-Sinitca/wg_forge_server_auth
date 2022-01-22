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
const filter_model_1 = __importDefault(require("../models/filter-model"));
const gold_model_1 = __importDefault(require("../models/gold-model"));
const premium_model_1 = __importDefault(require("../models/premium-model"));
const currency_model_1 = __importDefault(require("../models/currency-model"));
const technique_model_1 = __importDefault(require("../models/technique-model"));
const provisions_model_1 = __importDefault(require("../models/provisions-model"));
const api_error_1 = require("../exceptions/api-error");
class ProductService {
    addProduct(productData, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            const messages = [];
            if (!productData) {
                resultCode = 1;
                messages.push("product data not set");
            }
            if (!type || typeof type !== "string") {
                resultCode = 1;
                messages.push("type product not set or not string");
            }
            let productDto = null;
            if (type === "Technique") {
                const candidate = yield technique_model_1.default.findOne({ name: productData.name });
                if (candidate) {
                    resultCode = 1;
                    messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`);
                }
                else {
                    let product = yield technique_model_1.default.create(productData);
                    productDto = product.getData();
                    yield filter_model_1.default.create({ productId: productDto.id, name: productDto.name, type: type, filter: [type] });
                }
            }
            else if (type === "Premium") {
                const candidate = yield premium_model_1.default.findOne({ name: productData.name });
                if (candidate) {
                    resultCode = 1;
                    messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`);
                }
                else {
                    let product = yield premium_model_1.default.create(productData);
                    productDto = product.getData();
                    yield filter_model_1.default.create({ productId: productDto.id, name: productDto.name, type: type, filter: [type] });
                }
            }
            else if (type === "Gold") {
                const candidate = yield gold_model_1.default.findOne({ name: productData.name });
                if (candidate) {
                    resultCode = 1;
                    messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`);
                }
                else {
                    let product = yield gold_model_1.default.create(productData);
                    productDto = product.getData();
                    yield filter_model_1.default.create({ productId: productDto.id, name: productDto.name, type: type, filter: [type] });
                }
            }
            else if (type === "Provisions") {
                const candidate = yield provisions_model_1.default.findOne({ name: productData.name });
                if (candidate) {
                    resultCode = 1;
                    messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`);
                }
                else {
                    let product = yield provisions_model_1.default.create(productData);
                    productDto = product.getData();
                    yield filter_model_1.default.create({ productId: productDto.id, name: productDto.name, type: type, filter: [type] });
                }
            }
            else {
                resultCode = 1;
                messages.push(`the type must be one of these strings: Technique Premium Gold Provisions`);
            }
            return {
                resultCode,
                messages,
                data: [productDto] || null
            };
        });
    }
    addProductAdmin(productData, filterData) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            const messages = [];
            if (!productData) {
                resultCode = 1;
                messages.push("product data not set");
            }
            let productDto = null;
            if (filterData.type === "Technique") {
                const candidate = yield technique_model_1.default.findOne({ name: productData.name });
                if (candidate) {
                    resultCode = 1;
                    messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`);
                }
                else {
                    let product = yield technique_model_1.default.create(productData);
                    productDto = product.getData();
                    yield filter_model_1.default.create(Object.assign({ productId: productDto.id, name: productDto.name }, filterData));
                }
            }
            else if (filterData.type === "Premium") {
                const candidate = yield premium_model_1.default.findOne({ name: productData.name });
                if (candidate) {
                    resultCode = 1;
                    messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`);
                }
                else {
                    let product = yield premium_model_1.default.create(productData);
                    productDto = product.getData();
                    yield filter_model_1.default.create(Object.assign({ productId: productDto.id, name: productDto.name }, filterData));
                }
            }
            else if (filterData.type === "Gold") {
                const candidate = yield gold_model_1.default.findOne({ name: productData.name });
                if (candidate) {
                    resultCode = 1;
                    messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`);
                }
                else {
                    let product = yield gold_model_1.default.create(productData);
                    productDto = product.getData();
                    yield filter_model_1.default.create(Object.assign({ productId: productDto.id, name: productDto.name }, filterData));
                }
            }
            else if (filterData.type === "Provisions") {
                const candidate = yield provisions_model_1.default.findOne({ name: productData.name });
                if (candidate) {
                    resultCode = 1;
                    messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`);
                }
                else {
                    let product = yield provisions_model_1.default.create(productData);
                    productDto = product.getData();
                    yield filter_model_1.default.create(Object.assign({ productId: productDto.id, name: productDto.name }, filterData));
                }
            }
            else {
                resultCode = 1;
                messages.push(`the type must be one of these strings: Technique Premium Gold Provisions`);
            }
            return {
                resultCode,
                messages,
                data: [productDto] || null
            };
        });
    }
    deleteProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            const messages = [];
            const product = yield filter_model_1.default.findOne({ productId: productId }).populate('productId');
            console.log("deleteProductById");
            yield product.productId.remove();
            yield product.remove();
            return {
                resultCode,
                messages,
                data: null
            };
        });
    }
    getOneProduct(productId, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            let ratioCurrency = 1;
            const messages = [];
            if (!productId) {
                resultCode = 1;
                messages.push("product id not set");
            }
            const product = yield filter_model_1.default.findOne({ productId: productId }).populate('productId');
            if (!product) {
                throw api_error_1.ApiError.BadRequest(`product with this ID:${productId} is not registered`);
            }
            if (currency !== "$") {
                let currencyDB = yield currency_model_1.default.findOne({ nameCurrency: currency });
                if (currencyDB) {
                    ratioCurrency = currencyDB.getData().ratioToBaseCurrency;
                }
                else
                    currency = "$";
            }
            const productDto = {
                type: product.type,
                span: product.span,
                data: product.productId.getData(ratioCurrency, currency)
            };
            return {
                resultCode,
                messages,
                data: productDto || null
            };
        });
    }
    getProductsByList(listProductsId = [], currency) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            let ratioCurrency = 1;
            const messages = [];
            if (listProductsId.length === 0) {
                resultCode = 1;
                messages.push("array of products id is not set");
            }
            const products = yield filter_model_1.default.find({}).where('productId').in(listProductsId).populate('productId');
            if (!products || products.length === 0) {
                throw api_error_1.ApiError.BadRequest(`no products found`);
            }
            if (currency !== "$") {
                let currencyDB = yield currency_model_1.default.findOne({ nameCurrency: currency });
                if (currencyDB) {
                    ratioCurrency = currencyDB.getData().ratioToBaseCurrency;
                }
                else
                    currency = "$";
            }
            const productDto = products.map((p) => {
                return {
                    type: p.type,
                    span: p.span,
                    data: p.productId.getData(ratioCurrency, currency)
                };
            });
            let productDtoSort = [];
            listProductsId.forEach(productId => {
                productDto.forEach(product => {
                    if (String(productId) === String(product.data.id)) {
                        productDtoSort.push(product);
                        return;
                    }
                });
            });
            if (listProductsId.length !== productDto.length) {
                listProductsId.forEach(productId => {
                    let isProductIdFound = false;
                    productDto.forEach(product => {
                        if (String(productId) === String(product.data.id))
                            isProductIdFound = true;
                    });
                    if (!isProductIdFound) {
                        messages.push(`product with this ID:${productId} is not found `);
                    }
                });
            }
            return {
                resultCode,
                messages,
                data: productDtoSort.length > 0 ? productDtoSort : null
            };
        });
    }
    getProductsOnFilter(filter = "", currency) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!filter)
                throw api_error_1.ApiError.BadRequest(`фильтр не установлен`);
            let resultCode = 0;
            let ratioCurrency = 1;
            const messages = [];
            let products = [];
            if (filter === "All") {
                products = yield filter_model_1.default.find({}).sort({ priority: -1 }).populate('productId');
            }
            else if (filter === "Technique" || filter === "Premium" || filter === "Gold" || filter === "Provisions") {
                products = yield filter_model_1.default.find({}).where('filter').in([filter]).sort({ priority: -1 }).populate('productId');
            }
            else {
                resultCode = 1;
                messages.push(`filter:${filter} must be "Technique" or "Premium"  or "Gold"  or "Provisions"`);
            }
            if (currency !== "$") {
                let currencyDB = yield currency_model_1.default.findOne({ nameCurrency: currency });
                if (currencyDB) {
                    ratioCurrency = currencyDB.getData().ratioToBaseCurrency;
                }
                else
                    currency = "$";
            }
            const productDto = products.map((p) => {
                return {
                    type: p.type,
                    span: p.span,
                    data: p.productId.getData(ratioCurrency, currency)
                };
            });
            return {
                resultCode,
                messages,
                data: productDto || null
            };
        });
    }
    getProductsOnType(filter = "", currency) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!filter)
                throw api_error_1.ApiError.BadRequest(`фильтр не установлен`);
            let resultCode = 0;
            let ratioCurrency = 1;
            const messages = [];
            let products = [];
            if (filter === "All") {
                products = yield filter_model_1.default.find({}).sort({ priority: -1 }).populate('productId');
            }
            else if (filter === "Technique" || filter === "Premium" || filter === "Gold" || filter === "Provisions") {
                products = yield filter_model_1.default.find({}).where('type').in([filter]).sort({ priority: -1 }).populate('productId');
            }
            else {
                resultCode = 1;
                messages.push(`filter:${filter} must be "Technique" or "Premium"  or "Gold"  or "Provisions"`);
            }
            if (currency !== "$") {
                let currencyDB = yield currency_model_1.default.findOne({ nameCurrency: currency });
                if (currencyDB) {
                    ratioCurrency = currencyDB.getData().ratioToBaseCurrency;
                }
                else
                    currency = "$";
            }
            const productDto = products.map((p) => {
                return {
                    priority: p.priority,
                    name: p.name,
                    type: p.type,
                    span: p.span,
                    filter: p.filter,
                    data: p.productId.getData(ratioCurrency, currency)
                };
            });
            return {
                resultCode,
                messages,
                data: productDto || null
            };
        });
    }
    getAllProducts(pageNumber, pageSize, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            const messages = [];
            let ratioCurrency = 1;
            const products = [] = yield filter_model_1.default.find({}).sort({ priority: -1 })
                .populate('productId');
            const length = products.length;
            if (currency !== "$") {
                let currencyDB = yield currency_model_1.default.findOne({ nameCurrency: currency });
                if (currencyDB) {
                    ratioCurrency = currencyDB.getData().ratioToBaseCurrency;
                }
                else
                    currency = "$";
            }
            const filterProducts = products.filter((p, index) => index >= (pageNumber - 1) * pageSize && index < pageNumber * pageSize);
            const productDto = filterProducts.map((p) => {
                return {
                    type: p.type,
                    span: p.span,
                    data: p.productId.getData(ratioCurrency, currency)
                };
            });
            return {
                resultCode,
                messages,
                data: {
                    countProducts: length,
                    products: productDto || null
                }
            };
        });
    }
    changedProductById(productData, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            let ratioCurrency = 1;
            const messages = [];
            if (!productData.data.id) {
                resultCode = 1;
                messages.push("product id not set");
            }
            const product = yield filter_model_1.default.findOne({ productId: productData.data.id }).populate('productId');
            if (!product) {
                throw api_error_1.ApiError.BadRequest(`product with this ID:${productData.data.id} is not registered`);
            }
            product.type = productData.type;
            product.span = productData.span;
            product.priority = productData.priority;
            product.name = productData.name;
            product.filter = productData.filter;
            product.productId.description = productData.data.description;
            product.productId.name = productData.data.name;
            product.productId.price.basic.cost = productData.data.price.basic.cost;
            product.productId.price.actual.cost = productData.data.price.actual.cost;
            product.productId.price.actual.discountType = productData.data.price.actual.discountType;
            product.productId.images.span_1x1 = productData.data.images.span_1x1;
            product.productId.images.span_2x1 = productData.data.images.span_2x1;
            if (product.productId.filter && productData.data.filter) {
                product.productId.filter.is_wheeled = productData.data.filter.is_wheeled;
                product.productId.filter.nation = productData.data.filter.nation;
                product.productId.filter.tier = productData.data.filter.tier;
                product.productId.filter.type = productData.data.filter.type;
            }
            yield product.productId.save();
            yield product.save();
            if (currency !== "$") {
                let currencyDB = yield currency_model_1.default.findOne({ nameCurrency: currency });
                if (currencyDB) {
                    ratioCurrency = currencyDB.getData().ratioToBaseCurrency;
                }
                else
                    currency = "$";
            }
            const productDto = {
                priority: product.priority,
                name: product.name,
                type: product.type,
                span: product.span,
                filter: product.filter,
                data: product.productId.getData(ratioCurrency, currency)
            };
            return {
                resultCode,
                messages,
                data: productDto || null
            };
        });
    }
}
exports.default = new ProductService();
//# sourceMappingURL=product-service.js.map