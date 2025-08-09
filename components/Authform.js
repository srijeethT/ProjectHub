"use client";
import React, { useState } from "react";
import {createUser, validateUser} from "../lib/actions/user.actions";
import {useRouter} from "next/navigation";

const Authform = ({type}) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
    const [error, setError] = useState(null)
  const router=useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            let data;

            if (type === "signup") {
                data = await createUser({ email, password });
            } else {
                data = await validateUser({ email, password });
            }

            if (data?.token) {
                router.push("/");
            }
        } catch (error) {
            setError(error.message);
        }
    };

  return (
    <div className="f">
      <div className="flex justify-center items-center flex-col">
          <form onSubmit={handleSubmit} className='flex flex-col items-center'>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your Email"
          type="email"
          width="100%"
          className="p-2 px-4  m-2 border-4 border-gray-300 rounded-lg"
        />
          {
              type==='signup' ?
                  <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new Password"
                  type="password"
                  width="100%"
                  className="p-2 px-4 m-2 border-4 border-gray-300 rounded-lg"
              />:<input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your Password"
                  type="password"
                  width="100%"
                  className="p-2 px-4 m-2 border-4 border-gray-300 rounded-lg"
              />
          }
        <button
          type='submit'
          className="p-2 px-4 m-2 border-4 border-gray-300 rounded-lg"
        >
            {type==='signup' ? 'Sign Up':'Sign In'}
        </button>
              {type==='signup' ?<a className='text-sm  underline' href="/signin">Sign In</a>:<a className='text-sm underline' href='/signup'>Sign Up</a>}
          {error && <p className="text-red-500">{error}</p>}
          </form>
      </div>
    </div>
  );
};

export default Authform;