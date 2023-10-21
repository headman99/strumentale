import useSWR from 'swr'
import axios from '../lib/axios'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import secureLocalStorage from 'react-secure-storage'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const token = useRef('')

    const {
        data: user,
        error,
        mutate
    } = useSWR(
        '/api/user',
        () =>
            axios
                .get('/api/user')
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    router.push('/verify-email')
                }),
        {
            revalidateOnFocus: false,
            revalidateOnMount: true,
            revalidateOnReconnect: false,
            refreshWhenOffline: false,
            refreshWhenHidden: false,
            refreshInterval: 0
        }
    )

    const csrf = async () => await axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        try {
            // Fetch the CSRF token

            await csrf()

            // Clear any previous errors
            setErrors([])

            // Send the request with the CSRF token in the headers
            await axios.post('/register', props)
            // If the request is successful, update the data using mutate()
            mutate()
        } catch (error) {
            // Handle errors
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                // Handle other errors
                console.error(error)
            }
        }
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        try {
            await csrf()

            setErrors([])
            if (setStatus) setStatus(null)

            if (user?.email !== props.email && user?.email && props.email)
                throw 'Sei loggato con un altro utente'

            const response = await axios.post('/login', props)
            if (!response.data.status) throw 'Credenziali errate'
            const accesstoken = response.data.token
            token.current = accesstoken
            secureLocalStorage.setItem('token', token.current)
            axios.defaults.headers.common['Authorization'] =
                'Bearer ' + accesstoken
            mutate()
            return { status: true }
        } catch (error) {
            // Handle errors
            if (error.response && error.response.status === 422) {
                console.log(error.response)
                setErrors([error.response.data.message])
            } else {
                // Handle other errors
                console.error(error)
            }
            return { status: false }
        }
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: router.query.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status))
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
            secureLocalStorage.removeItem('token')
            secureLocalStorage.clear()
            axios.defaults.headers.common['Authorization'] = null
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        const tkn = secureLocalStorage.getItem('token')
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        if (
            middleware === 'guest' &&
            !user &&
            //&& !tkn
            window.location.pathname != '/register'
        )
            router.push('/login')

        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            if (middleware === 'auth' && error)
                //router.push(redirectIfAuthenticated)
                logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout
    }
}
