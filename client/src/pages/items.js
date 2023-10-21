import AppLayout from '@/components/Layouts/AppLayout'
import { delete_item, get_item } from '@/lib/api'
import React, { useEffect, useState } from 'react'
import Item from '@/components/Item'
import { MyModal } from '@/components/MyModal'
import Loading from '@/components/Loading'
import TransitionAlerts from '@/components/TransitionAlerts'
import { useAuth } from '@/hooks/auth'

const Items = () => {
    const [data, setData] = useState(null)
    const [modalOptions, setModalOptions] = useState(null)
    const { user } = useAuth({ middleware: 'guest' })

    useEffect(() => {
        get_item()
            .then(items => {
                if (items?.data) setData(items.data)
                else setData([])
            })
            .catch(err => {
                console.log(err)
            })

        return () => {}
    }, [])

    const handleDeleteItem = id => {
        delete_item({ id: id })
            .then(() => {
                setData(data.filter(item => item.id !== id))
            })
            .catch(err => console.log(err))
    }

    const handleUnsaveItem = data => {
        setModalOptions({
            title: 'Cancella',
            text: "Dimenticare l' oggetto salvato ?",
            type: 'confirm',
            onConfirm: () => handleDeleteItem(data.id)
        })
    }

    return (
        <AppLayout>
            <MyModal options={modalOptions} />
            <Loading absolute={true} isLoading={!data} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {data &&
                    data?.length > 0 &&
                    data?.map(item => (
                        <Item
                            key={item.url}
                            data={item}
                            saved={true}
                            handleUnsaveItem={handleUnsaveItem}
                        />
                    ))}
                {data && data.length == 0 && (
                    <div className="no-data">
                        Non ci sono oggetti salvati al momento
                    </div>
                )}
            </div>
        </AppLayout>
    )
}

export default Items
