import {Schema, model, Document} from 'mongoose';
import {ProductDocumentType} from "./provisions-model";




const GoldScheme: Schema<ProductDocumentType> = new Schema({
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

GoldScheme.methods.getData = function (ratioCurrency:number, currency:string){
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
const GoldModel = model<ProductDocumentType>("Gold", GoldScheme);
export default GoldModel;



