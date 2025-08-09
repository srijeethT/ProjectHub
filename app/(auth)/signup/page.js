import React from 'react';
import Authform from "@/components/Authform";

const SignUp = () => {
    return <div className='flex flex-col items-center'>
        <h1 className='text-4xl px-10 py-20'>SignUp</h1>
        <div className=' p-2 '>
            <Authform type='signup'/>
        </div>

    </div>;
};

export default SignUp;