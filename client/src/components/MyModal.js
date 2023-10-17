import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { useEffect, useState } from 'react'

export function MyModal({ options }) {
    const [textArea, setTextArea] = useState('')
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (options) {
            setShow(options)
        }
    }, [options])

    const handleOnConfirm = () => {
        if (options.type == 'confirm') {
            options.onConfirm()
        }

        if (options.type == 'insert') {
            options.onConfirm(textArea)
        }

        setShow(false)
    }

    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {options?.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {options?.type == 'confirm' && <p>{options?.text}</p>}
                {options?.type == 'insert' && (
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Nuovo titolo ricerca</Form.Label>
                            <Form.Control
                                className="control"
                                as="textarea"
                                rows={3}
                                value={textArea}
                                onChange={e => setTextArea(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                )}
                {options?.type == 'content' &&
                    options?.content &&
                    options?.content()}
            </Modal.Body>
            <Modal.Footer>
                {!options?.disableButtons && (
                    <>
                        <button
                            type="button"
                            className="btn btn-outline whiteback"
                            onClick={() => setShow(false)}>
                            Annulla
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline whiteback"
                            onClick={handleOnConfirm}>
                            Conferma
                        </button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    )
}
