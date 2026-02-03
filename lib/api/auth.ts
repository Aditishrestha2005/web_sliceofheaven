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

