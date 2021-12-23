import {Schema, model, Document} from 'mongoose';


export interface CurrencyDataType {
    nameCurrency: string,
    ratioToBaseCurrency: number
}

export interface CurrencySchemaType {
    nameCurrency: string,
    ratioToBaseCurrency: number
}

export interface CurrencyDocumentType extends CurrencySchemaType, Document {
    getData: () => CurrencyDataType;
}

const CurrencyScheme: Schema<CurrencyDocumentType> = new Schema({
    nameCurrency: {type: String, require: true},
    ratioToBaseCurrency: {type: Number, require: true}
})

CurrencyScheme.methods.getData = function (){
    return {
        nameCurrency: this.nameCurrency,
        ratioToBaseCurrency: this.ratioToBaseCurrency
    }
};
const CurrencyModel = model<CurrencyDocumentType>("Currency", CurrencyScheme);
export default CurrencyModel;



