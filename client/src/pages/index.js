import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import React, { useEffect } from 'react'
import Loading from '@/components/Loading'
import { useRouter } from 'next/router'
import GuestLayout from '@/components/Layouts/GuestLayout'

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        router.push('/dashboard')
    }, [])

    return (
        <GuestLayout>
            <div
                style={{
                    width: '100%',
                    height: '100vh',
                    backgroundColor: '#3a1f78'
                }}>
                <Loading absolute={true} isLoading={true} />
            </div>
        </GuestLayout>
    )
}
