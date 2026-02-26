import axios from  './axios';
import { API } from './endpoint';
export const register = async(registerData:any)=>{
    try{
        const response = await axios.post(API.AUTH.REGISTER, registerData);
        return response.data;
    }catch(err: Error| any){
        throw new Error(err.response?.data?.message || 'Registration failed');
    }
}

export const login = async(loginData:any)=>{
    try{
        const response = await axios.post(API.AUTH.LOGIN, loginData);
        return response.data;
    }catch(err: Error| any){
        throw new Error(err.response?.data?.message || 'Login failed');
    }
}

export const whoami = async(loginData:any)=>{
    try{
        const response = await axios.post(API.AUTH.WHOAMI);
        return response.data;
    }catch(err: Error| any){
        throw new Error(
            err.response?.data?.message ||err.message|| 'FAILED TO FETCH THE DATA'
        );
    }
}
export const updateProfile = async (updateData: any) => {
    try{
        const response = await axios.put(
            API.AUTH.UPDATEPROFILE,
            updateData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data' // IMPORTANT: multer
                }
            }
        );
        return response.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message 
            || err.message  
            || "Failed to update profile" 
        );
    }
    
}

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Request password reset failed');
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(API.AUTH.RESET_PASSWORD(token), { newPassword: newPassword });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Reset password failed');
    }
}

