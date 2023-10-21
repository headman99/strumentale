import React from 'react'
import pages from '../lib/pages'

const CompareTable = ({ data }) => {
    const chunkSize = 6 // Number of items to display in each table

    const tables = []

    for (let i = 0; i < pages.length; i += chunkSize) {
        const chunk = pages.slice(i, i + chunkSize)

        const table = (
            <div className="table-container" key={i}>
                {
                    <div className="table-body">
                        {chunk.map(site => {
                            console.log('site = ', site)
                            const result = data.filter(
                                el => el?.siteName === site.siteName
                            )[0]
                            return (
                                <div className="table-cell" key={site}>
                                    <a
                                        target="_blank"
                                        className="cell-image"
                                        href={result?.url}
                                        rel="noreferrer">
                                        <img
                                            src={`images/${site.logo}`}
                                            alt={site.siteName}
                                            title={site.siteName}
                                            style={{
                                                width: site?.logowidth,
                                                height: site?.logoHeight
                                            }}
                                        />
                                    </a>
                                    <div className="cell-body">
                                        <p>
                                            {result
                                                ? result.price + ' €'
                                                : '--'}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
        )

        tables.push(table)
    }

    return <div>{tables}</div>
}

export default CompareTable
