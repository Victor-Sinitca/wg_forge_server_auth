import ProductService, {IFilterData} from "../service/product-service"
import * as express from "express";
import {FilterType, ProductDataType, TechniqueDataType} from "../type/dataType";
import {TechniqueSchemaType} from "../models/technique-model";
import {ProductSchemaType} from "../models/provisions-model";

type AddProductBodyType = {
    data: TechniqueSchemaType;
    type: FilterType

}
type AddProductAdminBodyType = {
    data: TechniqueSchemaType;
    filterData:IFilterData
}
type getOneProductQueryType = {
    id: string,
    currency: string
}
type getAllProductsQueryType = {
    pageNumber:number,
    pageSize:number,
    currency: string
}
type deleteProductByIdType = {
    id: string,
}
type getProductsByListBodyType = {
    listProductsId: Array<string>,
    currency: string
}
type getProductsOnFilterQueryType = {
    filter: string,
    currency: string
}
type addManyProductsForTypeType = {
    products_vehicles_0: any,
    type: FilterType,
    products_gold_0: any,
    data: any,
}
type addManyProductsTechType = {
    data: ProductSchemaType[] | TechniqueSchemaType[],
    type: FilterType
}
type changedProductByIdBodyType ={
    data:any
}

class ProductController {
    async addProduct(req: express.Request<{}, {}, AddProductBodyType, {}>, res: express.Response, next: any) {
        try {
            const {data, type} = req.body
            console.log(`addProduct  data:${data} type:${type}`)
            const oneProduct = await ProductService.addProduct(data, type)
            await res.json(oneProduct)
        } catch (e) {
            next(e)
        }
    }
    async addProductAdmin(req: express.Request<{}, {}, AddProductAdminBodyType, {}>, res: express.Response, next: any) {
        try {
            const {data, filterData} = req.body
            console.log(`addProductAdmin addProduct  data:${data} filterData${filterData} `)
            const oneProduct = await ProductService.addProductAdmin(data, filterData)
            await res.json(oneProduct)
        } catch (e) {
            next(e)
        }
    }

    async getOneProduct(req: express.Request<{}, {}, {}, getOneProductQueryType>, res: express.Response, next: any) {
        try {
            const {id, currency = "$"} = req.query
            console.log(`getOneProduct id:${id} currency:${currency}`)
            const oneProduct = await ProductService.getOneProduct(id, currency)
            await res.json(oneProduct)
        } catch (e) {
            next(e)
        }
    }
    async getAllProducts(req: express.Request<{}, {}, {}, getAllProductsQueryType>, res: express.Response, next: any) {
        try {
            const {pageNumber=1, pageSize=20, currency = "$"} = req.query
            console.log(`getOneProduct pageNumber:${pageNumber} pageSize:${pageSize} currency:${currency}`)
            const oneProduct = await ProductService.getAllProducts(+pageNumber,+pageSize, currency)
            await res.json(oneProduct)
        } catch (e) {
            next(e)
        }
    }
    async deleteProductById(req: express.Request<{}, {}, {}, deleteProductByIdType>, res: express.Response, next: any) {
        try {
            const {id } = req.query
            /* console.log(`id:${userId}`)*/
            const oneProduct = await ProductService.deleteProductById(id)
            await res.json(oneProduct)
        } catch (e) {
            next(e)
        }
    }

    async getProductsByList(req: express.Request<{}, {}, getProductsByListBodyType, {}>, res: express.Response, next: any) {
        try {
            const {listProductsId, currency = "$"} = req.body
            console.log(`getProductsByList listProductsId:${listProductsId} currency:${currency}`)
            const products = await ProductService.getProductsByList(listProductsId, currency)
            await res.json(products)
        } catch (e) {
            next(e)
        }
    }

    async getProductsOnFilter(req: express.Request<{}, {}, {}, getProductsOnFilterQueryType>, res: express.Response, next: any) {
        try {
            const {filter, currency = "$"} = req.query
            console.log(`getProductsOnFilter filter:${filter} `)
            const products = await ProductService.getProductsOnFilter(filter, currency)
            await res.json(products)
        } catch (e) {
            next(e)
        }
    }
    async changedProductById(req: express.Request<{}, {},changedProductByIdBodyType, {} >, res: express.Response, next: any) {
        try {
            const {data} = req.body
            const products = await ProductService.changedProductById(data, "S")
            await res.json(products)
        } catch (e) {
            next(e)
        }
    }
    async getProductsOnType(req: express.Request<{}, {}, {}, getProductsOnFilterQueryType>, res: express.Response, next: any) {
        try {
            const {filter, currency = "$"} = req.query
            console.log(`getProductsOnType filter:${filter} currency:${currency}`)
            const products = await ProductService.getProductsOnType(filter, currency)
            await res.json(products)
        } catch (e) {
            next(e)
        }
    }

    async addManyProductsForType(req: express.Request<{}, {}, addManyProductsForTypeType, {}>, res: express.Response, next: any) {
        try {
            const {products_vehicles_0, type, products_gold_0, data} = req.body
            const changedData: ProductSchemaType[] & TechniqueSchemaType[] = []
            if (type === "Technique") {
                products_vehicles_0.forEach((p: any) => {
                    let discountType = ""
                    if (p.original_price.real_price.amount !== p.price.real_price.amount) {
                        discountType = `percent`
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
                    } as TechniqueSchemaType)
                })
            } else if (type === "Gold") {
                products_gold_0.forEach((p: any) => {
                    if (p.original_price) {
                        let discountType = ""
                        if (p.original_price.real_price.amount !== p.price.real_price.amount) {
                            discountType = `percent`
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
                        } as ProductSchemaType)
                    }
                })
            } else if (type === "Premium") {
                data.products_game_premium_0.forEach((p: any) => {
                    let discountType = ""
                    if (p.original_price.real_price.amount !== p.price.real_price.amount) {
                        discountType = `percent`
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
                    } as ProductSchemaType)
                })
                data.products_wg_premium_1.forEach((p: any) => {
                    let discountType = ""
                    if (p.original_price.real_price.amount !== p.price.real_price.amount) {
                        discountType = `percent`
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
                    } as ProductSchemaType)
                })
                data.products_premium_2.forEach((p: any) => {
                    let discountType = ""
                    if (p.original_price.real_price.amount !== p.price.real_price.amount) {
                        discountType = `percent`
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
                    } as ProductSchemaType)
                })
            }
            if (changedData.length > 0) {
                const products = changedData.map(async (d) => {
                    return await ProductService.addProduct(d, type)
                })
                await res.json(products)
            } else await res.json(changedData)
        } catch (e) {
            next(e)
        }
    }

    async addManyProductsTech(req: express.Request<{}, {}, addManyProductsTechType, {}>, res: express.Response, next: any) {
        try {
            const {data, type} = req.body
            const products = data.map(async (d) => {
                return await ProductService.addProduct(d, type)
            })
            await res.json(products)
        } catch (e) {
            next(e)
        }
    }


}

export default new ProductController()

