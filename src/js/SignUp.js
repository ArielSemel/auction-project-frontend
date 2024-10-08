import React from 'react';
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {Button, FormControl, InputAdornment, Link, TextField, Typography} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import FrontWarnings from "./errors/FrontWarnings";
import BackErrors from "./errors/BackErrors";
import {useState} from "react";
import {sendApiPostRequest} from "./utils/ApiRequests";
import {
    BASE_URL, ERROR_EMAIL_NOT_VALID, ERROR_FULLNAME_NOT_VALID, ERROR_WEAK_PASSWORD, ERROR_WEAK_USERNAME,
    FEATURES_URL_PARAM,
    LOGIN_URL_PARAM,
    MINIMAL_PASSWORD_LENGTH,
    MINIMAL_USERNAME_LENGTH, PRODUCT_STARTING_PRICE_MUST_BE_INTEGER,
    SIGN_UP_REQUEST_PATH
} from "./utils/Globals";
import Cookies from "js-cookie";
import {
    passwordWarningMessage,
    usernameWarningMessage,
    handleDisableButton,
    containsOnlyLetters,
    fullNameWarningMessage, emailWarningMessage, emailValidation, fullNameValidation
} from "./utils/Utils";
import {useNavigate} from "react-router-dom";
import {getErrorMessage} from "./errors/GenerateErrorMessage";


function SignUp(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [errorCode, setErrorCode] = useState(0);
    const [frontWarning, setFrontWarning] = useState({showError:false,errorCode:""});
    const navigate = useNavigate();

    function handleSubmit() {
        let {showError,errorCode} = validateSignUpFields();
        if(!showError){
            setFrontWarning({showError: false , errorCode:""})
        sendApiPostRequest(BASE_URL+SIGN_UP_REQUEST_PATH , {fullName,email,username,password,repeatPassword} , (response) =>{
            const data = response.data;
            if (data.success){
                // add sucessfull login pop up
                navigate(`/${LOGIN_URL_PARAM}`)
            }else {
                setFrontWarning({showError: false, errorCode: ""})
                setErrorCode(data.errorCode)
                setTimeout(()=>{
                    setErrorCode(0)
                },5000)
            }
        })} else {
            setFrontWarning({showError:true, errorCode: errorCode});
        }

    }

    const validateSignUpFields = () => {
        let showError = true;
        let errorCode = ""
        if ((username.length < MINIMAL_USERNAME_LENGTH)){
            errorCode = ERROR_WEAK_USERNAME;
        }else {
            if((password.length < MINIMAL_PASSWORD_LENGTH)){
                errorCode = ERROR_WEAK_PASSWORD;
            }else {
                if(!(emailValidation(email))){
                    errorCode = ERROR_EMAIL_NOT_VALID;
                }else {
                    if(!(fullNameValidation(fullName))){
                        errorCode = ERROR_FULLNAME_NOT_VALID;
                    } else{
                        showError = false;
                    }
                }
            }
        }
        return {errorCode,showError}
    }


    return (
        <div>
            <div>
                <div className={"form-container-signup"}>
                    <div className={"avatar-container"}>
                        <Avatar className={"avatar"}>
                            <LockOutlinedIcon />
                        </Avatar>
                    </div>
                    <div>
                        <Typography className={"login-title"} component="h1" variant="h5">
                            Sign Up Page
                        </Typography>
                    </div>
                    <div className={"form-field"}>
                        <FormControl variant={"standard"}>
                            <TextField id={"username"} type={"text"} label={"Username"} value={username} onChange={e=>setUsername(e.target.value)} variant={"outlined"} InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}/>
                        </FormControl>
                    </div>
                    <div className={"form-field"}>
                        <FormControl variant={"standard"}>
                            <TextField id={"name"} type={"text"} label={"Full Name"} value={fullName} onChange={e=>setFullName(e.target.value)} variant={"outlined"} InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}/>
                        </FormControl>
                    </div>
                    <div className={"form-field"}>
                        <FormControl variant={"standard"}>
                            <TextField id={"email"} type={"email"} label={"E-Mail Address"} value={email} onChange={e=>setEmail(e.target.value)} variant={"outlined"} InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}/>
                        </FormControl>
                    </div>
                    <div className={"form-field"}>
                        <FormControl variant={"standard"}>
                            <TextField id={"password"} type={"password"} label={"Password"} variant={"outlined"} value={password} onChange={e=>setPassword(e.target.value)} InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                            }}/>
                        </FormControl>
                    </div>
                    <div className={"form-field"}>
                        <FormControl variant={"standard"}>
                            <TextField id={"repeat-password"} type={"password"} label={"Confirm Password"} variant={"outlined"} value={repeatPassword} onChange={e=>setRepeatPassword(e.target.value)} InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                            }}/>
                        </FormControl>
                    </div>
                    <div className={"form-field"}>
                            <Button
                                type={"submit"}
                                variant={"contained"}
                                disabled={handleDisableButton( [username , password , repeatPassword , fullName])} onClick={handleSubmit}>Sign Up</Button>
                    </div>
                    {errorCode !== 0 && <BackErrors errorCode = {errorCode}/>}
                    {frontWarning.showError && <FrontWarnings errorCode = {frontWarning.errorCode}/>}
                </div>
            </div>
            </div>
    );
}
export default SignUp;