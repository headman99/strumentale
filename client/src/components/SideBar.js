import React, { useState } from 'react'
import { RiSideBarFill } from 'react-icons/ri'
import { LiaTimesSolid } from 'react-icons/lia'
import NavLink from '@/components/NavLink'
import { useRouter } from 'next/router'
import { FiArrowUpRight } from 'react-icons/fi'

function SideBar({ handleShowModalConfirm }) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const [modalOptions, setModalOptions] = useState(null)

    const toggleSideBar = () => {
        console.log('toggle')
        setIsOpen(!isOpen)
    }

    return (
        <div className="sidebar-container">
            <button
                className="toggle-button"
                style={{ width: 50, height: 50, maxWidth: 50 }}
                onClick={toggleSideBar}>
                <RiSideBarFill size={20} />
            </button>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <LiaTimesSolid
                    className={`toggle-icon ${isOpen ? 'open' : 'close'}`}
                    onClick={toggleSideBar}
                    style={{ margin: 20 }}
                    size={20}
                />
                <ul className="menu">
                    <li>
                        <NavLink
                            href="/dashboard"
                            active={router.pathname === '/dashboard'}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <button
                            className="link-button"
                            onClick={e => handleShowModalConfirm(e,'/searches')}>
                            Ricerche salvate
                        </button>
                    </li>
                    <li>
                        <button
                            className="link-button"
                            onClick={e => handleShowModalConfirm(e,'/items')}>
                            Oggetti salvati
                        </button>
                    </li>

                    <li>
                        <NavLink
                            href="https://www.strumentale.it"
                            target="_blank">
                            Vai al sito
                            <FiArrowUpRight
                                style={{
                                    display: 'inline-block'
                                }}
                            />
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default SideBar
