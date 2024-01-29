import './ApproverAccountsScreen.css'
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from 'react-router-dom';
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
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

export default function ApproverAccountScreen() {
  const [requests,setRequests] = useState([]);
  const[descending, setDescending] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate()
  const [showNavSecond, setShowNavSecond] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const getRequests = () =>{
    fetch('http://localhost:3001/getapproveraccount').then(response => response.json()).then(body=>{console.log(body);setRequests(body);});
  }

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };
// setRequests(tempreq);
const filteredAccounts = requests.filter((acc) =>
    (acc.fname.concat(" ", acc.mname, " ",acc.lname)).toLowerCase().includes(searchInput.toLowerCase())
  );
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

  function sortByName(){
    let tempreq=requests.slice();
    tempreq.sort(function(a,b){
      var nameA = a.fname.toUpperCase() + a.mname.toUpperCase() + a.lname.toUpperCase(); // ignore upper and lowercase
      var nameB = b.fname.toUpperCase() + b.mname.toUpperCase() + b.lname.toUpperCase(); // ignore upper and lowercase
      if(descending){
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
  
        // names must be equal
        return 0;
      } else {
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
  
        // names must be equal
        return 0;
      }
    })
    setRequests(tempreq);
    setDescending(!descending);
  }

  const deleteApproverAccount = (email) => {
    fetch("http://localhost:3001/deleteapproveraccounts", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then((del) => {
        if (del.success){
            getRequests(); //if deleted successfully, update approver accounts
            alert("Successfully delete account!");
        }else{
            console.log("Failed to delete subject: ", del.error);
        }
    })
    .catch((error) => {
        console.log("Error: ", error);
    })
}
  return (
    <>
      <div class="sticky-top">
        <MDBNavbar expand='lg' light bgColor='light'>
        <MDBContainer fluid>
        <MDBNavbarToggler
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowNavSecond(!showNavSecond)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
        <MDBNavbarBrand href='#'>
              <img
                src={require('./../assets/logo.png')}
                height='50'
                alt=''
                loading='lazy'
              />
            </MDBNavbarBrand>
          
          <MDBCollapse navbar show={showNavSecond}>
            <MDBNavbarNav>
            <Link to='/student-accounts'><MDBNavbarLink>
                Student Accounts
              </MDBNavbarLink></Link>
              <Link to = '/approver-accounts'><MDBNavbarLink active aria-current='page'>Approver Accounts</MDBNavbarLink></Link>
              <MDBNavbarLink onClick={logout}>Logout</MDBNavbarLink>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    </div>

    <div className='p-4 text-center'>
        <h2 className='mb-3' text-center>Approver Accounts</h2>
      </div>
      
    <div class="px-5">
      <div>
      
      </div>
      
      <div class="m-2 d-flex flex-row-reverse">
        <IconButton size = "small" aria-label="accept" onClick={sortByName}>
          <SwapVertIcon />Sort by Name
        </IconButton>
        <div class="d-flex align-items-center w-25 input-group rounded">
          <SearchIcon />
          <input type="search" class="form-control rounded"  onChange={handleChange}
          value={searchInput} placeholder="Search here" aria-label="Search" aria-describedby="search-addon"/>
        </div>
      </div>

    
    {
      filteredAccounts.map((account,index)=>{
        console.log(account.email);
        return(
          <div class="card">
          <div class="card-body">
            <h5 class="card-title">{account.fname} {account.mname} {account.lname} </h5>
            <h6 class="card-title">{
              (account.type =="approver-adviser") ? "Adviser" : "Approver"
            }</h6>
            <p class="card-text">{account.email}</p>
            <button type="button" class="btn btn-primary">Edit</button>
            <button type="button" class="btn btn-danger" onClick={() => deleteApproverAccount(account.email)}>Delete</button>
          </div>
        </div>
       );
       })
     }
  
  <Link to="/create-approver-account">
  <Box sx={{ position: 'fixed',
    bottom: 30,
    right: 30, }}>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
  </Box>
  </Link>
  </div>
  </>
  )
}