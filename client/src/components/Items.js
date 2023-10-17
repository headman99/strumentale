/**
 * Component in charge of rendering the search bar and the list with the results (<Results> component)
 * (Functional component)
 *
 * The fetching of data is performed using SWR library for client-side rendering.
 */

import Results from './Results'
import { useState } from 'react'
import useSWR from 'swr'
import Button from './Button'
import Input from './Input'
import axios from '@/lib/axios'
import secureLocalStorage from 'react-secure-storage'
import SearchBar from './SearchBar'
import { save_survey } from '@/lib/api'

function Items({ fetchData, data, error, isLoading }) {
    const [searchParam, setSearchParam] = useState('')

    const handleInputChange = event => {
        const { value } = event.target
        setSearchParam(value)
    }

    const handleSave = () => {
        const request = {
            title: `${searchParam}`,
            text: searchParam
        }

        save_survey(request)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        <div>
            <SearchBar
                onPressSearch={() => fetchData(searchParam)}
                value={searchParam}
                onPressSave={handleSave}
                handleValueChange={handleInputChange}
            />
            <div className="form-group">
                <Results data={data} isLoading={isLoading} error={error} />
            </div>
        </div>
    )
}
export default Items
