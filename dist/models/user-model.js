"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserScheme = new mongoose_1.Schema({
    name: { type: String, require: true },
    wishlist: [{ type: String, require: true }],
    shoppingList: [{ type: String, require: true }],
});
UserScheme.methods.getUser = function () {
    return {
        id: this._id,
        name: this.name,
        wishlist: this.wishlist,
        shoppingList: this.shoppingList,
    };
};
UserScheme.methods.setUser = function (data) {
    this.wishlist = data.wishlist;
    this.shoppingList = data.shoppingList;
    this.name = data.name;
    return {
        id: this._id,
        name: this.name,
        wishlist: this.wishlist,
        shoppingList: this.shoppingList,
    };
};
const UserModel = (0, mongoose_1.model)('User', UserScheme);
exports.default = UserModel;
//# sourceMappingURL=user-model.js.map