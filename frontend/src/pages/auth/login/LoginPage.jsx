import { useState } from 'react'
import { Link } from 'react-router-dom'

import XSvg from '../../../components/svgs/X'

import { MdOutlineMail } from 'react-icons/md'
import { MdPassword } from 'react-icons/md'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const LoginPage = () => {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const queryClient = useQueryClient()

    const { mutate: loginFn, isError, isPending, error } = useMutation({
        mutationFn: async({ username, password }) => {
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                })

                const data = await res.json()
                if(!res.ok) throw new Error(data.error || 'Somthing went wrong!')
                
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            toast.success('Login successful!')
            queryClient.invalidateQueries({queryKey: ['currentUser']})
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        loginFn(formData);
    }

    const handleInputChange = (e) => {
        // const { name, value } = e.target;
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    
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
                        type="text" 
                        placeholder='username' 
                        className='w-40 grow' 
                        value={formData.username}
                        onChange={handleInputChange}
                        name='username'
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
                <button className='btn rounded-full btn-primary text-white'>{isPending ? 'Loading...' : 'Log in'}</button>
                {isError && <p className='text-red-500'>{error.message}</p>}
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