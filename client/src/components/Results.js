import React from 'react'
import Item from './Item'
import { save_item } from '@/lib/api'
import Loading from './Loading'

/**
 * Component in charge of displaying the results list
 */
function Results(props) {
    if (props.error) return <div className='no-data'>Caricamento fallito, ricaricare al pagina</div>
    if (!props.data) return <div />

    const item_list = props.data.item_list
    console.log(props.data  )
    const handleSaveItem = data => {
        const { name, url, img } = data

        save_item({
            name: name,
            url: url,
            img: img
        })
            .then(() => {
                props.transition_alert({
                    severity: 'success',
                    title: 'Success',
                    text: 'Elemento salvato'
                })
            })
            .catch(err => {
                props.transition_alert({
                    severity: 'warning',
                    title: 'Errore',
                    text:
                        "Errore nel salvataggio dell' elemento." +
                        err?.response?.data?.exception
                })
            })
    }

    // Return the fetched data
    return (
        <>
            <Loading isLoading={props.isLoading} dataload={true} />
            {!props.isLoading && (
                <div className="fade-in">
                    {item_list.map((item, i) => (
                        <Item
                            key={i}
                            data={{
                                name: item.name,
                                description: item.description,
                                rate: item.rate,
                                freeShipment: item.freeShipment,
                                price: item.price,
                                img: item.img,
                                url: item.url,
                                siteName:item.siteName
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
