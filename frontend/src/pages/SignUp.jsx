import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBValidation,
  MDBValidationItem,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
}
  from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function SignUp() {
  const navigate = useNavigate()
  const [isValidPassword, setValidPassword] = useState(false);
  const [isValidEmail, setValidEmail] = useState(false);
  const [formValue, setFormValue] = useState({
    fname: '',
    mname: '',
    lname: '',
    studno: '',
    email: '',
    password: '',
  });

  function togglePassword(){
    setValidPassword(!isValidPassword);
  }
  function handlePassword(){
    togglePassword()
  }
  function validatePassword(value) {
    const validPassword = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*(),.?:{}|<>]).{8,}$")
    if (!validPassword.test(value)) {
  
        togglePassword();
        return false;
    }
    return true;
  }

  //==================
  function toggleEmail(){
    setValidEmail(!isValidEmail);
  }
  function handleEmail(){
    toggleEmail()
  }
  function validateEmail(value) {
    const validEmail = new RegExp("^\\w+(\\.\\w+)*@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$");
    if (!validEmail.test(value)) {
        toggleEmail()
        return false;
    }
    return true;
  }

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  //sign up
  function signUp(e) {
    e.preventDefault();

    console.log(formValue);
    // form validation goes here 
    if (formValue.fname !== "" && formValue.mname !== "" && formValue.lname !== "" && formValue.studno !== "" && formValue.email !== "" && formValue.password !== "") {
      console.log(formValue.password)
      if (validatePassword(formValue.password) == true) {
        if (validateEmail(formValue.email) == true){
          console.log("pasok");
          fetch("http://localhost:3001/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                // fname: document.getElementById("f-name").value,
                // mname: document.getElementById("m-name").value,
                // lname: document.getElementById("l-name").value,
                // studno: document.getElementById("snum").value,
                // email: document.getElementById("upmail").value,
                // password: document.getElementById("signuppassword").value
                fname: formValue.fname,
                mname: formValue.mname,
                lname: formValue.lname,
                studno: formValue.studno,
                email: formValue.email,
                password: formValue.password,
              })
            })
            .then(response => response.json())
            .then(body => {
              if (body.success) {
                alert("Successfully sign up!");
                navigate("/");
              }
              else { alert("Sign up failed") }
            })

  
        }
         
      } 
      
    }
  }
  return (
    <div class="d-flex align-items-center mb-3 -md-8 col-lg-6 col-xl-4 offset-xl-4">

    <MDBContainer className="mb-5 gradient-form">
      <MDBCol col='7'>
      <div className="mt-3 text-center">
              <img src={require('./assets/logo.png')}
                style={{ width: '150px' }} alt="logo" />
            </div>
      <div className='text-center'>
        <h3 className='mt-2 mb-4' text-center>Sign Up</h3>
        </div>
        <MDBValidation className='row g-3' onSubmit={signUp}>
          <MDBValidationItem className='md-4'>
            <MDBInput
              value={formValue.fname}
              name='fname'
              onChange={onChange}
              id='fname'
              required
              label='First name'
            />
          </MDBValidationItem>
          <MDBValidationItem className='md-4' >
            <MDBInput
              value={formValue.mname}
              name='mname'
              onChange={onChange}
              id='mname'
              required
              label='Middle name'
            />
          </MDBValidationItem>
          <MDBValidationItem className='md-4' >
            <MDBInput
              value={formValue.lname}
              name='lname'
              onChange={onChange}
              id='lname'
              required
              label='Last name'
            />
          </MDBValidationItem>
          <MDBValidationItem className='md-4' >
            <MDBInput
              value={formValue.studno}
              name='studno'
              onChange={onChange}
              id='studno'
              required
              label='Student number'
            />
          </MDBValidationItem>
          <MDBValidationItem className='md-4' >
            <MDBInput
              value={formValue.email}
              name='email'
              onChange={onChange}
              id='email'
              required
              label='UP Mail'
              type='email'
            />
          </MDBValidationItem>
          <MDBValidationItem className='md-4' >
            <MDBInput
              value={formValue.password}
              name='password'
              onChange={onChange}
              
              id='password'
              required
              label='Password'
              type='password'
            />
          </MDBValidationItem>

          {/* <MDBInput wrapperClass='mb-4' label='First Name' id='f-name' type='text' />
        <MDBInput wrapperClass='mb-4' label='Middle Name' id='m-name' type='text' /> */}
          {/* <MDBInput wrapperClass='mb-4' label='Last Name' id='l-name' type='text' />
          <MDBInput wrapperClass='mb-4' label='Student Number' id='snum' type='text' />
          <MDBInput wrapperClass='mb-4' label='UP Mail' id='upmail' type='email' />
          <MDBInput wrapperClass='mb-4' label='Password' id='signuppassword' type='password' /> */}

          <div className="text-center pt-1 mb-5 pb-1">
            <button className="btn btn-primary w-100 mb-4" type='submit'>Sign up</button>
            <Link to={'/'}><button className="btn btn-primary w-100 mb-4" >Back</button></Link>
          </div>

        </MDBValidation>
      </MDBCol>
    </MDBContainer>

    {isValidPassword && (
        <MDBModal tabIndex="-1" show={isValidPassword} onHide={togglePassword}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                Warning
              </MDBModalHeader>
              <MDBModalBody>
              Password must have at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
              </MDBModalBody>
              <MDBModalFooter>
              <button className="btn btn-primary w-100 mb-4" onClick={handlePassword}>
                Try Again
              </button>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}
       {isValidEmail && (
        <MDBModal tabIndex="-1" show={isValidEmail} onHide={toggleEmail}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                Warning
              </MDBModalHeader>
              <MDBModalBody>
              Please enter a valid email address
              </MDBModalBody>
              <MDBModalFooter>
              <button className="btn btn-primary w-100 mb-4" onClick={handleEmail}>
                Try Again
              </button>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}
  </div>
  );
}