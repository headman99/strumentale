import React from 'react'
import Input from './Input'
import Button from './Button'

const SearchBar = ({
    handleValueChange,
    value,
    onPressSearch,
    onPressSave
}) => {
    const handleKeyDown = event => {
        if (event.keyCode == 13) onPressSearch()
    }

    return (
        <div
            className="form-group"
            style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '25px'
            }}>
            <div style={{ display: 'flex' }}>
                <Input
                    style={{ width: '254px', margin: '5px' }}
                    type="text"
                    value={value}
                    placeholder="Search here"
                    onChange={handleValueChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div style={{ display: 'flex' }}>
                <Button style={{ margin: '5px' }} onClick={onPressSearch}>
                    Cerca
                </Button>
                <Button
                    style={{ margin: '5px' }}
                    onClick={onPressSave}
                    disabled={!value}>
                    Salva ricerca
                </Button>
            </div>
        </div>
    )
}

export default SearchBar
