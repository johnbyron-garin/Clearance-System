import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from 'react-router-dom';

import StudentHomeScreen from "./StudentHomeScreen";

import StudentScreen from "./StudentScreen";
import StudentAccountsScreen from "./admin/StudentAccountsScreen";
import AdviserScreen from "./approver/AdviserScreen";
import OfficerScreen from "./approver/OfficerScreen";
export default function Dashboard() {
  const username = localStorage.getItem("username")
  const type = localStorage.getItem("type");
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
  const navigate = useNavigate()

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

  console.log(type);

      if(type=='admin'){
        return(
          <StudentAccountsScreen/>
        );
      }
      else if(type=='student'){
        return(
          <StudentHomeScreen/>
        );
      }
      else if(type=='approver-adviser'){
        return(
          <AdviserScreen/>
        );
      }
      else{
        return(
          <OfficerScreen/>
        );
      }
}