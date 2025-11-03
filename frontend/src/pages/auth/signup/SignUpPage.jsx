import { Link } from 'react-router-dom'
import { useState } from 'react'

import XSvg from '../../../components/svgs/X'

import { MdOutlineMail } from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import { MdPassword } from 'react-icons/md'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const SignUpPage = () => {

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
    });

    const {mutate: signupFn, isError, isPending, error } = useMutation({
        mutationFn: async({ email, username, fullname, password }) => {
            try {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, username, fullname, password }),
                })

                
                const data = await res.json()
                if(!res.ok) throw new Error(data.error || 'Something went wrong')

            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success('Sign up successfull! Please log in.')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        signupFn(formData)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
        <div className='flex-1 hidden lg:flex justify-center items-center'>
            <XSvg className='lg:w-2/3 fill-white' />
        </div>
        <div className='flex-1 flex flex-col justify-center items-center'>
            <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                <XSvg className='w-24 lg:hidden fill-white' />
                <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
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
                <div className='flex gap-4 flex-wrap'>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <FaUser />
                        <input 
                            type="text" 
                            placeholder='Username' 
                            className='grow' 
                            value={formData.username}
                            onChange={handleInputChange}
                            name='username'
                        />
                    </label>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdDriveFileRenameOutline />
                        <input 
                            type="text" 
                            placeholder='Full Name' 
                            className='grow' 
                            value={formData.fullName}
                            onChange={handleInputChange}
                            name='fullName'
                        />
                    </label>
                </div>
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
                <button className='btn rounded-full btn-primary text-white '>{isPending ? "Loading..." : "Sign Up" }</button>
                {isError && <p className='text-red-500'>{error.message}</p>}
            </form>
            <div className='flex flex-col lg:w-2/3 gap mt-4'>
                <p className='text-white text-md'>Already have an account? </p>
                <Link to='/login'>
                    <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Log in</button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default SignUpPage