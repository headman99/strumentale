import React, { useEffect, useState } from 'react'
import Item from './Item'
import { save_item } from '@/lib/api'
import Loading from './Loading'

/**
 * Component in charge of displaying the results list
 */
function Results(props) {
    const [message, setMessage] = useState('')

    if (props.error)
        return (
            <div className="no-data">
                Caricamento fallito, ricaricare al pagina. L'elemento che cerchi
                potrebbe non essere stato trovato.
            </div>
        )
    if (!props.data) return <div />

    const item_list = props.data.item_list
    const handleSaveItem = data => {
        const { name, url, img, description, siteName } = data
        save_item({
            name: name,
            url: url,
            img: img,
            description: description,
            siteName: siteName
        })
            .then(() => {
                props.transition_alert({
                    severity: 'success',
                    title: 'Success',
                    text: 'Elemento salvato'
                })
            })
            .catch(err => {
                let text = "Errore nel salvataggio dell'elemento. "
                let message = ''
                if (err.response?.data?.exception)
                    message = err.response.data.exception
                else if (err.response.status == 401)
                    message =
                        'Per salvare un elemento devi prima autenticarti,vai alla pagina di login.'
                props.transition_alert({
                    severity: 'warning',
                    title: 'Errore',
                    text: `${text} ${message}`
                })
            })
    }

    useEffect(() => {
        let timeout = null
        if (message) setMessage('')
        if (props?.isLoading) {
            timeout = setTimeout(() => {
                setMessage(
                    'La ricerca potrebbe impiegare più del previsto a causa di alto numero di richieste, attendere o riprovare più tardi.'
                )
            }, 5000)
        }

        return () => {
            if (timeout) clearTimeout(timeout)
        }
    }, [props?.isLoading])

    // Return the fetched data
    return (
        <>
            <div
                className="fade-in"
                style={{
                    color: '#fff',
                    textAlign: 'center',
                    marginTop: 10,
                    marginBottom: 10,
                    position: 'relative'
                }}>
                {message}
            </div>
            <Loading isLoading={props.isLoading} dataload={true} />
            {!props.isLoading && (
                <div className="fade-in">
                    {item_list.map((item, index) => (
                        <Item
                            key={index}
                            data={{
                                name: item.name,
                                description: item.description,
                                rate: item.rate,
                                freeShipment: item.freeShipment,
                                price: item.price,
                                img: item.img,
                                url: item.url,
                                siteName: item.siteName
                            }}
                            handleSaveItem={handleSaveItem}
                        />
                    ))}
                </div>
            )}
        </>
    )
}

export default Results
