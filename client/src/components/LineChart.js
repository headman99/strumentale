import React, { useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'

const LineChart = ({ trendData, surveyName }) => {
    const months = [
        'Gen',
        'Feb',
        'Mar',
        'Apr',
        'Mag',
        'Giu',
        'Lug',
        'Ago',
        'Set',
        'Ott',
        'Nov',
        'Dic'
    ]
    const labels = trendData?.map(item => {
        const date = new Date(item.created_at)
        return `${date.getDate()} ${months[date.getMonth()]}`
    })
    const values = trendData?.map(item => item.price)
    //const endDate = new Date(`${today.getMonth() - n_months<0?today.getFullYear() - 1:today.getFullYear() }-${today.getMonth() - n_months<0? 12 - (n_months - today.getMonth() + 1):today.getMonth()- n_months}-${today.getDate()}`)

    const data = {
        labels: labels,
        datasets: [
            {
                label: surveyName,
                data: values,
                fill: false,
                borderColor: '#a7287f',
                tension: 0.1
            }
        ]
    }

    return <Line data={data} />
}

export default LineChart
