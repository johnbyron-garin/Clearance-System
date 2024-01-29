import './StudentAccountScreen.css'
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from 'react-router-dom';
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ButtonGroup from '@mui/material/ButtonGroup';

import {
  MDBBtn,
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
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';


import React from 'react';

export default function StudentAccountsScreen() {
  const [requests,setRequests] = useState([]);
  const [advisers,setAdvisers] = useState([]);
  const[descending, setDescending] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate()
  const [showNavSecond, setShowNavSecond] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const anchorRef = React.useRef(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = handleFileRead;
      reader.readAsText(selectedFile);
    }
  };

  const handleFileRead = (event) => {
    const content = event.target.result;
    const lines = content.split('\n');

    // Iterate over each line of the CSV file
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const [studentNumber, adviser] = line.split(',');
        updateStudentAdviser(studentNumber, adviser);
      }
    }
  };

  const updateStudentAdviser = (studentNumber, adviser) => {
    fetch('http://localhost:3001/mapstudenttoadviser', {
      method: "POST",

      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({studno: studentNumber, adviser: adviser})
    }).then(response => response.json()).then().catch((error) => {
      console.log("Error: ", error);
    })
    console.log(`Mapping Student: ${studentNumber} to Adviser: ${adviser}`);
  };

  const toggleReject = () => setRejectModal(!rejectModal);
  const toggleApprove = () => setApproveModal(!approveModal);

  const handleApprove = (account) => {
    setSelectedAccount(account);
    toggleApprove();
  };

  const handleReject = (account) => {
    setSelectedAccount(account);
    toggleReject();
  };

  
  const handleDropdownSelect = (event, index) => {
    const value = event.target.value;
    setSelectedValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = value;
      
    console.log(updatedValues);
      return updatedValues;
    });

  };
  const getRequests = () =>{
    fetch('http://localhost:3001/getaccountrequest').then(response => response.json()).then(body=>{console.log(body);setRequests(body);});
  }

  const approveAccount = (studno, status, adviser) => {
    console.log(studno, status);
    fetch('http://localhost:3001/approveaccount', {
      method: "POST",

      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({studno: studno, status: status, adviser: adviser})
    }).then(response => response.json()).then((update)=>{
      
    }).catch((error) => {
      console.log("Error: ", error);
    })
    }
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
    getRequests();
    fetch('http://localhost:3001/getadviseraccount').then(response => response.json()).then(body=>{console.log(body);setAdvisers(body);});


  }, [isLoggedIn, navigate])

  function logout() {
    const cookies = new Cookies();
    cookies.remove("authToken");

    localStorage.removeItem("username");

    setIsLoggedIn(false)
  }

  function sortByStudNum(){
    let tempreq=requests.slice();
    tempreq.sort(function(a,b){
      var nameA = a.studno.toUpperCase(); // ignore upper and lowercase
      var nameB = b.studno.toUpperCase(); // ignore upper and lowercase
      
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

  function sortByName(){
    let tempreq=requests.slice();
    tempreq.sort(function(a,b){
      var nameA = a.fname.toUpperCase(); // ignore upper and lowercase
      var nameB = b.fname.toUpperCase(); // ignore upper and lowercase
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
          <Link to='/student-accounts'><MDBNavbarLink active aria-current='page'>
              Student Accounts
            </MDBNavbarLink></Link>
            <Link to = '/approver-accounts'><MDBNavbarLink >Approver Accounts</MDBNavbarLink></Link>
            <MDBNavbarLink onClick={logout}>Logout</MDBNavbarLink>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  </div>

    <div className='p-5 text-center'>
        <h2 className='mb-3' text-center>Student Accounts</h2>
      </div>
      
    <div class="px-5">
    

    
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th scope='col'>
            Student Number
            <IconButton aria-label="accept" onClick={sortByStudNum}>
              <SwapVertIcon />
            </IconButton>
            </th>
          <th scope='col'>First Name
          <IconButton aria-label="accept" onClick={sortByName}>
              <SwapVertIcon />
            </IconButton>
            </th>
          <th scope='col'>Last Name</th>
          <th scope='col'>Email</th>
          <th scope='col'>Adviser</th>
          <th scope='col' class='action'>Actions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {
          requests.map((account,index)=>{
            return(
              <tr key={index}>
                <th scope='row'>{account.studno}</th>
                <td>{account.fname}</td>
                <td>{account.lname}</td>
                <td>{account.email}</td>
                <td><div className="my-select-container">
      <div className="my-select">
        <select
          className="my-select-dropdown"
          value={selectedValues[index] || ""}
          onChange={(event) => handleDropdownSelect(event, index)}
        >
          <option value="">Select Adviser</option>
          {
            advisers.map((adviser) => {
              return (
                <option value={adviser.email}>{adviser.fname} {adviser.mname} {adviser.lname}</option>
              )
            })
          }
        </select>
        <div className="my-select-arrow">&#9662;</div>
      </div>
    </div></td>
                <td class="action">
                  <IconButton aria-label="accept" onClick={() => handleApprove(account)}>
                    <CheckIcon />
                  </IconButton>
                  <MDBModal show={approveModal && selectedAccount === account} backdrop={false} keyboard={false} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Approve Account</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleApprove}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>Are you sure? <br></br> Student details: <br></br>Name : {account.fname} {account.mname} {account.lname} <br></br> Email: {account.email} <br></br> Student Number: {account.studno} <br></br> Adviser: {selectedValues[index]}</MDBModalBody>
            <MDBModalFooter>
              <button color='secondary' onClick={toggleApprove}>
                Cancel
              </button>
              <button onClick={()=>{
                approveAccount(account.studno, true, selectedValues[index])
                toggleApprove()
              }}>Approve</button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
                  <IconButton aria-label="reject" onClick={() => handleReject(account)}>
                    <ClearIcon />
                  </IconButton>
                  <MDBModal show={rejectModal && selectedAccount === account} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Reject Account</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleReject}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>Are you sure?</MDBModalBody>

            <MDBModalFooter>
              <button color='secondary' onClick={toggleReject}>
                Cancel
              </button>
              <button onClick={()=>{
                approveAccount(account.studno, false)
                toggleReject()
              }}>Reject</button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
                </td>
              </tr>
            );
          })
        }
      </MDBTableBody>
    </MDBTable>
    
    <div class="d-flex align-items-center flex-column"> 
    <div>— OR —</div>
    <div>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <Button
          size="small"
          variant='contained'
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleUpload}
        >
          <UploadFileIcon />UPLOAD FILE
        </Button>
      </div>
    </div>
    </div>
    </>
  )
}