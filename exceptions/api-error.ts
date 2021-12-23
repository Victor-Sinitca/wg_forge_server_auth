

export class ApiError extends Error{
    status:any;
    errors:any;

    constructor(status:any, message:any, errors=[]) {
        super(message);
        this.status=status;
        this.errors=errors;

    }
    static UnauthorizedError (){
        return new ApiError(401, "пользователь не авторизован")
    }
    static UnauthorizedRefreshError (){
        return new ApiError(402, "вышел срок авторизации")
    }
    static BadRequest(message:any,errors=[]){
        return new ApiError(400, message,errors)
    }

}
