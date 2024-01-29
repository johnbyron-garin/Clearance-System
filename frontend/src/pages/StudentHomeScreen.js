import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
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
  MDBNavbarNav,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBModalDialog,
  MDBModalContent,
} from "mdb-react-ui-kit";
import ApplicationDetails from "./ApplicationDetails";

export default function StudentHomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentApp, setCurrentApp] = useState({});
  const navigate = useNavigate();
  const [showNavSecond, setShowNavSecond] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  var studno = localStorage.getItem("studno");

  const [remarks, setRemarks] = useState("");

  const handleremarks = (e) => {
    setRemarks(e.target.value);
  };

  function getCurrentApp() {
    fetch("http://localhost:3001/getcurrentApplication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studno: studno }),
    })
      .then((response) => response.json())
      .then((body) => {
        setCurrentApp(body);
      });
  }
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
    getCurrentApp();
  }, [isLoggedIn, navigate]);

  function logout() {
    const cookies = new Cookies();
    cookies.remove("authToken");

    localStorage.removeItem("username");

    setIsLoggedIn(false);
  }

  function resubmitApplication(){
    fetch("http://localhost:3001/resubmitapplication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studno: studno , remarks:remarks}),
    }).then((response) => response.json())
    .then((body) => {
      getCurrentApp(body);
    });
  }

  function closeApplication() {
    fetch("http://localhost:3001/closeApplication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studno: studno }),
    })
      .then((response) => response.json())
      .then((update)=>{
      
        getCurrentApp();
      });
  }
  function toggleConfirmation() {
    setIsConfirmationOpen(!isConfirmationOpen);
  }

  function handleYes() {
    closeApplication();
    toggleConfirmation();
  }

  function handleNo() {
    toggleConfirmation();
  }

  return (
    <div class="root">
      <MDBNavbar expand="lg" light bgColor="light">
        <MDBContainer fluid>
          <MDBNavbarToggler
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShowNavSecond(!showNavSecond)}
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>
          <MDBNavbarBrand href="#">
            <img
              src={require('./assets/logo.png')}
              height="50"
              alt=""
              loading="lazy"
            />
          </MDBNavbarBrand>

          <MDBCollapse navbar show={showNavSecond}>
            <MDBNavbarNav>
              {/* <MDBNavbarLink  href='#'>
                  Home
              </MDBNavbarLink> */}
              <MDBNavbarLink active aria-current="page" href="#">
                Student
              </MDBNavbarLink>
              <MDBNavbarLink onClick={logout}>Logout</MDBNavbarLink>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <div
        class="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div
          id="whole"
          class="d-flex flex-column justify-content-center align-items-center"
        >
          <div id="create-new-button">
            <button class="btn btn-primary w-100 mb-4">
              <Link
                to={`/student-create-new`}
                style={{ textDecoration: "none", color: "white" }}
              >
                Create New Application
              </Link>
            </button>
            <br></br>
          </div>

          <div id="view-all-button" style={{ marginTop: "10px" }}>
            <button class="btn btn-primary w-100 mb-4">
              <Link
                to={`/student-view-all-applications`}
                style={{ textDecoration: "none", color: "white" }}
              >
                View all applications
              </Link>
            </button>
          </div>
          {Object.keys(currentApp).length == 0 ? (
            <div>There is no open application</div>
          ) : (
            <div id="current-application" style={{ width: 'fit-content' }}>
              <div className="card" style={{ padding: '20px' }}>
                <h1>Current Application</h1>
                <div className="navigation">
                  <div>
                    <p style={{ fontWeight: "bold" }}>Date:</p>
                    <p id="date_created">{String(currentApp.date_created)}</p>
                    <p style={{ fontWeight: "bold" }}>Purpose:</p>
                    <p id="purpose">{currentApp.purpose}</p>
                    <p style={{ fontWeight: "bold" }}>Github Link:</p>
                    <p id="progress">{currentApp.githublink}</p>
                    <p style={{ fontWeight: "bold" }}>Progress:</p>
                    <p id="progress">{
                      (currentApp.progress=="Completed") ? "Completed" : ((currentApp.progress=="4") ? "Pending approval by Adviser" : "Pending approval by Officer")
                    }</p>
                  <p>Remarks: </p>
                  {currentApp.remarks.map((remark) => {
                    return <p>-- {remark}</p>
                  })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      id="close-button"
                      className="btn btn-danger w-100 mb-4"
                      onClick={toggleConfirmation}
                    >
                      Close
                    </button>
                  </div>
                {(currentApp.returned)?
                    <>
                  <button
                    class="btn btn-primary w-100 mb-4"
                    onClick={()=>{
                      resubmitApplication();
                    }}
                  >
                    Resubmit
                  </button>
                  </>
                : <></>
                }
                {
                (currentApp.progress=="5" && currentApp.returned) ? <div> Submit Remarks: 
                <br></br><textarea value={remarks} onChange={handleremarks} /> </div> : <></>
              }
                </div>
              
              </div>
            </div>
          )}
        </div>
      </div>
      {isConfirmationOpen && (
        <MDBModal
          tabIndex="-1"
          show={isConfirmationOpen}
          onHide={toggleConfirmation}
        >
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>Confirm Close</MDBModalHeader>
              <MDBModalBody>
                Are you sure you want to close this application?
              </MDBModalBody>
              <MDBModalFooter>
                <button
                  className="btn btn-primary w-100 mb-4"
                  onClick={handleYes}
                >
                  Yes
                </button>
                <button
                  className="btn btn-danger w-100 mb-4"
                  onClick={handleNo}
                >
                  No
                </button>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}
    </div>
  );
}
