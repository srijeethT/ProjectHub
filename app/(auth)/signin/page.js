import React from 'react';
import Authform from "@/components/Authform";

const SignIn = () => {
  return <div className='flex flex-col items-center'>
    <h1 className='text-4xl px-10 py-20'>SignIn</h1>
    <div className=' p-2 '>
      <Authform type='signin'/>
    </div>

  </div>;
};

export default SignIn;