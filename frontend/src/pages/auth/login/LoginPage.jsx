import { useState } from 'react'
import { Link } from 'react-router-dom'

import XSvg from '../../../components/svgs/X'

import { MdOutlineMail } from 'react-icons/md'
import { MdPassword } from 'react-icons/md'

const LoginPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const isError = false;
    
  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
        <div className='flex-1 hidden lg:flex justify-center items-center'>
            <XSvg className='w-24 lg:hidden fill-white' />
        </div>
        <div className='flex-1 flex flex-col justify-center items-center'>
            <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                <XSvg className='w-24 lg:hidden fill-white' />
                <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
                <label className='input input-bordered rounded flex items-center gap-2'>
                    <MdOutlineMail />
                    <input 
                        type="email" 
                        placeholder='Email' 
                        className='grow' 
                        value={formData.email}
                        onChange={handleInputChange}
                        name='email'
                    />
                </label>
                <label className='input input-bordered rounded flex items-center gap-2'>
                    <MdPassword />
                    <input 
                        type="password" 
                        placeholder='Password' 
                        className='grow' 
                        value={formData.password}
                        onChange={handleInputChange}
                        name='password'
                    />
                </label>
                <button className='btn rounded-full btn-primary text-white'>Log in</button>
                {isError && <p className='text-red-500'>Invalid email or password</p>}
            </form>
            <div>
                <p className='text-white text-lg'>{"Don't"} have an account?</p>
                <Link to='/signup'>
                    <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default LoginPage