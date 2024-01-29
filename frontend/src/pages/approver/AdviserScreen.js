import Cookies from "universal-cookie";
import React, { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import SwapVertIcon from "@mui/icons-material/SwapVert";
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


export default function ApproverScreen(){
  const [requests,setRequests] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
  const navigate = useNavigate()
  const [showNavSecond, setShowNavSecond] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const email = localStorage.getItem('email');
  // const dataFiltered = filterData(searchQuery, data);

  const [descendingName, setDescendingName] = useState(true);
  const [descendingDate, setDescendingDate] = useState(true);
  
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

  const getRequests = () =>{
    fetch('http://localhost:3001/getadviseeapplications',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email:email}),
    }).then((response) => response.json())
    .then((body) => {
      setRequests(body);
    });
  }

  const approveAdviseeApplication = (email)=> {
    fetch('http://localhost:3001/approveadviseeapplication',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email:email, uemail:email, remarks: remarks}),
    }).then((response) => response.json()).then((update) => {
      getRequests();
    })
  };

  const rejectAdviseeApplication = (uemail) => {
    fetch('http://localhost:3001/rejectadviseeapplication',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email:email, uemail:uemail, remarks: remarks}),
    }).then((response) => response.json()).then((update) => {
      getRequests();
    })
  };
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
    setRequests(tempreq);
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
    setRequests(tempreq);
    setDescendingName(!descendingName);
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
  
  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };
var filteredAccounts = requests.filter((acc) =>
    (acc.fname.concat(" ", acc.mname, " ",acc.lname)).toLowerCase().includes(searchInput.toLowerCase()) || acc.studno.includes(searchInput)
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
 
  return (
    
    <>
      
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
              src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp'
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
              Advisee Applications
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


    <DatePicker
              selected={selectedDate}
              onChange={handlerDateFilter}
              placeholderText="Select date"
              dateFormat="MM/dd/yyyy"
            />
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
        {filteredAccounts.map((d,index) => (
          
          <div>
             <br></br>
           <Card sx={{ maxWidth: 500 }}>

              <CardContent>
                <Typography gutterBottom variant="h4" component="div">
                  {d.fname} {d.mname}  {d.lname}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  {d.studno}
                </Typography>
                {/* <Typography gutterBottom variant="h6" component="div">
                  Adviser : {d.adviser} 
                </Typography> */}
                {/* <Typography gutterBottom variant="h6" component="div">
                  Step : {d.step}  / Current Status: {d.status} 
                </Typography> */}
                <Typography gutterBottom variant="body2" component="div">
                  Submitted on: {d.openApplication[0].date_created.substring(0,10)}
                </Typography>

              </CardContent>
              <CardActions>
                <Button onClick={() => handleView(d)}size="small">View</Button>
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
            Remarks: <textarea value={remarks} onChange={handleremarks} /></MDBModalBody>
            <MDBModalFooter>
              <button color='secondary' onClick={toggleView}>
                Cancel
              </button>
              <button color='secondary' onClick={()=>{
                rejectAdviseeApplication(d.email)
                toggleView()
              }}>
                Reject
              </button>
              <button onClick={()=>{
                approveAdviseeApplication(d.email)
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

  )

}