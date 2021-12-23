import * as express from "express";
import {ApiError} from "../exceptions/api-error";
import TokenService from "../service/token-service"


export default function (req: express.Request<{}, {}, {}, {}>, res: express.Response, next: any) {
    try {
        const authorizationHeader = req.headers.authorization
        console.log(authorizationHeader)
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }
        const accessToken = authorizationHeader.split(" ")[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }
        const userData = TokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }
        // @ts-ignore
        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }

}
