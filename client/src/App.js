
import './App.css';
import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import{GoogleLogin, GoogleOAuthProvider}from"@react-oauth/google"

// backend SERVER API base URL
 const API="http://localhost:4000";

 const GOOGLE_CLIENT_ID="675616225771-2hi2d5k8gc8h9kv49qlju09p2elnl90t.apps.googleusercontent.com"


// main react component

function App() {
  //  state to store the login status-Login mode or Register mode
    const[isLogin,setIsLogin]=useState(true);

    // state to store the values from form(name,email,password)
    const[form,setForm]=useState({
       name:"",
       email:"",
       password:""
     });

    // state to store the JWT Token(Read from browser local storage)
     const[token,setToken]=useState(localStorage.getItem("token"));

  
    // only html shouyld come inside return 

    // register function
    const register=async()=>{
      // send form data through axios request
      await axios.post(`${API}/register`,form);
      alert("registered!login now");
      setIsLogin(true);

    };
    const login =async()=>{
      const res=await axios.post(`${API}/login`,{
        email:form.email,
        password:form.password
      })
      localStorage.setItem("token",res.data.token);
      setToken(res.data.token)
    }
    const logout=()=>{
      localStorage.removeItem("token")
      setToken(null)
    }
    // google authentication
    const handleGoogleLogin=async(CredentialResponse)=>{
      try{
        const res=await axios.post(`${API}/auth/google`,{
          id_token:CredentialResponse.credential,
        })
        localStorage.setItem("token",res.data.token);
        setToken(res.data.token);
      }
      catch(err){
        alert(err.response?.data?.message||"Google signin-Failed")
      }
    }

    // g end


    // Logged UI-After Login
     if(token){
      return(
        <div className='vh-100 d-flex justify-content-center align-items-center bg-danger'>
         <div className='bg-white p-4'>
           <h3>welcome user...you logged in</h3>
           <button onClick={logout}>logout</button>
         </div>
         </div>
       );
   }
    return(
      <GoogleOAuthProvider  clientId={GOOGLE_CLIENT_ID}>
      <div className="vh-100 d-flex justify-content-center align-items-center bg-info bg-gradient
">
        <div className="bg-white rounded p-4" style={{ width: "350px" }}>
        <h2>{isLogin?"Login":"Register"}</h2>
        {/* name field should be shown only if  isLogin is false-Register mode */}
        {!isLogin &&(
          <input type='text' placeholder='name' className='form-control mb-3'
          onChange={(e)=>setForm({...form,name:e.target.value})}/>
        )}
        <input type='email' placeholder='Enter email' className='form-control mb-3'
        onChange={(e)=>setForm({...form,email: e.target.value})}/>
        <input type='password' placeholder='Password' className='form-control mb-3'
        onChange={(e)=>setForm({...form,password:e.target.value})}/>

        {isLogin? (
           <button className='btn btn-primary w-100' onClick={login}>login</button>
          ):(<button  className='btn btn-primary w-100' onClick={register}>Register</button>

          )}
{/* handeleing google authentication */}
<div className="mt-3">
          <GoogleLogin 
          onSuccess={handleGoogleLogin} 
          onError={()=>alert("Google login failed")}
          size="small"
          width="300px"
          >


          </GoogleLogin>
          </div>
{/* end */}
          <p className="text-center mt-3 text-danger" onClick={()=>setIsLogin(!isLogin)}
            style={{cursor:"pointer"}}
          >
          {isLogin?"Create account": "Already have an account? Login"}</p>


</div>
      </div>
      </GoogleOAuthProvider>
    );


  
}

export default App;
