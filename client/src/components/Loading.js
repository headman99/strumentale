import React, { useEffect, useRef, useState } from 'react'
import { SquareLoader,DotLoader } from 'react-spinners'

const Loading = ({ isLoading, absolute, dataload, color }) => {
    return (
        <div
            className={`loader-container 
            ${dataload ? 'animated-background' : ''} 
            ${absolute ? 'absolute' : ''}
            ${!isLoading ? 'fade-out' : 'fade-in'}
            `}>
                   <DotLoader  size={100} color={'#a7287f8e'}/>     
            {
                //old spinner
               /* <div className={`loader ${!isLoading ? 'fade-out' : 'fade-in'}`}>
                        <DotLoader size={'70%'} color={'#a7287f8e'} />
                        <div className="object square-one" color={color} />
                    <div className="object square-two" color={color} />
                    <div className="object square-three" color={color} />
                </div>*/
            }
        </div>
    )
}

export default Loading
