import React, { useState } from 'react'
import styles from '../styles/savedsurvey.module.css'
import { useRouter } from 'next/router'
import { BsTrash, BsFillCalendarWeekFill } from 'react-icons/bs'
import { VscDebugStart } from 'react-icons/vsc'
import { HiPencil } from 'react-icons/hi'
import { MdTitle } from 'react-icons/md'
import { MyModal } from './MyModal'
import { BsTextLeft, BsGraphUpArrow } from 'react-icons/bs'
import Trend from './Trend'
import LineChart from './LineChart'
import { get_result } from '@/lib/api'

const SavedSurvey = ({ data, removeSurvey, updateSurvey, setIsLoading }) => {
    const [modalOptions, setModalOptions] = useState(null)
    const router = useRouter()

    const button_filler = {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 0
    }

    const left = {
        borderLeft: 0
    }
    const right = {
        borderRight: 0
    }
    const top = {
        borderTop: 0
    }
    const bottom = {
        borderBottom: 0
    }

    const handle_search = () => {
        router.push({
            pathname: '/dashboard',
            query: { q: data.text }
        })
    }

    const handleShowModalConfirm = () => {
        setModalOptions({
            title: 'Cancella',
            text: 'Cancellare la ricerca ?',
            type: 'confirm',
            onConfirm: () => removeSurvey(data.id)
        })
    }

    const handleShowModalInsert = () => {
        setModalOptions({
            title: 'Modifica Ricerca',
            type: 'insert',
            onConfirm: title =>
                updateSurvey({
                    id: data.id,
                    title: title
                })
        })
    }

    const handleShowTrend = () => {
        setIsLoading(true)
        get_result({
            survey: data?.id,
            samples: 15
        })
            .then(res => {
                setIsLoading(false)
                setModalOptions({
                    title: 'Andamento ricerca',
                    type: 'content',
                    disableButtons: true,
                    content: () => (
                        <LineChart
                            trendData={res.data}
                            surveyName={data?.title}
                        />
                    )
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <MyModal options={modalOptions} />
                <div className={styles.row}>
                    <MdTitle color="#a7287f" size={21} />
                    <b style={{ fontSize: 18, overflow: 'hidden' }}>
                        {data.title}
                    </b>
                </div>
                <div className={styles.row}>
                    <BsTextLeft color="#a7287f" size={20} />
                    {data.text}
                </div>
                <div className={styles.row}>
                    <BsFillCalendarWeekFill color="#a7287f" size={20} />
                    {data.created_at}
                </div>
            </div>
            <div className={styles.content_options}>
                <div>
                    <button
                        type="button"
                        className="btn btn-outline whiteback "
                        style={{ ...button_filler, ...left, ...top }}
                        title="Modifica Ricerca"
                        onClick={handleShowModalInsert}>
                        <HiPencil size={25} />
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline whiteback "
                        style={{ ...button_filler, ...right, ...top }}
                        title="Esegui Ricerca"
                        onClick={handle_search}>
                        <VscDebugStart size={25} />
                    </button>
                </div>

                <div>
                    <button
                        type="button"
                        className="btn btn-outline whiteback "
                        style={{ ...button_filler, ...bottom, ...left }}
                        title="Delete"
                        onClick={handleShowTrend}>
                        <BsGraphUpArrow size={25} />
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline whiteback"
                        style={{ ...button_filler, ...bottom, ...right }}
                        title="Delete"
                        onClick={handleShowModalConfirm}>
                        <BsTrash size={25} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SavedSurvey