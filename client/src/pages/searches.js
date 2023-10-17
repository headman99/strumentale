import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import Surveys from '@/components/Surveys'
import React from 'react'

const Searches = () => {
    const { user } = useAuth({ middleware: 'guest' })
    return (
        <AppLayout>
            <Surveys />
        </AppLayout>
    )
}

export default Searches
