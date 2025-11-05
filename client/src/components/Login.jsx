import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import Button from './Button'
import Input from './Input'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'

export const Login = () => {
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const log = async (data) => {
        try {
            const res = await axios.post('http://localhost:5000/api/login', data, { withCredentials: true })
            if (res.data.success) {
                alert(res.data.message)

                dispatch(login())

                navigate('/')
            }
        } catch (err) {
            if (err.response) {
                console.log(err.response.data)
                alert(err.response.data.message)
            } else
                console.log(err.message)
        }
    }

    return (
        <div
            className='flex items-center justify-center w-full'
        >
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {<p className="text-red-600 mt-8 text-center"></p>}
                <form onSubmit={handleSubmit(log)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register('email', {
                                required: true
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register('password', {
                                required: true
                            })}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                        >Sign in</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

