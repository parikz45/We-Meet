import axios from "axios";

export const loginCalls=async (userCredential,dispatch)=>{
    dispatch({type:"LOGIN_START"});
    try{
        console.log("Login data being sent:", userCredential);
        const res = await axios.post("http://localhost:8800/api/auth/login", userCredential);
        dispatch({type:"LOGIN_SUCCESS", payload:res.data});
    }catch(err){
        dispatch({type:"LOGIN_FAILURE", payload:err});
    }
}