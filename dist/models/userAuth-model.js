"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserScheme = new mongoose_1.Schema({
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    isActivated: { type: Boolean, default: true },
    activationLink: { type: String },
});
UserScheme.methods.getUser = function () {
    return {
        email: this.email,
        id: this._id,
        isActivated: this.isActivated,
    };
};
UserScheme.methods.setIsActivated = function () {
    return {
        email: this.email,
        id: this._id,
        isActivated: this.isActivated,
    };
};
const UserAuthModel = (0, mongoose_1.model)('UserAuth', UserScheme);
exports.default = UserAuthModel;
//# sourceMappingURL=userAuth-model.js.map