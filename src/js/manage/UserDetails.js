import React, {useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import ShopIcon from '@mui/icons-material/Shop';import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Cookies from "js-cookie";
import {useEffect} from "react";
import {sendApiGetRequest, sendApiPostRequest} from "../utils/ApiRequests";
import {ADD_CREDIT_URL_PARAM, ADMIN_PARAM, BASE_URL, GET_USER_DETAILS_REQUEST_PATH, LOGIN_URL_PARAM} from "../utils/Globals";
import {
    Alert,
    Button,
    Divider,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    ListItemAvatar,
    ListItemText, Snackbar, TextField
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import '../../css/userdetails.css';
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FrontWarnings from "../errors/FrontWarnings";
import {addProductMessage, addUserCreditMessage, getCookies} from "../utils/Utils";
import {getErrorMessage} from "../errors/GenerateErrorMessage";

function UserDetails(props) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userSearchId = searchParams.get('userId');
    const [currentUser, setCurrentUser] = useState('');
    const [creditToAdd, setCreditToAdd] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const cookies = getCookies();
    const token = cookies.token;
    const userType = cookies.userType;
    const navigate = useNavigate();


    useEffect(() => {
        if (userType === ADMIN_PARAM){
            if (token){
                sendApiGetRequest(BASE_URL + GET_USER_DETAILS_REQUEST_PATH, {token , userId : userSearchId}, res => {
                    if (res.data.success) {
                        setCurrentUser(res.data.userDetailsModel)
                    } else {

                    }
                })
            }
        }else {
            navigate(`/${LOGIN_URL_PARAM}`)
        }
    }, [])


    function handleAddCredit() {
        sendApiPostRequest(BASE_URL + ADD_CREDIT_URL_PARAM , {token,userId:userSearchId,creditToAdd} , res=>{
            if (res.data.success){
                setCurrentUser(res.data.userDetailsModel);
                setCreditToAdd(0);
                setShowSuccess(true)
                setTimeout(()=>{
                    setShowSuccess(false)
                },5000)
            }
        })
    }



    return (
        <div>
            <List className={"details-container"}>
                <ListItem >
                    <ListItemAvatar>
                        <Avatar>
                            <AccountCircleIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Username" secondary={currentUser.username} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <ShopIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Total Products For Sale" secondary={currentUser.totalAuctions} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <CreditCardIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Credit" secondary={currentUser.credit + " $"} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem style={{marginLeft:"10px"}}>
                    <FormControl style={{width:"50%"}} variant="standard">
                        <TextField id={"credit"} type={"number"} label={"Amount"} variant={"standard"} value={creditToAdd} onChange={e=>setCreditToAdd(e.target.value)} InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">$</InputAdornment>
                            ),
                        }}/>
                    </FormControl>
                    <Button disabled={creditToAdd<=0} onClick={handleAddCredit} style={{width:"50%" , marginLeft:"5%" , marginTop:"5%"}} variant="contained">Add Credit</Button>
                </ListItem>
            </List>
            <div>
                {
                    showSuccess &&
                    <Snackbar open={true} anchorOrigin={{ vertical: 'bottom', horizontal: 'center',}}>
                        <Alert severity="success" sx={{ width: '100%' }}>
                            <strong>Credit has been update successfully</strong>
                        </Alert>
                    </Snackbar>
                }

            </div>
        </div>

    );
}

export default UserDetails;