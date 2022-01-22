"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CurrencyScheme = new mongoose_1.Schema({
    nameCurrency: { type: String, require: true },
    ratioToBaseCurrency: { type: Number, require: true }
});
CurrencyScheme.methods.getData = function () {
    return {
        nameCurrency: this.nameCurrency,
        ratioToBaseCurrency: this.ratioToBaseCurrency
    };
};
const CurrencyModel = (0, mongoose_1.model)("Currency", CurrencyScheme);
exports.default = CurrencyModel;
//# sourceMappingURL=currency-model.js.map