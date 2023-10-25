import React from 'react'
import { imgFileTypes } from '@/utils/imgFileTypes'
import { useIsMobile } from '../hooks/useIsMobile'

const Item = ({ data, saved, handleSaveItem, handleUnsaveItem }) => {
    const {
        id,
        name,
        description,
        rate,
        freeShipment,
        img,
        price,
        url,
        siteName
    } = data

    let isMobile = useIsMobile()

    const numberToCurrency = price => {
        if (!price || saved) return 'Prezzo non disponibile'
        let priceString = price?.toString() // Parse float to string

        // Get the currency format
        const formatter = new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        })

        return formatter.format(priceString) // Return the string formatted
    }

    /*const checkImgFormat = () =>{
        
    }*/

    return (
        <div className="container" key={name} style={{ marginTop: '1rem' }}>
            <div className="d-flex justify-content-center row">
                <div className="col-md-10">
                    <div
                        className="row p-2 bg-white border rounded"
                        style={{
                            height: 220,
                            maxHeight: 220,
                            overflow: 'hidden'
                        }}>
                        <div
                            className="col-md-3 mt-1"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden'
                            }}>
                            <a href={url} target="_blank" rel="noreferrer">
                                <div className="img-frame">
                                    <img
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto'
                                        }}
                                        className="img-fluid img-responsive rounded product-image"
                                        src={!img.includes('data:') ? img : ''}
                                        alt={`Immagine non disponibile, collegarsi al sito.`}
                                        onError={e => {
                                            e.currentTarget.setAttribute(
                                                'src',
                                                `images/${siteName}.${imgFileTypes[siteName]}`
                                            )
                                            e.currentTarget.setAttribute(
                                                'onErro',
                                                null
                                            )
                                        }}
                                    />
                                </div>
                            </a>
                        </div>
                        {!isMobile ? (
                            <>
                                <div className="col-md-6 mt-1 name-container">
                                    <h5>{name}</h5>
                                    <div className="d-flex flex-row">
                                        <div className="ratings mr-3">
                                            {rate &&
                                                [
                                                    ...Array(
                                                        Math.floor(rate)
                                                    ).keys()
                                                ].map((_, index) => (
                                                    <i
                                                        key={index}
                                                        className="fa fa-star"
                                                    />
                                                ))}
                                            {rate &&
                                                [
                                                    ...Array(
                                                        Math.ceil(
                                                            rate -
                                                                Math.floor(rate)
                                                        )
                                                    ).keys()
                                                ].map((_, index) => (
                                                    <i
                                                        key={index}
                                                        className="fa fa-star-half-o"
                                                    />
                                                ))}
                                        </div>
                                        <span>{rate}</span>
                                    </div>
                                    <div className="description-container">
                                        <div className="mt-1 mb-1 spec-1">
                                            <span>{description}</span>
                                        </div>
                                        {/*<div class="mt-1 mb-1 spec-1"><span>Unique design</span><span class="dot"></span><span>For men</span><span class="dot"></span><span>Casual<br /></span></div>
                                <p class="text-justify text-truncate para mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.<br></br></p> */}
                                    </div>
                                    <div className="img-description-container">
                                        <img
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto'
                                            }}
                                            className="img-fluid img-responsive rounded product-image"
                                            src={`images/${siteName}.${imgFileTypes[siteName]}`}
                                            alt={' '}
                                        />
                                    </div>
                                </div>
                                <div className="align-items-center align-content-center col-md-3 border-left mt-1">
                                    <div className="d-flex flex-row align-items-center">
                                        <h4 className="mr-1">
                                            {numberToCurrency(price)
                                                ? numberToCurrency(price)
                                                : 'NaN'}
                                        </h4>
                                    </div>
                                    {freeShipment && !saved && (
                                        <h6 className="text-success">
                                            Free shipping
                                        </h6>
                                    )}
                                    <div className="d-flex flex-column mt-4 ">
                                        <a
                                            href={url}
                                            target="_blank"
                                            className="btn btn-outline whiteback btn-sm mt-2"
                                            rel="noreferrer">
                                            <button
                                                type="button"
                                                style={{ outline: 'none' }}>
                                                Dettagli
                                            </button>
                                        </a>
                                        {!saved ? (
                                            <button
                                                className="btn btn-outline whiteback btn-sm mt-2"
                                                type="button"
                                                onClick={() =>
                                                    handleSaveItem(data)
                                                }>
                                                Salva
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-outline whiteback btn-sm mt-2"
                                                type="button"
                                                onClick={() =>
                                                    handleUnsaveItem(data)
                                                }>
                                                Dimentica
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="mobile-survey-container">
                                <div
                                    className="mobile-survey-price-container d-flex flex-row align-items-center"
                                    style={{ bottom: 0 }}>
                                    <h4 className="mr-1">
                                        {numberToCurrency(price)
                                            ? numberToCurrency(price)
                                            : 'NaN'}
                                    </h4>
                                </div>
                                <div className="mobile-survey-title-container d-flex flex-row align-items-center">
                                    <h5 className="mr-1">{name}</h5>
                                </div>

                                {!saved ? (
                                    <button
                                        className="btn btn-outline whiteback btn-sm mt-2"
                                        type="button"
                                        onClick={() => handleSaveItem(data)}>
                                        Salva
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-outline whiteback btn-sm mt-2"
                                        type="button"
                                        onClick={() => handleUnsaveItem(data)}>
                                        Dimentica
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Item
