import ApplicationLogo from '@/components/ApplicationLogo'
import AuthCard from '@/components/AuthCard'
import Button from '@/components/Button'
import GuestLayout from '@/components/Layouts/GuestLayout'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import { useRouter } from 'next/router'
import React from 'react'

const Register = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard'
    })

    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})

    const submitForm = async event => {
        event.preventDefault()

        try {
            const reg = await register({
                name,
                email,
                password,
                setErrors
            })
            router.push('/login')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <GuestLayout>
            <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block ">
                <Link
                    href="/login"
                    style={{ color: 'white' }}
                    className="ml-4 text-sm  underline">
                    Accedi
                </Link>
                <Link
                    href="/dashboard"
                    style={{ color: 'white' }}
                    className="ml-4 text-sm  underline">
                    Dashboard
                </Link>
            </div>
            <AuthCard
                logo={
                    <ApplicationLogo
                        className="w-20 h-20 fill-current text-gray-500"
                        disableLink={true}
                    />
                }>
                <form onSubmit={submitForm}>
                    {/* Name */}
                    <div>
                        <Label htmlFor="name">Nome</Label>

                        <Input
                            id="name"
                            type="text"
                            value={name}
                            className="block mt-1 w-full"
                            onChange={event => setName(event.target.value)}
                            required
                            autoFocus
                        />

                        <InputError messages={errors?.name} className="mt-2" />
                    </div>

                    {/* Email Address */}
                    <div className="mt-4">
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            value={email}
                            className="block mt-1 w-full"
                            onChange={event => setEmail(event.target.value)}
                            required
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
                            onChange={event => setPassword(event.target.value)}
                            required
                            autoComplete="new-password"
                        />

                        <InputError
                            messages={errors?.password}
                            className="mt-2"
                        />
                    </div>

                    {/* Confirm Password */}

                    <div className="flex items-center justify-end mt-4">
                        <Link
                            href="/login"
                            className="underline text-sm text-gray-600 hover:text-gray-900">
                            Già registrato?
                        </Link>

                        <button className="ml-4 btn-search border-radius">
                            Registrati
                        </button>
                    </div>
                </form>
            </AuthCard>
        </GuestLayout>
    )
}

export default Register
