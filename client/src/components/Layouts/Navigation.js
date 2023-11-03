import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import NavLink from '@/components/NavLink'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import { MyModal } from '../MyModal'
import SideBar from '../SideBar'
import Link from 'next/link'
import { useEffect } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'

const Navigation = ({ user }) => {
    const router = useRouter()
    //const { logout } = useAuth()

    const [modalOptions, setModalOptions] = useState(null)
    let isMobile = useIsMobile()

    const handleShowModalConfirm = (e, path) => {
        e.preventDefault()
        if (!user)
            setModalOptions({
                title: 'Conferma',
                text: 'Per poter accedere alla pagine è necessario autenticarsi. Andare alla pagina di login?',
                type: 'confirm',
                onConfirm: () => router.push('/login')
            })
        else router.push(path)
    }

    return (
        <>
            <div style={{ paddingLeft: '20%', paddingRight: '20%' }}>
                <MyModal options={modalOptions} />
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <div
                        style={{
                            width: 350,
                            height: 200,
                            display: 'flex',
                            justifyContent: 'center',
                            paddingBottom: 20,
                            overflow: 'hidden'
                        }}>
                        <ApplicationLogo />
                    </div>
                </div>
                {!isMobile ? (
                    <div>
                        <nav
                            className="bg-white border-b border-gray-100"
                            style={{ borderRadius: 50 }}>
                            {/* Primary Navigation Menu */}
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between h-12">
                                    <div className="flex">
                                        {/* Navigation Links */}
                                        <div className="hidden space-x-10 sm:-my-px sm:ml-10 sm:flex">
                                            <NavLink
                                                href="/dashboard"
                                                active={
                                                    router.pathname ===
                                                    '/dashboard'
                                                }>
                                                Dashboard
                                            </NavLink>
                                            <button
                                                className="link-button"
                                                style={{
                                                    borderBottom:
                                                        router.pathname ===
                                                            '/searches' &&
                                                        '2px solid #a7287f8e'
                                                }}
                                                onClick={e =>
                                                    handleShowModalConfirm(
                                                        e,
                                                        '/searches'
                                                    )
                                                }>
                                                Ricerche salvate
                                            </button>
                                            <button
                                                className="link-button"
                                                style={{
                                                    borderBottom:
                                                        router.pathname ===
                                                            '/items' &&
                                                        '2px solid #a7287f8e'
                                                }}
                                                onClick={e =>
                                                    handleShowModalConfirm(
                                                        e,
                                                        '/items'
                                                    )
                                                }>
                                                Oggetti salvati
                                            </button>

                                            <NavLink
                                                href="https://www.strumentale.it"
                                                target="_blank">
                                                Ritorna al sito
                                                <FiArrowUpRight
                                                    style={{
                                                        display: 'inline-block'
                                                    }}
                                                />
                                            </NavLink>
                                        </div>
                                    </div>

                                    {/* Settings Dropdown */}
                                    {user && (
                                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                                            <Dropdown
                                                align="right"
                                                width={100}
                                                trigger={
                                                    <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                                        <div>{user?.name}</div>

                                                        <div className="ml-1">
                                                            <svg
                                                                className="fill-current h-4 w-4"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                }>
                                                {/* Authentication */}
                                                <div>
                                                    {/*<DropdownButton onClick={logout}>
                                <span
                                    style={{
                                        position: 'relative',
                                        left: -10,
                                    }}>
                                    Logout
                                </span>
                                </DropdownButton>*/}
                                                </div>
                                            </Dropdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </nav>
                    </div>
                ) : (
                    <SideBar handleShowModalConfirm={handleShowModalConfirm} />
                )}
            </div>
        </>
    )
}

export default Navigation
