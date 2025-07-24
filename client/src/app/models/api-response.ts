export interface ApiResponse<T> { //generic class for api responses
    isSuccess: boolean;
    message: string;
    error: string;
    data: T;
}