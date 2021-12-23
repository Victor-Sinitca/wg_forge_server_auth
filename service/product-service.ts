import FilterModel from "../models/filter-model";
import GoldModel from "../models/gold-model";
import PremiumModel from "../models/premium-model";
import CurrencyModel from "../models/currency-model";
import TechniqueModel, {TechniqueDocumentType, TechniqueSchemaType} from "../models/technique-model";
import ProvisionsModel, {ProductDocumentType, ProductSchemaType} from "../models/provisions-model";
import {ApiError} from "../exceptions/api-error";
import {FilterType, ProductDataType, TechniqueDataType} from "../type/dataType";


export interface IFilterData {
    filter: Array<FilterType | "">,
    priority: number,
    span: number;
    type: FilterType,
}


class ProductService {
    async addProduct(productData: ProductSchemaType | TechniqueSchemaType, type: FilterType) {
        let resultCode = 0
        const messages = []
        if (!productData) {
            resultCode = 1
            messages.push("product data not set")
        }
        if (!type || typeof type !== "string") {
            resultCode = 1
            messages.push("type product not set or not string")
        }
        let productDto: TechniqueDataType | ProductDataType | null = null
        if (type === "Technique") {
            const candidate = await TechniqueModel.findOne({name: productData.name})
            if (candidate) {
                resultCode = 1
                messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`)
            } else {
                let product = await TechniqueModel.create(productData)
                productDto = product.getData()
                await FilterModel.create({productId: productDto.id, name: productDto.name, type: type, filter: [type]})
            }
        } else if (type === "Premium") {
            const candidate = await PremiumModel.findOne({name: productData.name})
            if (candidate) {
                resultCode = 1
                messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`)
            } else {
                let product = await PremiumModel.create(productData)
                productDto = product.getData()
                await FilterModel.create({productId: productDto.id, name: productDto.name, type: type, filter: [type]})
            }


        } else if (type === "Gold") {
            const candidate = await GoldModel.findOne({name: productData.name})
            if (candidate) {
                resultCode = 1
                messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`)
            } else {
                let product = await GoldModel.create(productData)
                productDto = product.getData()
                await FilterModel.create({productId: productDto.id, name: productDto.name, type: type, filter: [type]})
            }

        } else if (type === "Provisions") {
            const candidate = await ProvisionsModel.findOne({name: productData.name})
            if (candidate) {
                resultCode = 1
                messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`)
            } else {
                let product = await ProvisionsModel.create(productData)
                productDto = product.getData()
                await FilterModel.create({productId: productDto.id, name: productDto.name, type: type, filter: [type]})
            }
        } else {
            resultCode = 1
            messages.push(`the type must be one of these strings: Technique Premium Gold Provisions`)
        }
        return {
            resultCode,
            messages,
            data: [productDto] || null
        }
    }

    async addProductAdmin(productData: ProductSchemaType | TechniqueSchemaType, filterData: IFilterData) {
        let resultCode = 0
        const messages = []
        if (!productData) {
            resultCode = 1
            messages.push("product data not set")
        }
        let productDto: TechniqueDataType | ProductDataType | null = null

        if (filterData.type === "Technique") {
            const candidate = await TechniqueModel.findOne({name: productData.name})
            if (candidate) {
                resultCode = 1
                messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`)
            } else {
                let product = await TechniqueModel.create(productData)
                productDto = product.getData()
                await FilterModel.create({productId: productDto.id, name: productDto.name, ...filterData})
            }
        } else if (filterData.type === "Premium") {
            const candidate = await PremiumModel.findOne({name: productData.name})
            if (candidate) {
                resultCode = 1
                messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`)
            } else {
                let product = await PremiumModel.create(productData)
                productDto = product.getData()
                await FilterModel.create({productId: productDto.id, name: productDto.name, ...filterData})
            }


        } else if (filterData.type === "Gold") {
            const candidate = await GoldModel.findOne({name: productData.name})
            if (candidate) {
                resultCode = 1
                messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`)
            } else {
                let product = await GoldModel.create(productData)
                productDto = product.getData()
                await FilterModel.create({productId: productDto.id, name: productDto.name, ...filterData})
            }

        } else if (filterData.type === "Provisions") {
            const candidate = await ProvisionsModel.findOne({name: productData.name})
            if (candidate) {
                resultCode = 1
                messages.push(`продукт с таким именем:${productData.name} уже зарегистрирован`)
            } else {
                let product = await ProvisionsModel.create(productData)
                productDto = product.getData()
                await FilterModel.create({productId: productDto.id, name: productDto.name, ...filterData})
            }
        } else {
            resultCode = 1
            messages.push(`the type must be one of these strings: Technique Premium Gold Provisions`)
        }
        return {
            resultCode,
            messages,
            data: [productDto] || null
        }
    }

    async deleteProductById(productId: string) {
        let resultCode = 0
        const messages = [] as any[]
        const product = await FilterModel.findOne({productId: productId}).populate<{ productId: TechniqueDocumentType }>('productId')
        console.log("deleteProductById")

        await product.productId.remove()
        await product.remove()
        return {
            resultCode,
            messages,
            data: null
        }
    }

    async getOneProduct(productId: string, currency: string) {
        let resultCode = 0
        let ratioCurrency = 1
        const messages = []
        if (!productId) {
            resultCode = 1
            messages.push("product id not set")
        }
        const product = await FilterModel.findOne({productId: productId}).populate<{ productId: TechniqueDocumentType | ProductDocumentType }>('productId')
        if (!product) {
            throw ApiError.BadRequest(`product with this ID:${productId} is not registered`,)
        }
        if (currency !== "$") {
            let currencyDB = await CurrencyModel.findOne({nameCurrency: currency})
            if (currencyDB) {
                ratioCurrency = currencyDB.getData().ratioToBaseCurrency
            } else currency = "$"
        }
        const productDto = {
            type: product.type,
            span: product.span,
            data: product.productId.getData(ratioCurrency, currency)
        }
        return {
            resultCode,
            messages,
            data: productDto || null
        }
    }

    async getProductsByList(listProductsId: Array<string> = [], currency: string) {
        let resultCode = 0
        let ratioCurrency = 1
        const messages = []
        if (listProductsId.length === 0) {
            resultCode = 1
            messages.push("array of products id is not set")
        }
        const products = await FilterModel.find({}).where('productId').in(listProductsId).populate<{ productId: TechniqueDocumentType | ProductDocumentType }>('productId')
        if (!products || products.length === 0) {
            throw ApiError.BadRequest(`no products found`,)
        }
        if (currency !== "$") {
            let currencyDB = await CurrencyModel.findOne({nameCurrency: currency})
            if (currencyDB) {
                ratioCurrency = currencyDB.getData().ratioToBaseCurrency
            } else currency = "$"
        }
        const productDto = products.map((p) => {
            return {
                type: p.type,
                span: p.span,
                // @ts-ignore
                data: p.productId.getData(ratioCurrency, currency)
            }
        })
        let productDtoSort = [] as { type: FilterType, span: number, data: any }[]
        listProductsId.forEach(productId => {
            productDto.forEach(product => {
                if (String(productId) === String(product.data.id)) {
                    productDtoSort.push(product)
                    return
                }
            })
        })


        //если количество найденых продуктов не равно количеству запрошеных
        if (listProductsId.length !== productDto.length) {
            listProductsId.forEach(productId => {
                let isProductIdFound = false
                productDto.forEach(product => {
                    if (String(productId) === String(product.data.id)) isProductIdFound = true
                })
                if (!isProductIdFound) {
                    messages.push(`product with this ID:${productId} is not found `)
                }
            })
        }
        return {
            resultCode,
            messages,
            data: productDtoSort.length > 0 ? productDtoSort : null
        }
    }

    async getProductsOnFilter(filter: string = "", currency: string) {
        if (!filter) throw ApiError.BadRequest(`фильтр не установлен`)
        let resultCode = 0
        let ratioCurrency = 1
        const messages = []
        let products: Array<any> = []
        if (filter === "All") {
            products = await FilterModel.find({}).sort({priority: -1}).populate<{ productId: TechniqueDocumentType | ProductDocumentType }>('productId')
        } else if (filter === "Technique" || filter === "Premium" || filter === "Gold" || filter === "Provisions") {
            products = await FilterModel.find({}).where('filter').in([filter]).sort({priority: -1}).populate<{ productId: TechniqueDocumentType | ProductDocumentType }>('productId')
        } else {
            resultCode = 1
            messages.push(`filter:${filter} must be "Technique" or "Premium"  or "Gold"  or "Provisions"`)
        }
        if (currency !== "$") {
            let currencyDB = await CurrencyModel.findOne({nameCurrency: currency})
            if (currencyDB) {
                ratioCurrency = currencyDB.getData().ratioToBaseCurrency
            } else currency = "$"
        }
        const productDto = products.map((p) => {
            return {
                type: p.type,
                span: p.span,
                data: p.productId.getData(ratioCurrency, currency)
            }
        })
        return {
            resultCode,
            messages,
            data: productDto || null
        }
    }

    async getProductsOnType(filter: string = "", currency: string) {
        if (!filter) throw ApiError.BadRequest(`фильтр не установлен`)
        let resultCode = 0
        let ratioCurrency = 1
        const messages = []
        let products: Array<any> = []
        if (filter === "All") {
            products = await FilterModel.find({}).sort({priority: -1}).populate<{ productId: TechniqueDocumentType | ProductDocumentType }>('productId')
        } else if (filter === "Technique" || filter === "Premium" || filter === "Gold" || filter === "Provisions") {
            products = await FilterModel.find({}).where('type').in([filter]).sort({priority: -1}).populate<{ productId: TechniqueDocumentType | ProductDocumentType }>('productId')
        } else {
            resultCode = 1
            messages.push(`filter:${filter} must be "Technique" or "Premium"  or "Gold"  or "Provisions"`)
        }
        if (currency !== "$") {
            let currencyDB = await CurrencyModel.findOne({nameCurrency: currency})
            if (currencyDB) {
                ratioCurrency = currencyDB.getData().ratioToBaseCurrency
            } else currency = "$"
        }
        const productDto = products.map((p) => {
            return {
                priority: p.priority,
                name: p.name,
                type: p.type,
                span: p.span,
                filter: p.filter,
                data: p.productId.getData(ratioCurrency, currency)
            }
        })
        return {
            resultCode,
            messages,
            data: productDto || null
        }
    }

    async getAllProducts(pageNumber: number, pageSize: number, currency: string) {
        let resultCode = 0
        const messages = [] as Array<string>
        let ratioCurrency = 1
        const products: Array<any> = [] = await FilterModel.find({}).sort({priority: -1})
            .populate<{ productId: TechniqueDocumentType | ProductDocumentType }>('productId')
        const length = products.length

        if (currency !== "$") {
            let currencyDB = await CurrencyModel.findOne({nameCurrency: currency})
            if (currencyDB) {
                ratioCurrency = currencyDB.getData().ratioToBaseCurrency
            } else currency = "$"
        }
        const filterProducts = products.filter((p, index) => index >= (pageNumber - 1) * pageSize && index < pageNumber * pageSize)

        const productDto = filterProducts.map((p,) => {
            return {
                type: p.type,
                span: p.span,
                data: p.productId.getData(ratioCurrency, currency)
            }
        })

        return {
            resultCode,
            messages,
            data: {
                countProducts: length,
                products: productDto || null
            }
        }
    }

    async changedProductById(productData: any, currency: string) {
        let resultCode = 0
        let ratioCurrency = 1
        const messages = []
        if (!productData.data.id) {
            resultCode = 1
            messages.push("product id not set")
        }
        const product = await FilterModel.findOne({productId: productData.data.id}).populate<{ productId: TechniqueDocumentType }>('productId')
        if (!product) {
            throw ApiError.BadRequest(`product with this ID:${productData.data.id} is not registered`,)
        }
        product.type = productData.type
        product.span = productData.span
        product.priority = productData.priority
        product.name = productData.name
        product.filter = productData.filter

        product.productId.description = productData.data.description
        product.productId.name = productData.data.name
        product.productId.price.basic.cost = productData.data.price.basic.cost
        product.productId.price.actual.cost = productData.data.price.actual.cost
        product.productId.price.actual.discountType = productData.data.price.actual.discountType
        product.productId.images.span_1x1 = productData.data.images.span_1x1
        product.productId.images.span_2x1 = productData.data.images.span_2x1

        if (product.productId.filter && productData.data.filter) {
            product.productId.filter.is_wheeled = productData.data.filter.is_wheeled
            product.productId.filter.nation = productData.data.filter.nation
            product.productId.filter.tier = productData.data.filter.tier
            product.productId.filter.type = productData.data.filter.type
        }

        await product.productId.save()
        await product.save()
        if (currency !== "$") {
            let currencyDB = await CurrencyModel.findOne({nameCurrency: currency})
            if (currencyDB) {
                ratioCurrency = currencyDB.getData().ratioToBaseCurrency
            } else currency = "$"
        }
        const productDto = {
            priority: product.priority,
            name: product.name,
            type: product.type,
            span: product.span,
            filter: product.filter,
            data: product.productId.getData(ratioCurrency, currency)
        }
        return {
            resultCode,
            messages,
            data: productDto || null
        }
    }

}

export default new ProductService()
