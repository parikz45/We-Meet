import axios from "axios";

export const loginCalls=async (userCredential,dispatch)=>{
    dispatch({type:"LOGIN_START"});
    try{
        const res = await axios.post("https://we-meet-9jye.onrender.com/api/auth/login", userCredential);
        dispatch({type:"LOGIN_SUCCESS", payload:res.data});
        return res.data;
    }catch(err){
        const message = err?.response?.data || "Login failed. Please try again.";
        dispatch({type:"LOGIN_FAILURE", payload:message});
        return null;
    }
}