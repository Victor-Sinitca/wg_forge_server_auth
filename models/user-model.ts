import { Schema ,Document, model} from 'mongoose';
import {UserDataType} from "../type/dataType";
import {SetUserDataType} from "../controllers/user-controller";
import * as mongoose from "mongoose";


interface UserSchemaType{
    _id:string
    name: string,
    wishlist: Array<string>,
    shoppingList: Array<string>,
}
// @ts-ignore
interface UserDocumentType extends UserSchemaType, Document {
    getUser: () => UserDataType;
    setUser: (data:UserDataType) => UserDataType;
}


const UserScheme: Schema<UserDocumentType> = new Schema<UserSchemaType>({
    /*_id: {type: String, require: true},*/
    name: {type: String, require: true},
    wishlist: [{type: String, require: true}],
    shoppingList: [{type: String, require: true}],
})

UserScheme.methods.getUser = function () {
    return {
        id: this._id,
        name: this.name,
        wishlist: this.wishlist,
        shoppingList: this.shoppingList,
    }
};
UserScheme.methods.setUser = function (data:UserDataType) {
    this.wishlist = data.wishlist
    this.shoppingList = data.shoppingList
    this.name = data.name
    return {
        id: this._id,
        name: this.name,
        wishlist: this.wishlist,
        shoppingList: this.shoppingList,
    }
};

const UserModel = model<UserDocumentType>('User', UserScheme);
export default UserModel;


