import UserService from "../service/user-service"
import * as express from "express";
import {UserDataType} from "../type/dataType";
import {ApiError} from "../exceptions/api-error";
import { check, validationResult, ValidationError, ValidationChain, Result } from 'express-validator'

type GetUserDataQueryType = {
    id: string
}
type AddProductBodyType = {
    name: string
}

export type SetUserDataType = {
    data:UserDataType
}



class UserController {
    async registration(req: express.Request<{}, {}, {email:string, password:string, name:string}, {}>, res: express.Response, next: any) {
        try {
            console.log("регистрация.............")
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                // @ts-ignore
                return next(ApiError.BadRequest(`ошибка валидации`, errors.array()))
            }
            const {email, password,name} = req.body
            const userDate = await UserService.registration(email, password, name)
            res.cookie(`refreshToken`, userDate.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userDate)
        } catch (e) {
            next(e)
        }
    }

    async login(req: express.Request<{}, {}, {email:string, password:string}, {}>, res: express.Response, next: any) {
        /* console.log("login try")*/
        try {
            console.log("пользователь зашел")
            const {email, password} = req.body;
            const userData = await UserService.login(email, password)
            res.cookie(`refreshToken`, userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
            /*console.log("login error")*/
        }
    }

    async logout(req: express.Request<{}, {}, {}, {}>, res: express.Response, next: any) {
        try {
            console.log(`пользователь вышел`)
            const {refreshToken} = req.cookies
            const token = await UserService.logout(refreshToken)
            console.log(`пользователь вышел1`)
            res.clearCookie(`refreshToken`)
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async activate(req: express.Request<{}, {}, {}, {}>, res: express.Response, next: any) {
        try {
            // @ts-ignore
            const activationLink = req.params.link
            await UserService.activate(activationLink)
            return res.redirect("" + process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req: express.Request<{}, {}, {}, {}>, res: express.Response, next: any) {
        try {
            const {refreshToken} = req.cookies
            console.log(`refresh: ${refreshToken}`)
            const userData = await UserService.refresh(refreshToken)
            res.cookie(`refreshToken`, userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req: express.Request<{}, {}, {}, {}>, res: express.Response, next: any) {
        try {
            const users = await UserService.getAllUsers()
            await res.json(users)
        } catch (e) {
            next(e)
        }
    }








    async addUser(req: express.Request<{}, {}, AddProductBodyType, {}>, res: express.Response, next: any) {
        try {
            const {name} = req.body
            /*console.log(`addUser - name:${name}`)*/
            const userData = await UserService.addUser(name)
            await res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async setUserData(req: express.Request<{}, {}, SetUserDataType, {}>, res: express.Response, next: any) {
        try {
            const {data} = req.body
            /*console.log(`addUser - name:${name}`)*/
            const userData = await UserService.setUserData(data)
            await res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUserData(req: express.Request<{}, {}, {}, GetUserDataQueryType>, res: express.Response, next: any) {
        try {
            const {id} = req.query
            /* console.log(`id:${userId}`)*/
            const userData = await UserService.getUserData(id)
            await res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getAllUsers(req: express.Request, res: express.Response, next: any) {
        try {
            const userData = await UserService.getAllUsers()
            await res.json(userData)
        } catch (e) {
            next(e)
        }
    }


}
export default new UserController()



