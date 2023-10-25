import 'tailwindcss/tailwind.css'
import '../styles/main.css'
import React from 'react'

import { IsSsrMobileContext } from "../utils/IsSsrMobileContext";


const App = ({ Component, pageProps }) => {
    return <IsSsrMobileContext.Provider value={pageProps.isSsrMobile}>
         <Component {...pageProps} />
    </IsSsrMobileContext.Provider>
}
export default App
