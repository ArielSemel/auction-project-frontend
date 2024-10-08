import React, {useEffect, useState} from 'react';
import {getMyProductsRequest, sendApiPostRequest} from "./utils/ApiRequests";
import {
    BASE_URL,
    CLOSE_AUCTION_REQUEST_PATH,
     MANAGE_URL_PARAM,
    USER_PARAM
} from "./utils/Globals";
import {useNavigate} from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {getCookies} from "./utils/Utils";
import {Button} from "@mui/material";
import BackErrors from "./errors/BackErrors";

function MyProducts(props) {

    const [myProducts, setMyProducts] = useState([]);
    const {token,userId,userType} = getCookies()
    const [errorCode, setErrorCode] = useState(0);
    const navigate = useNavigate();
    const columns = [
        {label:"Product Id"} ,
        {label:"Product name"} ,
        {label:"Open For Sale"},
        {label:"Biggest Bid"},
    ]


    useEffect(() => {
        if (userType === USER_PARAM) {
            if (token) {
                getMyProductsRequest({token, userId}, res => {
                    if (res.data.success) {
                        setMyProducts(res.data.productsList);
                    } else {
                        setErrorCode(res.data.errorCode)
                        setTimeout(()=>{
                            setErrorCode(0)
                        },5000)
                    }
                })
            }
        } else {
            navigate(`/${MANAGE_URL_PARAM}`)
        }

    }, []);

    function handleCloseAuction(productId) {
        sendApiPostRequest(BASE_URL + CLOSE_AUCTION_REQUEST_PATH, {token, userId, productId}, res => {
            if (res.data.success) {
                window.location.reload()
            } else {
                setErrorCode(res.data.errorCode)
                setTimeout(() => {
                    setErrorCode(0)
                }, 5000)
            }
        })
    }

    return (

        <div>
            <div>
                {
                    myProducts.length === 0 ? "No Products yet" :
                        <TableContainer >
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead align="center">
                                    <TableRow >
                                        {
                                            columns.map(col => <TableCell>{col.label}</TableCell>)
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        myProducts.map((product) => (
                                            <>
                                            <TableRow className="table-row" key={product.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                                <TableCell component="th" scope="row">{product.id}</TableCell>
                                                <TableCell component="th" scope="row">{product.name}</TableCell>
                                                <TableCell component="th" scope="row">{product.openForSale ? "Open" : "Closed"}</TableCell>
                                                <TableCell component="th" scope="row">{product.biggestBid !== undefined ? product.biggestBid : "-"}</TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Button disabled={!product.openForSale} style={{color:product.openForSale && "indianred"}} size={"small"} onClick={()=>handleCloseAuction(product.id)}>Close Auction</Button>
                                                </TableCell>
                                            </TableRow>
                                            </>
                                        ))
                                    }
                                </TableBody>
                                {errorCode !== 0 && <BackErrors errorCode={errorCode} horizontal={"center"}/>}
                            </Table>
                        </TableContainer>
                }
            </div>
        </div>


    );
}

export default MyProducts;