import axios from '@/lib/axios'
import React, { useEffect, useState } from 'react'
import SavedSurvey from './SavedSurvey'
import { get_survey, delete_survey, update_survey } from '@/lib/api'
import Loading from './Loading';
import schedule from 'node-schedule';

function Surveys() {
    const [surveys, setSurveys] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const removeSurvey = async id => {
        try {
            await delete_survey({ id: id }) // Remove survey from the database
            setSurveys(surveys.filter(survey => survey.id !== id))

            // Cancel the scheduling
            // TODO: This should be done by making a request to the API
            const survey = surveys.find(survey => survey.id == id);
            schedule.cancelJob(survey.title)
        } catch (err) {
            console.log(err)
        }
    }

    const updateSurvey = async data => {
        const { id, title } = data
        try {
            await update_survey({
                id: id,
                title: title
            })
            let copy = [...surveys]
            let surv = copy.find(el => el.id == id)
            surv.title = title
            setSurveys(copy)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        get_survey()
            .then(response => {
                setSurveys(response.data)
                setIsLoading(false)
            })
            .catch(error => {
                // TODO: Exception control
                console.log(error)
            })
    }, [])

    return (
        <>
            <Loading absolute={true} isLoading={isLoading} />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 50
                }}>
                {(surveys && surveys.length >0) && surveys?.map(survey => (
                    <SavedSurvey
                        data={survey}
                        removeSurvey={removeSurvey}
                        key={survey.id}
                        updateSurvey={updateSurvey}
                        setIsLoading={setIsLoading}
                    />
                ))}
                {
                    (surveys && surveys.length==0) && <div className='no-data'>Non ci sono ricerche salvate al momento </div>
                }
            </div>
        </>
    )
}

export default Surveys
