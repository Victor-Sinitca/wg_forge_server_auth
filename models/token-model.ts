import {Schema, Document, model, Types} from 'mongoose';

interface TokenSchemaType{
    user:Types.ObjectId,
    refreshToken:string,
}

interface TokenDocumentType extends TokenSchemaType, Document {}

const TokenScheme: Schema<TokenDocumentType> = new Schema<TokenSchemaType>({
    user:{type: Schema.Types.ObjectId, ref:`User`},
    refreshToken:{type: String,  require:true},
})




const TokenModel = model<TokenDocumentType>('Token', TokenScheme);
export default TokenModel;