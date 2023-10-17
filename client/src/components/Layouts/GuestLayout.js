import Head from 'next/head'

const GuestLayout = ({ children }) => {
    return (
        <div>
            <Head>
                <title>Strumentale</title>
            </Head>

            <div className="font-sans text-gray-900 antialiased background-color">
                {children}
            </div>
        </div>
    )
}

export default GuestLayout
