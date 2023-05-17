/**
 * LoginRequest interface is used to define the expected data format of login request.
 */
export interface LoginRequest {
    /**The username of the user. */
    username: string;
    /**The password of the user. */
    password: string;
}

/**
 * ApiResponse interface is used to define the response format of API.
 */
export interface ApiResponse<T = undefined> {
    /**Indicates whether the API call was successful. */
    success: boolean;
    /**The data returned by the API call. */
    data?: T;
}

/**The PasswordValidationResult interface is used to verify that the password is legitimate 
 * and to prompt for a message.  */
interface PasswordValidationResult {
    valid: boolean,
    message: string,
}