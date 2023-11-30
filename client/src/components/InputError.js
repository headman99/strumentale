const InputError = ({ messages, className = '' }) => (
    <>
            <p className={`${className} text-sm text-red-600`}>
                {messages}
            </p>        
    </>
)

export default InputError
