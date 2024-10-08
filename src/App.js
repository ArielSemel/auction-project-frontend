import * as React from 'react';
import './App.css';
import {BrowserRouter,Routes, Route} from "react-router-dom";
import Login from "./js/Login";
import SignUp from "./js/SignUp";
import Navbar from "./js/Navbar"
import Features from "./js/Features";
import {AddProduct} from "./js/AddProduct";
import MyProducts from "./js/MyProducts";
import ProductsForSale from "./js/ProductsForSale";
import ProductDetails from "./js/ProductDetails";
import ManagePage from "./js/manage/ManagePage";
import UserDetails from "./js/manage/UserDetails";
import MyBids from "./js/MyBids";


function App() {

    
  return (
    <div className="App">
      <BrowserRouter>
          <Navbar/>
          <Routes>
              <Route>
                  <Route path={"/"} element={<Login/>}/>
                  <Route path={"/login"} element={<Login/>}/>
                  <Route path={"logout"} element={<Login/>}/>
                  <Route path={"/signup"} element={<SignUp/>}/>
                  <Route path={"/features"} element={<Features/>}/>
                  <Route path={"/add-product"} element={<AddProduct />} />
                  <Route path={"/my-products"} element={<MyProducts />} />
                  <Route path={"/products-for-sale"} element={<ProductsForSale />} />
                  <Route path={"/product-details"} element={<ProductDetails />} />
                  <Route path={"/manage"} element={<ManagePage />} />
                  <Route path={"/user-details"} element={<UserDetails />} />
                  <Route path={"my-bids"} element={<MyBids />} />
              </Route>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
