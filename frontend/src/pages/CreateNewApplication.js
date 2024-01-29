import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from 'react-router-dom';
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";

import {
  MDBContainer,
  MDBCol,
  MDBInput,
  MDBNavbar,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarBrand,
  MDBCollapse,
  MDBNavbarLink,
  MDBNavbarNav,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
}
from 'mdb-react-ui-kit';

export default function CreateNewApplication() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const navigate = useNavigate()
  const [showNavSecond, setShowNavSecond] = useState(false);
  const [applicationAdd, addApplication] = useState({});
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const studno = localStorage.getItem("studno");
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  function logout() {
    const cookies = new Cookies();
    cookies.remove("authToken");

    localStorage.removeItem("username");

    setIsLoggedIn(false)
  }

  function toggleWarning() {
    setIsWarningOpen(!isWarningOpen);
  }

  function handleClose() {
    toggleWarning();
  }

  function toggleConfirmation() {
    setIsConfirmationOpen(!isConfirmationOpen);
  }

  function handleConfirm() {
    toggleConfirmation();
  }
  
  return (
    <div class="root">
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
              src={require('./assets/logo.png')}
              height='50'
              alt=''
              loading='lazy'
            />
          </MDBNavbarBrand>
        
        <MDBCollapse navbar show={showNavSecond}>
            <MDBNavbarNav>
              {/* <MDBNavbarLink  href='#'>
                  Home
              </MDBNavbarLink> */}
              <MDBNavbarLink active aria-current='page' href='#'>
                Student
              </MDBNavbarLink>
              <MDBNavbarLink onClick={logout}>Logout</MDBNavbarLink>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <div>
        
        <div class="d-flex align-items-center mb-3 -md-8 col-lg-6 col-xl-4 offset-xl-4">
          <MDBContainer className="my-5 form">
            <MDBCol col='7'>
            <h2 className='mb-3' text-center>Student Application Form</h2>
              <form id="text-formfield" name="studform" >
                <MDBInput
                  type="date"
                  id='datecreated'
                  required
                  label='Date created'
                />
                <MDBInput
                  id='purpose'
                  required
                  label='Purpose'
                />
                <MDBInput
                  id='githublink'
                  required
                  label='Github Link'
                />
                {/* Date created: <input type="date" id="datecreated"/> <br /> <br /> */}
                {/* Purpose: <input id="purpose"/> <br /> <br /> */}
                {/* Github Link: <input id="githublink"/> <br /> <br /> */}
              </form>

              <div id="button-formfield-container">
                <button class="btn btn-primary w-100 mb-4" id="buttons" onClick={
                  function validateForm() {
                    let date_created = document.getElementById("datecreated").value;
                    let purpose = document.getElementById("purpose").value;
                    let githublink = document.getElementById("githublink").value;

                    if (purpose == "" || githublink == "") {
                      toggleWarning()
                    } else {
                      toggleConfirmation()
                      // save sa database
                      fetch('http://localhost:3001/add-application',
                          {
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/json'
                              },

                              body: JSON.stringify({date_created: date_created, purpose: purpose, githublink: githublink, studno: studno}) // adding parameters to pass on for the subject details
                          }
                      )
                      .then(response=>response.text())
                      .then(body => {
                        addApplication(body)
                      })
                      // upon verifying that the inputs were valid the program will reset the formfields and will show a successful alert message
                      document.getElementById("text-formfield").reset();
                    }
                  }
                }>Submit</button>
                <button className="btn btn-danger w-100 mb-4"><Link to={`/studenthome`} style={{ textDecoration: 'none', color: 'white' }}>Close</Link></button>
              </div>
            </MDBCol>
          </MDBContainer>
        </div>
      </div>

      {isWarningOpen && (
        <MDBModal tabIndex="-1" show={isWarningOpen} onHide={toggleWarning}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                Warning
              </MDBModalHeader>
              <MDBModalBody>
                Please fill out all fields
              </MDBModalBody>
              <MDBModalFooter>
              <button className="btn btn-primary w-100 mb-4" onClick={handleClose}>
                Close
              </button>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}

      {isConfirmationOpen && (
        <MDBModal tabIndex="-1" show={isConfirmationOpen} onHide={toggleConfirmation}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                Successful
              </MDBModalHeader>
              <MDBModalBody>
                Application successfully submitted
              </MDBModalBody>
              <MDBModalFooter>
              <button className="btn btn-primary w-100 mb-4" onClick={handleConfirm}>
                Confirm
              </button>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}

    </div>
  )
}