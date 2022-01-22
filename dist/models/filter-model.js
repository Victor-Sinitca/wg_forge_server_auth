"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FilterScheme = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, require: true, refPath: 'type' },
    name: { type: String, require: true },
    type: {
        type: String,
        required: true,
        enum: ['Technique', 'Premium', 'Gold', 'Provisions']
    },
    filter: [{ type: String, require: true }],
    priority: { type: Number, min: 0, default: 0, },
    span: { type: Number, min: 1, default: 1, }
});
FilterScheme.methods.getData = function () {
    return {
        id: this._id,
        type: this.type,
        priority: this.priority,
        filter: this.filter
    };
};
const FilterModel = (0, mongoose_1.model)("Filter", FilterScheme);
exports.default = FilterModel;
//# sourceMappingURL=filter-model.js.map