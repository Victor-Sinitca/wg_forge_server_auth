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
const api_error_1 = require("../exceptions/api-error");
const userAuth_model_1 = __importDefault(require("../models/userAuth-model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const token_service_1 = __importDefault(require("./token-service"));
const user_model_1 = __importDefault(require("../models/user-model"));
class UserService {
    registration(email, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield userAuth_model_1.default.findOne({ email });
            if (candidate) {
                throw api_error_1.ApiError.BadRequest(`пользователь с таким email:${email} уже зарегистрирован`);
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 3);
            const activationLink = (0, uuid_1.v4)();
            const userAuth = yield userAuth_model_1.default.create({ email, password: hashPassword, activationLink });
            const user = yield user_model_1.default.create({ name, wishlist: [], shoppingList: [], _id: userAuth._id });
            const userAuthDto = userAuth.getUser();
            const userDto = user.getUser();
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userAuthDto));
            console.log(`tokens"${tokens}`);
            yield token_service_1.default.saveToken(userAuthDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userAuthDto, profile: userDto });
        });
    }
    activate(activationLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userAuth_model_1.default.findOne({ activationLink });
            if (!user) {
                throw api_error_1.ApiError.BadRequest("некорректная ссылка для активации");
            }
            user.setIsActivated();
            yield user.save();
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAuth = yield userAuth_model_1.default.findOne({ email });
            if (!userAuth) {
                throw api_error_1.ApiError.BadRequest(`пользователь с таким email не найден`);
            }
            const isPassEquals = yield bcrypt_1.default.compare(password, userAuth.password);
            if (!isPassEquals) {
                throw api_error_1.ApiError.BadRequest("некорректный пароль");
            }
            const userData = yield user_model_1.default.findById(userAuth._id);
            if (!userData) {
                throw api_error_1.ApiError.BadRequest(`профиль пользователя с таким email не найден`);
            }
            const userAuthDto = userAuth.getUser();
            const userDataDto = userData.getUser();
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userAuthDto));
            yield token_service_1.default.saveToken(userAuthDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userAuthDto, profile: userDataDto });
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield token_service_1.default.removeToken(refreshToken);
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw api_error_1.ApiError.UnauthorizedRefreshError();
            }
            const userAuthData = yield token_service_1.default.validateRefreshToken(refreshToken);
            const tokenFromDB = yield token_service_1.default.findToken(refreshToken);
            if (!userAuthData || !tokenFromDB) {
                throw api_error_1.ApiError.UnauthorizedRefreshError();
            }
            const userAuth = yield userAuth_model_1.default.findById(userAuthData.id);
            const userData = yield user_model_1.default.findById(userAuthData.id);
            if (!userData || !userAuth) {
                throw api_error_1.ApiError.BadRequest("пользователь не найден");
            }
            const userAuthDto = userAuth.getUser();
            const userDataDto = userData.getUser();
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userAuthDto));
            yield token_service_1.default.saveToken(userAuthDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userAuthDto, profile: userDataDto });
        });
    }
    addUser(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            const messages = [];
            if (typeof name !== "string") {
                resultCode = 1;
                messages.push(`username:${name} must be a string`);
                return {
                    resultCode,
                    messages,
                    data: null
                };
            }
            const candidate = yield user_model_1.default.findOne({ name });
            if (candidate)
                throw api_error_1.ApiError.BadRequest(`пользователь с таким name:${name} уже зарегистрирован`);
            const user = yield user_model_1.default.create({ name, wishlist: [], shoppingList: [] });
            const userDto = user.getUser();
            return {
                resultCode,
                messages,
                data: userDto
            };
        });
    }
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            const messages = [];
            if (typeof userId !== "string") {
                resultCode = 1;
                messages.push(`userId:${userId} must be a string`);
                return {
                    resultCode,
                    messages,
                    data: null
                };
            }
            const user = yield user_model_1.default.findById(userId);
            if (!user)
                throw api_error_1.ApiError.BadRequest(`user with that id:${userId} in not found`);
            const userDto = user.getUser();
            return {
                resultCode,
                messages,
                data: userDto
            };
        });
    }
    setUserData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            const messages = [];
            const user = yield user_model_1.default.findOne({ _id: data.id });
            if (!user)
                throw api_error_1.ApiError.BadRequest(`user with that id:${data.id} in not found`);
            const userDto = user.setUser(data);
            yield user.save();
            return {
                resultCode,
                messages,
                data: userDto
            };
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCode = 0;
            const messages = [];
            const users = yield user_model_1.default.find();
            if (!users)
                throw api_error_1.ApiError.BadRequest(`users not found`);
            const userDto = [];
            users.forEach((user) => userDto.push(user.getUser()));
            return {
                resultCode,
                messages,
                data: userDto
            };
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=user-service.js.map