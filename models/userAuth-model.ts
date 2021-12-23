import { Schema ,Document, model} from 'mongoose';
import UserModel from "./user-model";

export type UserAuthDataType={
    email: string,
    id: string,
    isActivated: boolean,
}

interface UserAuthSchemaType{
    email:string,
    password: string,
    isActivated: boolean,
    activationLink: string,
}
interface UserAuthDocumentType extends UserAuthSchemaType, Document {
    getUser: () => UserAuthDataType;
    setIsActivated: () => UserAuthDataType;
}


const UserScheme = new Schema({
    email: {type: String, unique: true, require: true},
    password: {type: String, require: true},
    isActivated: {type: Boolean, default: true},
    activationLink: {type: String},
})

UserScheme.methods.getUser = function () {
    return {
        email: this.email,
        id: this._id,
        isActivated: this.isActivated,
    }
};
UserScheme.methods.setIsActivated = function () {
    return {
        email: this.email,
        id: this._id,
        isActivated: this.isActivated,
    }
};

const UserAuthModel = model<UserAuthDocumentType>('UserAuth', UserScheme);
export default UserAuthModel;

