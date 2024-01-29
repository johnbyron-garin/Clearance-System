import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/PROJECT')

const User = mongoose.model("users");

const getAccountRequest = async (req,res) => {
    const requests = await User.find({isApproved:false});
    console.log(requests);
    console.log("student");
    res.send(requests);
}
const getApproverAccounts = async (req,res) =>{
    const approvers = await User.find({ $or: [{type: "approver-adviser"},{type: "approver-officer"}]});
    res.send(approvers);
}
const approveAccount = async (req, res) => {
    if(req.body.status){
        const status = await User.findOneAndUpdate({studno: req.body.studno}, {$set : {isApproved: req.body.status, adviser: req.body.adviser }},{new:true});
        console.log(status);
    res.send(status);
    }else{
        const status = await User.deleteOne({studno: req.body.studno});
        
    res.send(status);
    }
}

const deleteApproverAccounts = async (req, res) => {
    const {email} = req.body;

    const toDel = await User.deleteOne({email})

    if(toDel.deletedCount == 1){
        res.send({success : true})
    } else {
        res.send({success: false})
    }
}

const mapStudenttoAdviser = async (req, res) => {
    const adviser = req.body.adviser;
    var matchedIndex;
    var adviseremail;
    await User.find({}).then((documents) => {
        const modifiedLastNames = documents.map((document) => {
          const fullName = document.fname + ' ' + document.mname;
          const nameParts = fullName.split(' ');
    
          let initials = '';
          for (let i = 0; i < nameParts.length; i++) {
            if (nameParts[i]) {
              initials += nameParts[i][0];
            }
          }
    
          const modifiedLastName = initials+document.lname;
          return modifiedLastName.toUpperCase();
        });
        matchedIndex = modifiedLastNames.findIndex((modifiedLastName) => {
            return modifiedLastName === adviser;
          });
        if(matchedIndex!=-1){
            adviseremail = documents[matchedIndex].email;
        }
      })
      .catch((error) => {
        console.log(error);
      });
      console.log(matchedIndex);
        if(matchedIndex!=-1){
            console.log(adviseremail);
            console.log(req.body.studno);
            await User.findOneAndUpdate({studno: req.body.studno, isApproved: true}, {adviser: adviseremail})
        }
}

export {mapStudenttoAdviser, getAccountRequest, approveAccount, getApproverAccounts, deleteApproverAccounts};

