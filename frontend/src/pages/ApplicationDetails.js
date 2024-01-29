import React, { useRef } from 'react';
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from 'react-router-dom';
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {jsPDF} from "jspdf";
import html2canvas from 'html2canvas';

export default function ApplicationDetails() {
    let lname = localStorage.getItem("lname");
    let fname = localStorage.getItem("fname");
    let mname = localStorage.getItem("mname");
    let studno = localStorage.getItem("studno");
    let {date_created, purpose, githublink, progress_detail}  = useParams();
    const cardPrint = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const navigate = useNavigate()
    const [showNavSecond, setShowNavSecond] = useState(false);


    function generatePDF() {
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'in',
          format: [4, 2],
        });
      
        const element = document.getElementById("document-preview-container");
      
        doc.html(element, {
          callback: function (pdf) {
            pdf.save('document.pdf');
          },
        });
    }
    


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
    
    // bale pag completed na yung process, saka palang papapayagan yung student user na maprint and makita yung preview nung verified document
    if(progress_detail == "Completed") {
        return (
            <div class="root">

                <div class="row" style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0", padding:"10px"}}>
                    <div class="column" style={{flex: "33.33%", padding: "5px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        
                            <div className="card" style={{ padding: "20px", width: "fit-content" }}>
                                <div className="d-flex flex-column justify-content-center align-items-center">
                                    <div>
                                            <p style={{ fontWeight: "bold" }}>Date:</p>
                                            <p id="date_created">{String(date_created)}</p>
                                            <p style={{ fontWeight: "bold" }}>Purpose:</p>
                                            <p id="purpose">{purpose}</p>
                                            <p style={{ fontWeight: "bold" }}>Github Link:</p>
                                            <p id="progress">{githublink}</p>
                                            <p style={{ fontWeight: "bold" }}>Progress:</p>
                                            <p id="progress">{progress_detail}</p>
                                    </div>
                                        <button className="btn btn-danger w-100 mb-4" style={{ textDecoration: "none", color: "black" }}>
                                            <Link to={`/student-view-all-applications`} style={{ textDecoration: "none", color: "white" }}>
                                            Close
                                            </Link>
                                        </button>
                                    </div>
                                </div>
                               
                        </div>
                    

                    <div class="column" style={{flex: "33.33%", padding: "5px"}}>
                        <div class="card">
                        <button className='Button' onClick={() => {
                            const element = document.getElementById('document-preview-container');

                            html2canvas(element).then((canvas) => {
                              const imgData = canvas.toDataURL('image/png');
                              const pdf = new jsPDF('landscape');
                          
                              const imgProps = pdf.getImageProperties(imgData);
                              const pdfWidth = pdf.internal.pageSize.getWidth();
                              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                          
                              pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                              pdf.save('document.pdf');
                            });
                        }}> Generate PDF</button>
                        <div ref={cardPrint}>
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
                                    <h5 id="document-date">{date_created}</h5>
                                    </div>
                                    
                                    <br></br>
                
                                    <div>
                                    <p id="document-studname-studno">This document certifies that {fname} {mname} {lname}, {studno} has satisfied the clearance requirements of the institute.</p>
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
                    </div>
            </div>
        </div>
        )
    }else {
        return (
            <div class="root">
                
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <div className="card" style={{ padding: "20px", width: "fit-content" }}>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <div>
                                <p style={{ fontWeight: "bold" }}>Date:</p>
                                <p id="date_created">{String(date_created)}</p>
                                <p style={{ fontWeight: "bold" }}>Purpose:</p>
                                <p id="purpose">{purpose}</p>
                                <p style={{ fontWeight: "bold" }}>Github Link:</p>
                                <p id="progress">{githublink}</p>
                                <p style={{ fontWeight: "bold" }}>Progress:</p>
                                <p id="progress">{progress_detail}</p>
                            </div>
                            <button className="btn btn-danger w-100 mb-4" style={{ textDecoration: "none", color: "black" }}>
                                <Link to={`/student-view-all-applications`} style={{ textDecoration: "none", color: "white" }}>
                                Close
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>    
            </div>
        )
    }
}