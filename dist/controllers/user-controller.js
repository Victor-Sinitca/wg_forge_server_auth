"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../service/user-service"));
const api_error_1 = require("../exceptions/api-error");
const express_validator_1 = require("express-validator");
class UserController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("регистрация.............");
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(api_error_1.ApiError.BadRequest(`ошибка валидации`, errors.array()));
                }
                const { email, password, name } = req.body;
                const userDate = yield user_service_1.default.registration(email, password, name);
                res.cookie(`refreshToken`, userDate.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userDate);
            }
            catch (e) {
                next(e);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("пользователь зашел");
                const { email, password } = req.body;
                const userData = yield user_service_1.default.login(email, password);
                res.cookie(`refreshToken`, userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`пользователь вышел`);
                const { refreshToken } = req.cookies;
                const token = yield user_service_1.default.logout(refreshToken);
                console.log(`пользователь вышел1`);
                res.clearCookie(`refreshToken`);
                return res.json(token);
            }
            catch (e) {
                next(e);
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activationLink = req.params.link;
                yield user_service_1.default.activate(activationLink);
                return res.redirect("" + process.env.CLIENT_URL);
            }
            catch (e) {
                next(e);
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                console.log(`refresh: ${refreshToken}`);
                const userData = yield user_service_1.default.refresh(refreshToken);
                res.cookie(`refreshToken`, userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_service_1.default.getAllUsers();
                yield res.json(users);
            }
            catch (e) {
                next(e);
            }
        });
    }
    addUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const userData = yield user_service_1.default.addUser(name);
                yield res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    setUserData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = req.body;
                const userData = yield user_service_1.default.setUserData(data);
                yield res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getUserData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const userData = yield user_service_1.default.getUserData(id);
                yield res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield user_service_1.default.getAllUsers();
                yield res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=user-controller.js.map