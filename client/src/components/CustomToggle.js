import { useAccordionButton } from 'react-bootstrap/AccordionButton'

function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!')
    )

    return (
        <button
            type="button"
            style={{ backgroundColor: 'pink', padding: 10 }}
            onClick={decoratedOnClick}>
            {children}
        </button>
    )
}

export default CustomToggle
