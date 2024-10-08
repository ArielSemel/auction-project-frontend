import React from 'react';
import { Toolbar, AppBar, IconButton, Typography, Stack, Button, Fade, MenuItem, Menu } from "@mui/material";
import {CurrencyBitcoin as BitcoinIcon} from '@mui/icons-material';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useEffect} from "react";
import Cookies from "js-cookie";
import {
    ADD_PRODUCT_URL_PARAM, ADMIN_PARAM,
    BASE_URL,
    LOGIN_URL_PARAM, MANAGE_URL_PARAM, MY_BIDS_URL_PARAM,
    MY_PRODUCTS_URL_PARAM,
    PRODUCTS_FOR_SALE_URL_PARAM, USER_PARAM
} from "./utils/Globals";
import {getCookies} from "./utils/Utils";
import {sendApiGetRequest} from "./utils/ApiRequests";


function Navbar() {

    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const {token, userId, userType} = getCookies();
    const [fullName, setFullName] = useState('');
    const [credit, setCredit] = useState(0);
    const [username, setUsername] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    useEffect(() => {
        if (token !== undefined) {
            sendApiGetRequest(BASE_URL+"get-user-stats" , {token,userId} , res=> {
                if (res.data.success){
                    const userStats = res.data.userStats
                    setFullName(userStats.fullName);
                    setCredit(userStats.credit)
                    setUsername(userStats.username)
                }
            })
            setLoggedIn(true)
        }
    }, [navigate]);

    const handleLogOut=(e)=> {
        e.preventDefault();
        Cookies.remove("token");
        Cookies.remove("userId");
        Cookies.remove("userType")
        setLoggedIn(false);
        navigate(`/logout`)
    }

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuItemClick = (link) => {
        setAnchorEl(null);
        navigate(link)
    };


    return (
        <AppBar position={"static"} sx={{bgcolor: '#10A37F'}}>
            <Toolbar>
                <IconButton size={"large"} edge={"start"} color={'inherit'} aria-label={'logo'}>
                    <BitcoinIcon/>
                </IconButton>
                <Typography variant={'h6'} component={'div'}>Auction App</Typography>
                {
                    loggedIn  &&
                    <Typography variant={'h6'} component={'div'}
                                style={{ flexGrow: 1, textAlign: 'center', opacity:'0.8',letterSpacing:'0.5px',fontWeight:'bold'}}>
                        <span style={{marginRight: '400px', color:'#ffffff', fontWeight:'bold',fontSize: '1.2em'}}>{`Hello, ${fullName}`}</span> <span style={{color:'#ffffff', fontWeight:'bold',fontSize: '1.2em'}}>{userType === USER_PARAM && `Balance: ${credit}$`}</span>
                    </Typography>

                }
                <Stack direction={'row'} spacing={2} marginLeft={'auto'}>
                    <Button
                        color={"inherit"}
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        disabled={token === undefined}
                        onClick={handleMenuClick}>
                        Features
                    </Button>
                    <Menu id="fade-menu" MenuListProps={{'aria-labelledby': 'fade-button',}} anchorEl={anchorEl}
                          open={open} onClose={handleMenuItemClick} TransitionComponent={Fade}>
                        {
                            userType === USER_PARAM &&
                            <>
                                <MenuItem onClick={() => handleMenuItemClick(PRODUCTS_FOR_SALE_URL_PARAM)}>Active Auctions</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick(ADD_PRODUCT_URL_PARAM)}>Add new product</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick(MY_PRODUCTS_URL_PARAM)}>My Products</MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick(MY_BIDS_URL_PARAM)}>My Bids</MenuItem>
                            </>
                        }
                        {
                            userType === ADMIN_PARAM &&
                            <>
                                <MenuItem onClick={() => handleMenuItemClick(MANAGE_URL_PARAM)}>Manage Page</MenuItem>
                            </>
                        }
                    </Menu>

                    {
                        !loggedIn ?
                            <>
                                <Button onClick={() => navigate("/login")} color={"inherit"}>Login</Button>
                                <Button onClick={() => navigate("/signup")} color={"inherit"}>Sign Up</Button>
                            </>
                            :
                            <>
                                <Button onClick={handleLogOut} color={"inherit"}>Log Out</Button>
                            </>
                    }
                </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar

