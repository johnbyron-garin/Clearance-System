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
import ApplicationDetails from './ApplicationDetails';

export default function CreateNewApplication() {
    let studno = localStorage.getItem("studno");

    const [applications, setApplications] = useState([]);
    const [currentApp,setCurrentApp] = useState({});


    const progress = [
        "pending adviser approval",
        "pending officer approval",
        "completed",
    ]
    // const db = [
    // { date_created: "June 4, 2023", purpose: "SP", githublink: "github.com", progress: progress[0], currentlyOpen: false, id: 0},
    // { date_created: "July 4, 2023", purpose: "Thesis", githublink: "github.com", progress: progress[1], currentlyOpen: false, id: 1},
    // { date_created: "August 4, 2023", purpose: "Project", githublink: "github.com", progress: progress[2], currentlyOpen: false, id: 2},
    // ];

    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const navigate = useNavigate()
    const [showNavSecond, setShowNavSecond] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
        navigate("/")
        }
        fetch('http://localhost:3001/get-applications',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({studno: studno})
            }
        )
        .then(response=>response.json())
        .then(body => {
            console.log(body)
            setApplications(body.application)
        })
        getCurrentApplication()
        
    }, [isLoggedIn, navigate])

    function logout() {
        const cookies = new Cookies();
        cookies.remove("authToken");

        localStorage.removeItem("username");

        setIsLoggedIn(false)
    }
    function getCurrentApplication(){
        fetch('http://localhost:3001/getcurrentApplication',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({studno: studno})
            }
        )
        .then(response=>response.json())
        .then(body => {
            console.log(body)
            setCurrentApp(body)
        })
    }
function openApplication(id){
    console.log(id);
    fetch('http://localhost:3001/openApplication',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({studno: studno, id: id})
            }
        )
        .then(response=>response.json())
        .then(body => {
            console.log(body)
        getCurrentApplication()
        })
    navigate("/");
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
                    <MDBNavbarLink active aria-current='page' onClick={()=>navigate("/")}>
                        Student
                    </MDBNavbarLink>
                    <MDBNavbarLink onClick={logout}>Logout</MDBNavbarLink>
                    </MDBNavbarNav>
                </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding:"10px" }}>
                <h2>All Application Forms</h2>
                {
                    applications.map((data) => {
                    return (
                        <div className="card" style={{ width: "600px", margin: "10px" }}>
                            <div className="navigation" style={{ padding: "10px", textAlign: "center" }}>
                                <div>
                                    <p style={{ fontWeight: "bold" }}>Date:</p>
                                    <p id="date_created">{String(data.date_created)}</p>
                                    <p style={{ fontWeight: "bold" }}>Purpose:</p>
                                    <p id="purpose">{data.purpose}</p>
                                    <p style={{ fontWeight: "bold" }}>Progress:</p>
                                    <p id="progress">{data.progress}</p>
                                </div>
                            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                <button className="btn btn-primary w-100 mb-4" style={{ textDecoration: "none", color: "white" }}>
                                <Link
                                    to={`/application/${String(data.date_created)}/${data.purpose}/${data.githublink}/${data.progress}`}
                                    style={{ textDecoration: "none", color: "white" }}
                                >
                                    View Details
                                </Link>
                                </button>
                                {Object.keys(currentApp).length === 0 ? (
                                <button className="btn btn-primary w-100 mb-4" onClick={() => openApplication(data._id)}>Open</button>
                                ) : (
                                <></>
                                )}
                          </div>
                        </div>
                      </div>
                      
                    );
                    })
                }
                <div style={{ width: "600px", margin: "10px" }}>
                    <button id="back-button" className="btn btn-danger w-100 mb-4" style={{ textDecoration: "none", color: "white" }} onClick={()=>navigate("/")}>
                    Back
                    </button>
                </div>
            </div>
        </div>
    )
}