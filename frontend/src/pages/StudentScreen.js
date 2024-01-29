import './StudentScreen.css'
import React from 'react';

import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from 'react-router-dom';
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";


import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBNavbar,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarBrand,
  MDBCollapse,
  MDBNavbarLink,
  MDBNavbarNav
}
from 'mdb-react-ui-kit';


export default function StudentScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
  const navigate = useNavigate()
  const [showNavSecond, setShowNavSecond] = useState(false);


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
        <header>
          <div id="notification-bar">
            <h1>Student</h1>
            <div id="status">
              <p>Status:</p>
              <p>Approved by the adviser</p>
              <p>Approved by the clearance officer</p>
            </div>
          </div>
        </header>
      </div>

      <div id="progress-bar-container">
        <progress id="progbar" value="10" max="100"></progress>
        <h4>10% complete</h4>
      </div>
      
      <div id="formfield-preview-container">
        <div id="text-formfield-container">
          <h3>Student Application Form</h3>
          <form id="text-formfield" name="studform" >
            Date created: <input type="date" id="datecreated"/> <br /> <br />
            Student name: <input id="studentname" placeholder="Fname MI Lname"/> <br /> <br />
            Student number: <input id="studentnumber" placeholder="20**-*****"/> <br /> <br />
            Adviser name: <input id="advisername" placeholder="Fname MI Lname"/> <br /> <br />
            Officer name: <input id="officername" placeholder="Fname MI Lname"/> <br /> <br />
          </form>
          
          <div id="button-formfield-container">
            <button id="buttons" onClick={
              function validateForm() {
                let date = document.getElementById("datecreated").value;
                let studentname = document.getElementById("studentname").value;
                let studno = document.getElementById("studentnumber").value;
                let advisername = document.getElementById("advisername").value;
                let officername = document.getElementById("officername").value;

                if (studentname == "" || studno == "" || advisername == "" || officername == "") {
                  alert("Please fill out all the fields");
                } else {
                  alert("Application form has now been submitted to the corresponding approver");
                  document.getElementById("document-date").innerHTML = date
                  document.getElementById("document-studname-studno").innerHTML = "This document certifies that " + studentname + ", " + studno + " has satisfied the clearance requirements of the institute."
                  document.getElementById("document-adviser").innerHTML = "Academic Adviser: " + advisername
                  document.getElementById("document-officer").innerHTML = "Academic Adviser: " + officername
                }
              }
            }>Submit</button>
            <button id="buttons">Create New</button>
            <button id="buttons">Close</button>
          </div>
        </div>

        <div id="document-preview-container">
          <div id="document-header">
            <h3>University of the Philippines Los Baños</h3>
            <h5>College of Arts and Sciences</h5>
            <h5>Institute of Computer Science</h5>
          </div>
          <hr></hr>
          <br></br>
          <br></br>

          <div id="document-body">
            <div>
              <h5 id="document-date">&lt;Date Generated&gt;</h5>
            </div>
            
            <br></br>

            <div>
              <p id="document-studname-studno">This document certifies that &lt;name of student&gt;, &lt;student-number&gt; has satisfied the clearance requirements of the institute.</p>
            </div>
  
            <br></br>
            <br></br>

            <h6>Verified:</h6>

            <br></br>

            <div>
              <p id="document-adviser">Academic Adviser: &lt;Name of the Academic Adviser&gt; </p>
              <p id="document-officer">Clearance Officer: &lt;Name of the Clearance Officer&gt; </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}