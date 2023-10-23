import React from "react"
import styles from "../styles/applogo.module.css"

const ApplicationLogo = ({ width }) => (
    <div className={styles.applogo_container} style={{width:width}}>
       <a href="https://strumentale.it">
        <img
            src="images/strumentale.png"
            alt="Strumentale"
            style={{ width: width ? width : '20em',transform:"scale(1.5)",marginRight:20 }}
        />
    </a> 
    </div>
    
)

export default ApplicationLogo
