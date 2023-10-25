import React from 'react'
import styles from '../styles/applogo.module.css'

const ApplicationLogo = ({ width }) => (
    <div className={styles.applogo_container} style={{ width: width }}>
        <a href="https://strumentale.it" target="_blank" rel="noreferrer">
            <img
                src="images/strumentale.png"
                alt="Strumentale"
                className={styles.logo}
            />
        </a>
    </div>
)

export default ApplicationLogo
