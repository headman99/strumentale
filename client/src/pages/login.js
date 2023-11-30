import AuthCard from '@/components/AuthCard'
import AuthSessionStatus from '@/components/AuthSessionStatus'
import Button from '@/components/Button'
import GuestLayout from '@/components/Layouts/GuestLayout'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import React from 'react'
import Loading from '@/components/Loading'
import ApplicationLogo from '@/components/ApplicationLogo'

const Login = ({ redirectPath }) => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard'
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (router.query.reset?.length > 0 && Object.keys(errors).length === 0) {
            setStatus(atob(router.query.reset))
        } else {
            setStatus(null)
        }
    })

    const submitForm = async event => {
        event.preventDefault()
        setIsLoading(true)
        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus
        })
            .then(res => {
                if (res.status) {
                    router.push(`/${redirectPath ? redirectPath : 'dashboard'}`)
                } else {
                    setIsLoading(false)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <GuestLayout>
            <Loading absolute={true} isLoading={isLoading} />
            <div className="background-color">
                <div className="relative flex items-top justify-center  sm:items-center sm:pt-0">
                    <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block ">
                        <Link
                            href="/register"
                            style={{ color: 'white', zIndex: 200 }}
                            className="ml-4 text-sm  underline">
                            Registrazione
                        </Link>
                        <Link
                            href="/dashboard"
                            style={{ color: 'white', zIndex: 200 }}
                            className="ml-4 text-sm  underline">
                            Dashboard
                        </Link>
                    </div>
                </div>
                <AuthCard
                    logo={
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" disableLink={true}/>
                    }>
                    {/* Session Status */}
                    <AuthSessionStatus className="mb-4" status={status} />

                    <form onSubmit={submitForm}>
                        {/* Email Address */}
                        <div>
                            <Label htmlFor="email">Email</Label>

                            <Input
                                id="email"
                                type="email"
                                value={email}
                                className="block mt-1 w-full box-shav"
                                onChange={event => setEmail(event.target.value)}
                                required
                                autoFocus
                            />

                            <InputError messages={errors?.email} className="mt-2" />
                        </div>

                        {/* Password */}
                        <div className="mt-4">
                            <Label htmlFor="password">Password</Label>

                            <Input
                                id="password"
                                type="password"
                                value={password}
                                className="block mt-1 w-full"
                                onChange={event =>
                                    setPassword(event.target.value)
                                }
                                required
                                autoComplete="current-password"
                            />

                            <InputError
                                messages={errors?.password}
                                className="mt-2"
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="block mt-4">
                            <label
                                htmlFor="remember_me"
                                className="inline-flex items-center">
                                <input
                                    id="remember_me"
                                    type="checkbox"
                                    name="remember"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    onChange={event =>
                                        setShouldRemember(event.target.checked)
                                    }
                                />

                                <span className="ml-2 text-sm text-gray-600">
                                    Ricordati di me
                                </span>
                            </label>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            {/*<Link
                            href="/forgot-password"
                            className="underline text-sm text-gray-600 hover:text-gray-900">
                            Forgot your password?
                            </Link>*/}

                            <button className="ml-3 btn-search border-radius">
                                Accedi
                            </button>
                        </div>
                    </form>
                </AuthCard>
            </div>
        </GuestLayout>
    )
}

export default Login
