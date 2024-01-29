import './ApproverAccountsScreen.css'
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from 'react-router-dom';
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AddIcon from '@mui/icons-material/Add';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand, 
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarLink,
  MDBIcon,
  MDBCollapse,
  MDBTable, 
  MDBTableHead, 
  MDBTableBody,
} from 'mdb-react-ui-kit';


import React from 'react';
import CreateApprover from "./CreateApprover";

export default function CreateApproverAccountScreen() {
  const [requests,setRequests] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate()
  const [showNavSecond, setShowNavSecond] = useState(false);

  const getRequests = () =>{
    fetch('http://localhost:3001/getapproveraccount').then(response => response.json()).then(body=>{console.log(body);setRequests(body);});
  }
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
    getRequests();

  }, [isLoggedIn, navigate])

  function logout() {
    const cookies = new Cookies();
    cookies.remove("authToken");

    localStorage.removeItem("username");

    setIsLoggedIn(false)
  }

  return (
    <>
        <CreateApprover/>
    </>
  )
}