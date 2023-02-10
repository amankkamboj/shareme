import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate  } from 'react-router-dom';
import {FcGoogle} from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import axios from "axios";
import {client} from '../client';

// import jwt_decode from "jwt-decode";
const Login = () => {
  
  const navigate = useNavigate()
  const Glogin=useGoogleLogin({
    onSuccess: async tokenResponse => {
      console.log(tokenResponse);
      
      console.log("Get details");
      try{      
      const res =  await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
        headers:{
          "Authorization":`Bearer ${tokenResponse.access_token}`
        }
      })
      console.log(res.data);
      localStorage.setItem('user',JSON.stringify(res.data));
      // Object destructuring
      const { name,sub,picture }=res.data;
      console.log(`Username ${name} googleId ${sub} picture ${picture}`);

      const doc ={
        _id: sub,
        _type:"user",
        userName: name,
        image: picture,
      }
      client.createIfNotExists(doc)
      .then(()=>{
        navigate('/',{replace:true})
      })

    }
    catch(err){
      console.log(err);
    }
    },
    
    // flow: 'auth-code',
  });
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={shareVideo} type="video/mp4"
          loop
          controls={false}
          muted
          className='w-full h-full object-cover'
        />
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width='130px' alt= "Logo" />
          </div>
          <div className='shadow-2xl'>
            
              <button onClick={() => Glogin()} type='button' className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'>
                  <FcGoogle className='mr-4'  /> Sign in with Google
              </button>     
            

            
          </div>
        </div>
      </div>

    </div>
  )
}

export default Login
