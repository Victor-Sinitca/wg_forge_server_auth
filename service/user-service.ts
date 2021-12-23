import {ApiError} from "../exceptions/api-error";
import UserAuthModel, {UserAuthDataType} from "../models/userAuth-model";
import {UserDataType} from "../type/dataType";

import bcrypt from "bcrypt";
import {v4} from 'uuid';
import tokenService from "./token-service"
import mailService from "./mail-service"
import UserModel from "../models/user-model";


class UserService {
    async registration(email: string, password: string, name: string) {
        const candidate = await UserAuthModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`пользователь с таким email:${email} уже зарегистрирован`,)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = v4()
        const userAuth = await UserAuthModel.create({email, password: hashPassword, activationLink})
        const user = await UserModel.create({name, wishlist: [], shoppingList: [], _id: userAuth._id})

       // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        //console.log(`buuuuuuuuuuuuuuug`)
        const userAuthDto = userAuth.getUser()
        const userDto = user.getUser()
        const tokens = tokenService.generateTokens({...userAuthDto})
        console.log(`tokens"${tokens}`)
        await tokenService.saveToken(userAuthDto.id, tokens.refreshToken)
        return {...tokens, user: userAuthDto, profile: userDto}
    }

    async activate(activationLink: string) {
        const user = await UserAuthModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest("некорректная ссылка для активации")
        }
        user.setIsActivated()
        await user.save()
    }

    async login(email: string, password: string) {
        const userAuth = await UserAuthModel.findOne({email})
        if (!userAuth) {
            throw ApiError.BadRequest(`пользователь с таким email не найден`)
        }
        const isPassEquals = await bcrypt.compare(password, userAuth.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest("некорректный пароль")
        }

        const userData = await UserModel.findById(userAuth._id)
        if (!userData) {
            throw ApiError.BadRequest(`профиль пользователя с таким email не найден`)
        }

        const userAuthDto = userAuth.getUser()
        const userDataDto = userData.getUser()
        const tokens = tokenService.generateTokens({...userAuthDto})
        await tokenService.saveToken(userAuthDto.id, tokens.refreshToken)
        return {...tokens, user: userAuthDto, profile: userDataDto}
    }

    async logout(refreshToken: string) {
        return await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            /*throw ApiError.UnauthorizedError()*/
            throw ApiError.UnauthorizedRefreshError()
        }
        const userAuthData = await tokenService.validateRefreshToken(refreshToken) as UserAuthDataType
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if (!userAuthData || !tokenFromDB) {
            /*throw ApiError.UnauthorizedError()*/
            throw ApiError.UnauthorizedRefreshError()
        }


        const userAuth = await UserAuthModel.findById(userAuthData.id)
        const userData = await UserModel.findById(userAuthData.id)

        if (!userData || !userAuth) {
            throw ApiError.BadRequest("пользователь не найден")
        }

        const userAuthDto = userAuth.getUser()
        const userDataDto = userData.getUser()
        const tokens = tokenService.generateTokens({...userAuthDto})
        await tokenService.saveToken(userAuthDto.id, tokens.refreshToken)
        return {...tokens, user: userAuthDto, profile: userDataDto}
    }







    async addUser(name: string) {
        let resultCode = 0
        const messages: Array<string> = []
        if (typeof name !== "string") {
            resultCode = 1
            messages.push(`username:${name} must be a string`)
            return {
                resultCode,
                messages,
                data: null
            }
        }
        const candidate = await UserModel.findOne({name})
        if (candidate) throw ApiError.BadRequest(`пользователь с таким name:${name} уже зарегистрирован`,)

        const user = await UserModel.create({name, wishlist: [], shoppingList: []})
        const userDto = user.getUser()
        return {
            resultCode,
            messages,
            data: userDto
        }
    }

    async getUserData(userId: string) {
        let resultCode = 0
        const messages: Array<string> = []
        if (typeof userId !== "string") {
            resultCode = 1
            messages.push(`userId:${userId} must be a string`)
            return {
                resultCode,
                messages,
                data: null
            }
        }
        const user = await UserModel.findById( userId)
        if (!user) throw ApiError.BadRequest(`user with that id:${userId} in not found`)

        const userDto = user.getUser()
        return {
            resultCode,
            messages,
            data: userDto
        }
    }

    async setUserData(data: UserDataType) {
        let resultCode = 0
        const messages: Array<string> = []

        const user = await UserModel.findOne({_id: data.id})
        if (!user) throw ApiError.BadRequest(`user with that id:${data.id} in not found`)
        const userDto = user.setUser(data)
        await user.save()
        return {
            resultCode,
            messages,
            data: userDto
        }
    }

    async getAllUsers() {
        let resultCode = 0
        const messages: Array<string> = []
        const users = await UserModel.find()
        if (!users) throw ApiError.BadRequest(`users not found`)

        const userDto: Array<any> = []
        users.forEach((user: any) => userDto.push(user.getUser()))
        return {
            resultCode,
            messages,
            data: userDto
        }
    }
}

export default new UserService()
