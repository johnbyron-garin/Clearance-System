
import { openApplication, closeApplication, getCurrentApplication, signUp, login, checkIfLoggedIn, searchStudentByName, searchStudentByStudentNo, createApprover, deleteApproverByEmail, editApproverByEmail, searchAdviserByName, searchOfficerByName, addApplication, getApplications  } from "./auth-controller.js";
import {getApprovedByAdviserStudentForms} from "./approver-control.js";import {approveAdviseeApplication,resubmitApplication, getAdviseeApplications, rejectAdviseeApplication, approveOfficerApplication, rejectOfficerApplication } from "./approver-control.js";


import {mapStudenttoAdviser, getApproverAccounts, getAccountRequest, approveAccount, deleteApproverAccounts } from "./admin-controller.js";
import {getAdviserAccount} from "./admin-approver-controller.js"


const setUpRoutes = (app) => {
  app.get("/", (req, res) => { res.send("API Home") });
  app.post("/signup", signUp);
  app.post("/login", login);
  app.post("/checkifloggedin", checkIfLoggedIn);

  app.get("/searchstudentbystudentno", searchStudentByStudentNo);
  app.get("/searchstudentbyname", searchStudentByName);
  app.post("/createapprover", createApprover);
  app.post("/deleteapproverbyemail", deleteApproverByEmail);
  app.post('/editapproverbyemail', editApproverByEmail);
  app.get("/searchadviserbyname", searchAdviserByName);
  app.get("/searchofficerbyname", searchOfficerByName);
  app.post('/add-application', addApplication);
  app.post('/get-applications', getApplications);
  app.post('/getcurrentApplication', getCurrentApplication);
  app.post('/closeApplication', closeApplication);
  app.post('/openApplication', openApplication);

  app.get("/getaccountrequest", getAccountRequest);
  app.post("/approveaccount", approveAccount);
  app.get("/getadviseraccount", getAdviserAccount);

  app.get("/getapproveraccount", getApproverAccounts);
  app.post("/deleteapproveraccounts", deleteApproverAccounts);
  app.post("/mapstudenttoadviser",mapStudenttoAdviser);

  app.post("/getapprovedbyadviserstudentforms", getApprovedByAdviserStudentForms);

  app.post("/getadviseeapplications", getAdviseeApplications);
  app.post("/rejectadviseeapplication", rejectAdviseeApplication);
  app.post("/approveadviseeapplication", approveAdviseeApplication);
  app.post("/resubmitapplication", resubmitApplication);

  app.post("/rejectofficerapplication", rejectOfficerApplication);
  app.post("/approveofficerapplication", approveOfficerApplication);
}

export default setUpRoutes;






