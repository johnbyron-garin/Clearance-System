import {
MDBBtn,
MDBContainer,
MDBRow,
MDBCol,
MDBInput,
MDBValidation,
MDBValidationItem,
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CreateApprover() {
    const navigate = useNavigate()
    const [selectedValue, setSelectedValue] = useState('');
    const handleDropdownSelect = (event) => {
        console.log(event.target.value);
        setSelectedValue(event.target.value);
      };
    const [formValue, setFormValue] = useState({
        fname: '',
        mname: '',
        lname: '',
        studno: '',
        email: '',
        password: '',
    });

    const onChange = (e) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    //sign up
    function signUp(e) {
        e.preventDefault();

        console.log(formValue);
        // form validation goes here 
        if (formValue.fname !== "" && formValue.mname !== "" && formValue.lname !== "" && formValue.email !== "" && formValue.password !== "") {
        console.log("pasok");
        fetch("http://localhost:3001/createapprover",
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
                type: selectedValue,
            })
            })
            .then(response => response.json())
            .then(body => {
            if (body.success) {
                alert("Successfully created Approver Account!");
                navigate("/approver-accounts");
            }
            else { alert("Sign up failed") }
            })
        }
    }
    return (
        <div class="d-flex align-items-center mb-3 -md-8 col-lg-6 col-xl-4 offset-xl-4">
        <MDBContainer className="my-5 form">
        <MDBCol col='7'>
        <div className='text-center'>
        <h2 className='mb-3' text-center>Create Approver Account</h2>
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
        <div className="my-select">
        <select
          className="my-select-dropdown"
          value={selectedValue}
          onChange={handleDropdownSelect}
        >
          <option value="">Select Role</option>
          <option value="adviser">Adviser</option>
          <option value="officer">Clearance Officer</option>
            
        </select>
        <div className="my-select-arrow">&#9662;</div>
      </div>

            <div className="text-center pt-1 mb-5 pb-1">
                <button type="submit" class="btn btn-primary w-100 mb-4">Create Account</button>

                <Link to={'/approver-accounts'}>
                <button type="submit" class="btn btn-primary w-100 mb-4">Back</button>
                    </Link>
            </div>

            </MDBValidation>
        </MDBCol>
        </MDBContainer>
        </div>
    );
}