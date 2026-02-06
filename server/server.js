// import the express framwork to create server and API
const express=require("express");
// import mongoose to connect the node js MongoDB
const mongoose =require("mongoose");
// import bcryptjs to encrpt the password (hash)
const bcrypt=require("bcryptjs");
// import jsonwebtoken-JWT to cretae token
const jwt=require("jsonwebtoken");
// import CORS to accept the forntend request
const cors= require("cors");
// google
const{OAuth2Client}=require("google-auth-library")
// create express server-application
const app=express();
// allow server to read the json request
app.use(express.json());
// allow requestr from client
app.use(cors());


// google auth client verify server
const GOOGLE_CLIENT_ID="675616225771-2hi2d5k8gc8h9kv49qlju09p2elnl90t.apps.googleusercontent.com"
const googleClient=new OAuth2Client(GOOGLE_CLIENT_ID);
//mongodb connection
mongoose.connect("mongodb://127.0.0.1:27017/authDB")
.then(()=>console.log("MongoDB Connected"));

// create a model to interact with the collection
const User=mongoose.model(
    "User",
    {name:String,email:String,password:String,
        googleId:String
    },
    "user"
);
// register API-POST method
app.post("/register",async(req,res)=>{
    // get name ,email,password from request body
    const {name, email, password}=req.body;
    // check whether the email is already registered
    const existing =await User.findOne({email});
    if(existing){
        return res.status(400).json({message:"user already exists"});
    }
    // convert the plain password into hashed password
    const hashedPassword=await bcrypt.hash(password, 10);
    // save the user in MONGODB 
    await User.create({
        name,
        email,
        password:hashedPassword

    });

    // send success message to client
    res.json({message:"user added successfully"});
});
// compare password and email
app.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    // find user email
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"user not found"})
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"wrong password"});
    }
    const token=jwt.sign({id:user._id},"1234",{expiresIn:"1h"}
    )
    res.json({token})

    });


// google sign-in API
app.post("/auth/google", async (req, res) => {
  try {
    const { id_token } = req.body;

    if (!id_token) {
      return res.status(400).json({ message: "No Google token provided" });
    }

    // verify google token
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    // extract user info from Google token
    const payload = ticket.getPayload();
    const name = payload.name;
    const email = payload.email;
    const googleId = payload.sub;

    // check user in DB
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "",
        googleId,
      });
    }

    // issue JWT token
    const token = jwt.sign(
      { id: user._id },
      "1234",
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Google login failed" });
  }
});


// start the server
app.listen(4000, ()=>{
    console.log("server is running on http://localhost:4000");
})
