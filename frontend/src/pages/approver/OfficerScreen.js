import Cookies from "universal-cookie";
import React, { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddIcon from "@mui/icons-material/Add";
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

// const filterData = (query, data) => {
//   if (!query) {
//     return data;
//   } else {
//     let filtered = data.filter(item => {
//       Object.values(item).some(val =>
//         item[val].toLowerCase().includes(query))
//     })
//     return filtered;

//     //return data.filter((d) => d.toLowerCase().includes(query));
//   }
// };

export default function OfficerScreen() {
  const [applications, setApplications] = useState([]);
  const [advisers, setAdvisers] = useState([]);
  const [selectedAdviser, setSelectedAdviser] = useState("");
  const [selectedStep, setSelectedStep] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData());
  const navigate = useNavigate();
  const [showNavSecond, setShowNavSecond] = useState(false);
  const [descendingName, setDescendingName] = useState(true);
  const [descendingDate, setDescendingDate] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const email = localStorage.getItem('email');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const [remarks, setRemarks] = useState("");

  const handleremarks = (e) => {
    setRemarks(e.target.value);
  };

  const toggleView = () => setViewModal(!viewModal);

  const handleView = (account) => {
    setSelectedAccount(account);
    toggleView();
  };

  const rejectOfficerApplication = (uemail) => {
    fetch('http://localhost:3001/rejectofficerapplication',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email:email, uemail:uemail, remarks: remarks}),
    }).then((response) => response.json()).then((update) => {
      getApprovedByAdviserStudentForms();
    })
  };

  const approveOfficerApplication = (email)=> {
    fetch('http://localhost:3001/approveofficerapplication',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email:email, uemail:email, remarks: remarks}),
    }).then((response) => response.json()).then((update) => {
      getApprovedByAdviserStudentForms();
    })
  };

  const getApprovedByAdviserStudentForms = () => {
    fetch("http://localhost:3001/getapprovedbyadviserstudentforms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        setApplications(body);
      });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
    getApprovedByAdviserStudentForms();
    // getAdviserAccounts();
    fetch("http://localhost:3001/getadviseraccount")
      .then((response) => response.json())
      .then((body) => {
        console.log(body);
        setAdvisers(body);
      });
  }, [isLoggedIn, navigate]);

  function logout() {
    const cookies = new Cookies();
    cookies.remove("authToken");

    localStorage.removeItem("username");

    setIsLoggedIn(false);
  }

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  var filteredAccounts = applications.filter(
    (acc) =>
      acc.fname
        .concat(" ", acc.mname, " ", acc.lname)
        .toLowerCase()
        .includes(searchInput.toLowerCase()) || acc.studno.includes(searchInput)
  );

  const [selectedDate, setSelectedDate] = useState(null);
  const handlerDateFilter = (date) => {
    setSelectedDate(date);
  };

  filteredAccounts = filteredAccounts.filter((acc) => {
    if (!selectedDate) {
      return true;
    } else {
      const selectedDateDate = new Date(selectedDate);
      const dateCreatedDate = new Date(acc.openApplication[0].date_created);

      selectedDateDate.setHours(0, 0, 0, 0);
      dateCreatedDate.setHours(0, 0, 0, 0);

      return selectedDateDate.getTime() === dateCreatedDate.getTime();
    }
  });

  const handleAdviserChange = (adviser) => {
    setSelectedAdviser(adviser.target.value);
  };
  // const [filteredList, setFilteredList] = useState(data);

  const handleStepChange = (step) => {
    setSelectedAdviser(step.target.value);
  };
  const handleStatusChange = (status) => {
    setSelectedAdviser(status.target.value);
  };

  filteredAccounts = filteredAccounts.filter((acc) => {
    if (!selectedAdviser) {
      return true;
    } else {
      return acc.adviser === selectedAdviser;
    }
  });

  filteredAccounts = filteredAccounts.filter((acc) => {
    if (selectedStep === "") {
      return true;
    } else {
      return acc.progress === selectedStep;
    }
  });

  // filteredAccounts = filteredAccounts.filter((acc) => {
  //   if (selectedStatus === "") {
  //     return true;
  //   } else {
  //     return acc. === selectedAdviser;
  //   }
  // });

  function sortByDate() {
    let tempreq = filteredAccounts.slice();
    tempreq.sort(function (a, b) {
      var datea = new Date(a.openApplication[0].date_created); // ignore upper and lowercase
      var dateb = new Date(b.openApplication[0].date_created);

      var dateA = datea.getTime(); // ignore upper and lowercase
      var dateB = dateb.getTime();
      // ignore upper and lowercase
      if (descendingDate) {
        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }

        // names must be equal
        return 0;
      } else {
        if (dateA > dateB) {
          return -1;
        }
        if (dateA < dateB) {
          return 1;
        }

        // names must be equal
        return 0;
      }
    });
    setApplications(tempreq);
    setDescendingDate(!descendingDate);
  }

  function sortByName() {
    let tempreq = filteredAccounts.slice();
    tempreq.sort(function (a, b) {
      var nameA = a.fname.toUpperCase(); // ignore upper and lowercase
      var nameB = b.fname.toUpperCase(); // ignore upper and lowercase
      if (descendingName) {
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
    });
    setApplications(tempreq);
    setDescendingName(!descendingName);
  }

  return (
    <>
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
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
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
                Student Applications
              </MDBNavbarLink>
              <MDBNavbarLink onClick={logout}>Logout</MDBNavbarLink>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <div
        style={{
          display: "flex",
          alignSelf: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: 50,
        }}
      >
        <form>
          <div className="filter-container">
            <input
              type="text"
              name="search"
              placeholder="Search"
              value={searchInput}
              onChange={handleChange}
            />
            <IconButton type="submit" aria-label="search">
              <SearchIcon style={{ fill: "blue" }} />
            </IconButton>

            {/* <select onChange={handlerDateFilter}>
              <option value="" disabled default selected>
                Select date
              </option>

              {/* {dates.map(date => {

          return <option key={date}>{date}</option>
        })} *
            </select> */}
            <DatePicker
              selected={selectedDate}
              onChange={handlerDateFilter}
              placeholderText="Select date"
              dateFormat="MM/dd/yyyy"
            />
            <select onChange={handleAdviserChange}>
              <option value="" selected>
                Select adviser
              </option>
              {advisers.map((adviser) => {
                return (
                  <option key={adviser.email} value={adviser.email}>
                    {`${adviser.fname} ${adviser.lname}`}
                  </option>
                );
              })}
            </select>
            <select onChange={handleStepChange}>
              <option value="" selected>
                Select step
              </option>
                  <option value = "1">1</option>
                  <option value = "2">2</option>
                  <option value = "3">3</option>
            </select>
            <select onChange={handleStatusChange}>
              <option value="" selected>
                Select status
              </option>
                  <option value="Open">Open</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                  <option value="Cleared">Cleared</option>
            </select>


            <Button onClick={sortByName}>
              Sort by Name
              <SwapVertIcon />
            </Button>
            <Button onClick={sortByDate}>
              Sort by Date
              <SwapVertIcon />
            </Button>
            

          </div>
        </form>
        <div style={{ padding: 3 }}>
          {filteredAccounts.map((d, index) => (
            <div>
              <br></br>
              <Card sx={{ maxWidth: 500 }}>
                <CardContent>
                  <Typography gutterBottom variant="h4" component="div">
                    {d.fname} {d.mname} {d.lname}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div">
                    {d.studno}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    Adviser : {d.adviser}
                  </Typography>
                  <Typography gutterBottom variant="body2" component="div">
                    Submitted on: {d.openApplication[0].date_created}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => handleView(d)}
                    size="small"
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
              <MDBModal show={viewModal && selectedAccount === d} backdrop={false} keyboard={false} tabIndex="-1" >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>View Application Details</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleView}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody><h2>Student details: </h2>Name : {d.fname} {d.mname} {d.lname} <br></br> Email: {d.email} <br></br> Student Number: {d.studno} <br></br>
            <br></br><h2>Application Details:</h2> Purpose: {d.openApplication[0].purpose} <br></br> Github Link: {d.openApplication[0].githublink} <br></br> 
            Past Remarks:
            {
              d.openApplication[0].remarks.map((remark)=>{
                return <div>-- {remark}</div>
              })
            }
            Remarks: 
             <br></br><textarea value={remarks} onChange={handleremarks} /></MDBModalBody>
            <MDBModalFooter>
              <button color='secondary' onClick={toggleView}>
                Cancel
              </button>
              <button color='secondary' onClick={()=>{
                rejectOfficerApplication(d.email)
                toggleView()
              }}>
                Reject
              </button>
              <button onClick={()=>{
                approveOfficerApplication(d.email)
                toggleView()
              }}>Approve</button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
            </div>
          ))}
        </div>

        <br></br>
      </div>
    </>
  );
}
