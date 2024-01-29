import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/PROJECT')

const User = mongoose.model("users");

const getAdviserAccount = async (req,res) => {
    const requests = await User.find({type:"approver-adviser"});
    console.log(requests);
    console.log("approver");
    res.send(requests);
}



export {getAdviserAccount};