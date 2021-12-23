import {Schema, model, Document} from 'mongoose';
import {ProductDataType} from "../type/dataType";

export interface ProductSchemaType {
    name: string,
    description: string,
    price: {
        basic: {
            cost: string,
            currency?: string,
        },
        actual: {
            cost: string,
            discountType: string,
        },
    },
    images: {
        span_1x1: string,
        span_2x1?: string |null,
    },
}

export interface ProductDocumentType extends ProductSchemaType, Document {
    getData: (ratioCurrency?:number, currency?:string) => ProductDataType;
}


const ProvisionsScheme: Schema<ProductDocumentType>  = new Schema({
    name: {type: String, require: true},
    description: {type: String, require: true},
    price: {
        basic: {
            cost: {type: String, require: true},
            currency: {type: String, default: "$",},
        },
        actual: {
            cost: {type: String, require: true,},
            discountType: {type: String, default: "",},
        },
    },
    images: {
        span_1x1: {type: String, require: true},
        span_2x1: {type: String, default: null},
    },
})


ProvisionsScheme.methods.getData = function (ratioCurrency:number =1, currency:string="$") {
    return {
        id: this._id,
        name: this.name,
        description: this.description,
        price: {
            basic: {
                cost:"" + Math.ceil(+this.price.basic.cost * ratioCurrency*100)/100,
                currency: currency,
            },
            actual: {
                cost: "" + Math.ceil(+this.price.actual.cost * ratioCurrency*100)/100,
                discountType: this.price.actual.discountType,
            },
        },
        images: {
            span_1x1: this.images.span_1x1,
            span_2x1: this.images.span_2x1,
        },
    }
};

const ProvisionsModel = model<ProductDocumentType>("Provisions", ProvisionsScheme);
export default ProvisionsModel;



