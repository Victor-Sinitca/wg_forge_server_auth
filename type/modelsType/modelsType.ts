import {Types} from "mongoose";
import {FilterType} from "../dataType";

export interface  FilterSchemaType {
    productId:Types.ObjectId,
    name:string,
    type: FilterType,
    filter:Array<string>
    priority:number,
    span:number
}


export interface  FilterDataType {
    id: string,
    type: string,
    priority: number,
    filter:Array<string>
}

