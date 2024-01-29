import mongoose from "mongoose";

await mongoose.connect("mongodb://127.0.0.1:27017/PROJECT");

const User = mongoose.model("users");

const getstudentforms = async (req, res) => {
  const requests = await User.find({ isApproved: true });
  // console.log(requests);
  // console.log("approver");
  res.send(requests);
};

// const getApprovedByAdviserStudentForms = async (req, res) => {
//     const forms = await User.find({'application.currentlyOpen':true }, 'fname, mname, lname, studno, email, application');
//     console.log(forms);
//     res.send(forms);
// }

const approveStudent = async (req, res) => {
  const status = await User.updateOne(
    { studno: req.body.studno },
    { isApproved: req.body.status }
  );
  res.send(status);
};

const getApprovedByAdviserStudentForms = async (req, res) => {
    try {
        const students = await User.aggregate([
          {
            $match: {
              "application.currentlyOpen": true,
              'application.returned': false,
              'application.progress': '5',
            },
          },
          {
            $addFields: {
              openApplication: {
                $filter: {
                  input: "$application",
                  cond: { $eq: ["$$this.currentlyOpen", true] },
                },
              },
            },
          },
          
        ]);
    
        // console.log(students);
        res.send(students);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
};

const rejectAdviseeApplication = async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.uemail);
    console.log(req.body.remarks);
    const user = await User.findOne({ 'application.currentlyOpen': true, 'email': req.body.uemail });

    if (user) {
      // Update the attribute of the open application
      const applicationIndex = user.application.findIndex(app => app.currentlyOpen === true);
      console.log(applicationIndex);
      user.application[applicationIndex].returned = true;
        console.log(user.application[applicationIndex].returned);
    user.application[applicationIndex].remarks.unshift(req.body.remarks.concat("(Adviser)"));
      // Save the updated document
      await user.save();

      console.log('Application attribute updated successfully.');
      
    } else {
      console.log('No user with an open application found.');
    }
    return({success:true});
  };

  const rejectOfficerApplication = async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.uemail);
    console.log(req.body.remarks);
    const user = await User.findOne({ 'application.currentlyOpen': true, 'email': req.body.uemail });

    if (user) {
      // Update the attribute of the open application
      const applicationIndex = user.application.findIndex(app => app.currentlyOpen === true);
      console.log(applicationIndex);
      user.application[applicationIndex].returned = true;
        console.log(user.application[applicationIndex].returned);
    user.application[applicationIndex].remarks.unshift(req.body.remarks.concat("(Officer)"));
      // Save the updated document
      await user.save();

      console.log('Application attribute updated successfully.');
      
    } else {
      console.log('No user with an open application found.');
    }
    return({success:true});
  };
  ``

const approveAdviseeApplication = async (req, res) => {
    const user = await User.findOne({ 'application.currentlyOpen': true, 'email': req.body.uemail });

    if (user) {
        // Update the attribute of the open application
        const applicationIndex = user.application.findIndex(app => app.currentlyOpen === true);
        console.log(applicationIndex);
        user.application[applicationIndex].progress = "5";
        // Save the updated document
        await user.save();
  
        console.log('Application attribute updated successfully.');
        
      } else {
        console.log('No user with an open application found.');
      }
      return({success:true});
}

const approveOfficerApplication = async (req, res) => {
  const user = await User.findOne({ 'application.currentlyOpen': true, 'email': req.body.uemail });

  if (user) {
      // Update the attribute of the open application
      const applicationIndex = user.application.findIndex(app => app.currentlyOpen === true);
      console.log(applicationIndex);
      user.application[applicationIndex].progress = "Completed";
      // Save the updated document
      await user.save();

      console.log('Application attribute updated successfully.');
      
    } else {
      console.log('No user with an open application found.');
    }
    return({success:true});
}
  
const getAdviseeApplications = async (req, res) => {
  console.log(req.body.email);
  try {
    const students = await User.aggregate([
      {
        $match: {
          "application.currentlyOpen": true,
            'application.progress': '4',
            'application.returned': false,
          adviser: req.body.email,
        },
      },
      {
        $addFields: {
          openApplication: {
            $filter: {
              input: "$application",
              cond: { $eq: ["$$this.currentlyOpen", true] },
            },
          },
        },
      },
      {
        $project: {
          fname: 1,
          mname: 1,
          lname: 1,
          studno: 1,
          email: 1,
          openApplication: 1,
        },
      },
    ]);

    console.log(students);
    res.send(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resubmitApplication = async (req, res) =>{
  console.log(req.body.remarks);

  console.log(req.body.studno);
    if(req.body.remarks.length == 0){
      await User.updateOne({studno: req.body.studno},{ $set: { "application.$[].returned": false} })
    }else{
      const user = await User.findOne({ 'application.currentlyOpen': true, 'studno': req.body.studno });

  if (user) {
      // Update the attribute of the open application
      const applicationIndex = user.application.findIndex(app => app.returned === true);
     
      user.application[applicationIndex].returned = false;
      user.application[applicationIndex].remarks.unshift(req.body.remarks.concat("(Student)"));
      // Save the updated document
      await user.save();

      console.log('Application attribute updated successfully.');
      
    } else {
      console.log('No user with an open application found.');
    }
    }
    res.send({success:true});
}
export {rejectOfficerApplication,approveOfficerApplication,
  approveAdviseeApplication,resubmitApplication, 
  getAdviseeApplications, rejectAdviseeApplication,
  getstudentforms,
  approveStudent,
  getApprovedByAdviserStudentForms,
};
