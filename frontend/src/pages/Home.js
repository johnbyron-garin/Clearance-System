import '../index.css'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import React from 'react';
import Cookies from 'universal-cookie';

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
}
  from 'mdb-react-ui-kit';

export default function Home() {

  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNoUserOpen, setIsNoUserOpen] = useState(false);
  const [isNotApprovedOpen, setIsNotApprovedOpen] = useState(false);
  const [isWrongPasswordOpen, setIsWrongPasswordOpen] = useState(false);
  const [isBlankOpen, setIsBlankOpen] = useState(false);

  // redirect when login is successful
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard")
    }
  }, [isLoggedIn, navigate])


  function logIn(e) {
    e.preventDefault();

    // form validation goes here

    fetch("http://localhost:3001/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: document.getElementById("l-email").value,
          password: document.getElementById("l-password").value
        })
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          console.log(body);
          setIsLoggedIn(true)
          // successful log in. store the token as a cookie
          const cookies = new Cookies()
          cookies.set(
            "authToken",
            body.token,
            {
              path: "localhost:3001/",
              age: 60 * 60,
              sameSite: false
            });

          localStorage.setItem("username", body.username);
          localStorage.setItem("type", body.type);
          localStorage.setItem("lname", body.lname);
          localStorage.setItem("fname", body.fname);
          localStorage.setItem("mname", body.mname);
          localStorage.setItem("studno", body.studno);
          localStorage.setItem("email", body.email);
        } else if (document.getElementById("l-email").value == "" || document.getElementById("l-password").value == "") {
          toggleBlank();
        } else if (body.message == "no user") { 
          toggleNoUser();
        } else if (body.message == "not approved") { 
          toggleNotApproved();
        } else if (body.message == "wrong password") { 
          toggleWrongPassword();
        }
      })
  }

  function toggleNoUser() {
    setIsNoUserOpen(!isNoUserOpen);
  }

  function handleNoUser() {
    toggleNoUser();
  }

  //============================

  function toggleNotApproved() {
    setIsNotApprovedOpen(!isNotApprovedOpen);
  }

  function handleNotApproved() {
    toggleNotApproved();
  }

  //============================

  function toggleWrongPassword() {
    setIsWrongPasswordOpen(!isWrongPasswordOpen);
  }

  function handleWrongPassword() {
    toggleWrongPassword();
  }

  //============================

  function toggleBlank() {
    setIsBlankOpen(!isBlankOpen);
  }

  function handleBlank() {
    toggleBlank();
  }

  return (
    
    <MDBContainer className="my-5 py-5 gradient-form ">

      <MDBRow>

        <MDBCol col='6' className="mb-5">
        <div class="py-4 px-8 bg-white shadow-lg rounded-lg mt-20 mb-4">
            <div className="d-flex flex-column ms-5">

              <div class="image-container">
              <img src={require('./assets/logo.png')}
                  style={{ width: '300px' , alignSelf: 'center' }} alt="logo" class="object-center" />
               
              </div>
              <div class="mt-5">
                <h2 class="text-gray-800 text-3xl font-semibold text-center">Welcome to the Group 4 CMSC 100 Project: Clearance System</h2>
                <p class="mt-5 text-gray-600 text-center">This app is currently in alpha phase</p>  
              </div>
              <p class="mt-5 text-gray-600 text-center">Please login to your account</p>
              
              <MDBInput wrapperClass='mb-4' label='Email address' id='l-email' type='email' />
              <MDBInput wrapperClass='mb-4' label='Password' id='l-password' type='password' />


              <div className="text-center pt-1 pb-4">
                <button className="btn btn-primary w-100 " onClick={logIn}>Sign in</button>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                <p className="mb-0">Don't have an account?</p>
                <Link to='/sign-up'>
                  <a outline className='mx-2' color='danger'>
                    Sign up
                  </a></Link>
              </div>
            
            </div>
          </div>
          <div class="py-2 px-2 text-gray-500 text-center">

            <div class="row">
              <div class="column">
                <div class="card">
                  <a href="https://github.com/mgccarandang"><b>Monina Gazelle Charina Carandang</b></a>
                  <p>Lecture Professor</p>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <a href="https://github.com/claizelcoubeili"><b>Claizel Coubeili Cepe</b></a>
                  <p>Lab Professor</p>
                </div>
              </div>
            </div>
              <br />
              <br />
              <dir class="row">
              <div class="column">
                <div class="card">
                  <a href="https://github.com/uzzieljosh"><b>Uzziel Josh Abiday</b></a>
                  <p>Group Member</p>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <a href="https://github.com/deckzie"><b>Ma Deckzie Culaniba</b></a>
                  <p>Group Member</p>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <a href="https://github.com/jb-garin"><b>John Byron Garin</b></a>
                  <p>Group Member</p>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <a href="https://github.com/frankstef"><b>Frank Stephen Maddela</b></a>
                  <p>Group Member</p>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <a href="https://github.com/KMercad0"><b>Karl Mercado</b></a>
                  <p>Group Member</p>
                </div>
              </div>

                </dir>
            </div>
        </MDBCol>

      </MDBRow>

      {isNoUserOpen && (
        <MDBModal tabIndex="-1" show={isNoUserOpen} onHide={toggleNoUser}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                Warning
              </MDBModalHeader>
              <MDBModalBody>
                User is non-existent
              </MDBModalBody>
              <MDBModalFooter>
              <button className="btn btn-primary w-100 mb-4" onClick={handleNoUser}>
                Close
              </button>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}

      {/* ===================== */}

      {isNotApprovedOpen && (
        <MDBModal tabIndex="-1" show={isNotApprovedOpen} onHide={toggleNotApproved}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                Warning
              </MDBModalHeader>
              <MDBModalBody>
                Account not yet approved
                Come back later
              </MDBModalBody>
              <MDBModalFooter>
              <button className="btn btn-primary w-100 mb-4" onClick={handleNotApproved}>
                Close
              </button>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}

      {/* ===================== */}

      {isWrongPasswordOpen && (
        <MDBModal tabIndex="-1" show={isWrongPasswordOpen} onHide={toggleWrongPassword}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                Warning
              </MDBModalHeader>
              <MDBModalBody>
                Wrong Password
              </MDBModalBody>
              <MDBModalFooter>
              <button className="btn btn-primary w-100 mb-4" onClick={handleWrongPassword}>
                Close
              </button>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}

      {/* ===================== */}

      {isBlankOpen && (
        <MDBModal tabIndex="-1" show={isBlankOpen} onHide={toggleBlank}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                Warning
              </MDBModalHeader>
              <MDBModalBody>
                Fill out all fields
              </MDBModalBody>
              <MDBModalFooter>
              <button className="btn btn-primary w-100 mb-4" onClick={handleBlank}>
                Close
              </button>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}

    </MDBContainer>
  )
}