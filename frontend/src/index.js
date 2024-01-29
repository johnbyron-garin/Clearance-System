import React from 'react';
import ReactDOM from 'react-dom/client';
import { redirect } from 'react-router-dom';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';

import StudentHomeScreen from './pages/StudentHomeScreen';
import CreateNewApplication from './pages/CreateNewApplication';
import ViewAllApplications from './pages/ViewAllApplications';
import ApplicationDetails from './pages/ApplicationDetails';
import OfficerScreen from './pages/approver/OfficerScreen';
import StudentScreen from './pages/StudentScreen';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
//Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";
import 'font-awesome/css/font-awesome.min.css';
import AdminScreen from './pages/admin/ApproverAccountsScreen';
import ApproveAccountScreen from './pages/admin/StudentAccountsScreen';
import CreateApproverAccountScreen from './pages/admin/CreateApproverAccountScreen';
import StudentAccountsScreen from './pages/admin/StudentAccountsScreen';
// import StudentApplications from './pages/admin/StudentApplications';
import ApproverScreen from './pages/approver/AdviserScreen';

// Send a POST request to API to check if the user is logged in. Redirect the user to /dashboard if already logged in
const checkIfLoggedInOnHome = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin",
    {
      method: "POST",
      credentials: "include" 
    });

  const payload = await res.json();
  
    if (payload.isLoggedIn) {
      return redirect("/dashboard")
    } else {
      return 0
    }
}

// Send a POST request to API to check if the user is logged in. Redirect the user back to / if not logged in
const checkIfLoggedInOnDash = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin",
    {
      method: "POST",
      credentials: "include" 
    });


  const payload = await res.json();
    if (payload.isLoggedIn) {
      return true
    } else {
      return redirect("/")
    }
}

const router = createBrowserRouter([
  { path: '/', element: <Home />, loader: checkIfLoggedInOnHome },

  { path: '/adminscreen', element: <AdminScreen />, /**loader: checkIfLoggedInOnHome**/ },
  { path: '/studenthome',element: <StudentHomeScreen />},
  { path: '/student-create-new',element: <CreateNewApplication />},
  { path: '/student-view-all-applications',element: <ViewAllApplications />},
  { path: '/application/:date_created/:purpose/:githublink/:progress_detail', element: <ApplicationDetails />},

  { path: '/approver-accounts', element: <AdminScreen />, /**loader: checkIfLoggedInOnHome**/ },
  { path: '/student',element: <StudentScreen />},
  { path: '/student-accounts',element: <StudentAccountsScreen />},

  { path: '/dashboard', element: <Dashboard />, loader: checkIfLoggedInOnDash },
  { path: '/sign-up',element: <SignUp/>},
  { path: '/approverscreen',element: <ApproverScreen/>},
  { path: '/officerscreen',element: <OfficerScreen/>},
  { path: '/create-approver-account', element: <CreateApproverAccountScreen />}
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
