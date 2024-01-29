import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


// get user model registered in Mongoose
const User = mongoose.model("users");

const signUp = async (req, res) => {
  const newuser = new User({
    fname: req.body.fname,
    mname: req.body.mname,
    lname: req.body.lname,
    studno: req.body.studno,
    email: req.body.email,
    password: req.body.password,
    isApproved: false,
    type: "student",
  });
  console.log(newuser);
  const result = await newuser.save();

  if (result._id) {
    res.send({ success: true })
  } else {
    res.send({ success: false })
  }
}

//create approver
const createApprover = async (req, res) => {
  console.log(req.body.type);
  const newuser = new User({
    fname: req.body.fname,
    mname: req.body.mname,
    lname: req.body.lname,
    studno: req.body.studno,
    email: req.body.email,
    password: req.body.password,
    isApproved: true,
    type: `approver-${req.body.type}`,
  });
  console.log(newuser);
  const result = await newuser.save();

  if (result._id) {
    res.send({ success: true })
  } else {
    res.send({ success: false })
  }
}

const login = async (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  // Check if email exists
  const user = await User.findOne({ email })

  //  Scenario 1: FAIL - User doesn't exist
  if (!user) {
    return res.send({ success: false, message:"no user" })
  }
  // if student sign up is not approved yet
  if (!user.isApproved) {
    return res.send({ success: false, message:"not approved"  });
  }
  // Check if password is correct using the Schema method defined in User Schema
  user.comparePassword(password, (err, isMatch) => {
    if (err || !isMatch) {
      // Scenario 2: FAIL - Wrong password
      return res.send({ success: false, message:"wrong password"  });
    }

    // Scenario 3: SUCCESS - time to create a token
    const tokenPayload = {
      _id: user._id
    }

    const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

    // return the token to the client
    return res.send({ success: true, token, username: user.fname, type: user.type, studno: user.studno, lname: user.lname, mname: user.mname, fname: user.fname, email: email});
  })
}

const checkIfLoggedIn = async (req, res) => {

  if (!req.cookies || !req.cookies.authToken) {
    // FAIL Scenario 1 - No cookies / no authToken cookie sent
    return res.send({ isLoggedIn: false });
  }

  try {
    // try to verify the token
    const tokenPayload = jwt.verify(req.cookies.authToken, 'THIS_IS_A_SECRET_STRING');

    // check if the _id in the payload is an existing user id
    const user = await User.findById(tokenPayload._id)

    if (user) {
      // SUCCESS Scenario - User is found
      return res.send({ isLoggedIn: true })
    } else {
      // FAIL Scenario 2 - Token is valid but user id not found
      return res.send({ isLoggedIn: false })
    }
  } catch {
    // FAIL Scenario 3 - Error in validating token / Token is not valid
    return res.send({ isLoggedIn: false });
  }
}

const searchStudentByStudentNo = async (req, res) => {
	const user = await User.find({ studno: req.query.studno, type: "student" })
	res.send(user)
}

const searchStudentByName = async (req, res) => {
	const user = await User.find({ fname: req.query.fname, mname: req.query.mname, lname: req.query.lname, type: "student" })
	res.send(user)
}



const deleteApproverByEmail = async (req, res) => {
	const { email } = req.body

	const result = await User.deleteOne({ email })

	if (result.deletedCount == 1) {
		res.send({ success: true })
	} else { 
		res.send({ success: false })
	}
}

const editApproverByEmail = async (req, res) => {
  const x = await User.updateOne(
    {email: req.body.email},
    {
      $set: {  // dollar sign set, pinapalitn yung value ng field na yun
      fname: req.body.fname,
      mname: req.body.mname,
      lname: req.body.lname,
      studno: "",
      email: req.body.email,
      password: req.body.password,
      isApproved: true,
      type: req.body.type,
      }
    }
  )

  if(x.acknowledged == true){
      res.send({edited:true})
  }else{
      res.send({edited:false})
  }
}

const searchAdviserByName = async (req, res) => {
	const user = await User.find({ fname: req.query.fname, mname: req.query.mname, lname: req.query.lname, type: "adviser"})
	res.send(user)
}

const searchOfficerByName = async (req, res) => {
	const user = await User.find({ fname: req.query.fname, mname: req.query.mname, lname: req.query.lname, type: "officer"})
	res.send(user)
}

const addApplication = async (req, res) => {
  const newApplication = {
    date_created: req.body.date_created,
    purpose: req.body.purpose,
    githublink: req.body.githublink,
    progress: "0",
    returned: false,
    currentlyOpen: false,
  };

  const user = await User.findOne({ studno: req.body.studno });
  user.application.push(newApplication);
  const result = await user.save();
  if (result._id) {
    res.send({ success: true })
  } else {
    res.send({ success: false })
  }
}

const getApplications = async (req, res) => {
	const applications = await User.findOne({ studno: req.body.studno });
	res.send(applications)
}

const getCurrentApplication = async (req, res) => {
  var result={}
  const user = await User.findOne({ studno: req.body.studno });
  user.application.map((application) => {
    if(application.currentlyOpen){
      result = application
    }
  });
  res.send(result);
}

const closeApplication = async (req, res) => {
  await User.updateOne({studno: req.body.studno},{ $set: { "application.$[].currentlyOpen": false } })
  res.send({})
}

const openApplication = async (req, res) => {
  console.log(req.body.id)
  await User.updateOne({studno: req.body.studno, 'application._id': req.body.id},{ $set: { "application.$.currentlyOpen": true , "application.$.progress" : "4"} })
  res.send({success:true})
}

export { signUp,openApplication , login,closeApplication, getCurrentApplication, checkIfLoggedIn, searchStudentByName, searchStudentByStudentNo, createApprover, deleteApproverByEmail, editApproverByEmail, searchAdviserByName, searchOfficerByName, addApplication, getApplications }

