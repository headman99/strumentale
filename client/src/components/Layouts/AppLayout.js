import Navigation from '@/components/Layouts/Navigation'
import { useAuth } from '@/hooks/auth'
import TransitionAlerts from '../TransitionAlerts'

const AppLayout = ({ header, children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    return (
        <div style={{ backgroundColor: '#3a1f78' }} className="min-h-screen ">
            <Navigation user={user} />
            {/* Page Heading */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main>{children}</main>
        </div>
    )
}

export default AppLayout
