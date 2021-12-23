import {Schema, model, Document,Types} from 'mongoose';
import {FilterType} from "../type/dataType";

interface  FilterDataType {
    id: string,
    type: string,
    priority: number,
    filter:Array<string>
}

interface  FilterSchemaType {
    productId:Types.ObjectId,
    name:string,
    type: FilterType,
    filter:Array<string>
    priority:number,
    span:number
}

export interface FilterDocumentType extends FilterSchemaType, Document {
    getData: () => FilterDataType;
}


const FilterScheme: Schema<FilterDocumentType> = new Schema({
    productId:{type:Schema.Types.ObjectId,require: true, refPath: 'type'},
    name:{type: String, require: true},
    type: {
        type: String,
        required: true,
        enum: ['Technique', 'Premium', 'Gold','Provisions']
    },
    filter:[{type: String, require: true}],
    priority:{type: Number, min: 0, default:0,},
    span:{type: Number, min: 1, default:1,}
})

FilterScheme.methods.getData = function () {
    return {
        id: this._id,
        type: this.type,
        priority: this.priority,
        filter:this.filter
    }
};

const FilterModel = model<FilterDocumentType>("Filter", FilterScheme);
export default FilterModel;



