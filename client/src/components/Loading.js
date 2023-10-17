import React, { useEffect, useRef, useState } from 'react'

const Loading = ({ isLoading, absolute, dataload, color }) => {
    return (
        <div
            className={`loader-container 
            ${dataload ? 'animated-background' : ''} 
            ${absolute ? 'absolute' : ''}
            ${!isLoading ? 'fade-out' : 'fade-in'}
            `}>
            <div
                className={`loader 
            ${!isLoading ? 'fade-out' : 'fade-in'}`}>
                <div className="loader-centered">
                    <div className="object square-one" color={color} />
                    <div className="object square-two" color={color} />
                    <div className="object square-three" color={color} />
                </div>
            </div>
        </div>
    )
}

export default Loading
