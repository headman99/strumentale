import * as React from 'react'
import Box from '@mui/material/Box'
import { Alert, AlertTitle } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'

export default function TransitionAlerts({ options, style }) {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        if (options) {
            setOpen(true)
            const delay = 4000 // 4 seconds in milliseconds
            const wait = async () => {
                await new Promise(resolve => {
                    setTimeout(() => {
                        setOpen(false)
                        resolve()
                    }, delay)
                })
            }

            wait()
        }
    }, [options])

    return (
        <Box
            sx={{
                ...style,
                width: '100%',
                zIndex: open ? 1 : -1,
                position: 'fixed',
                top: 0
            }}>
            <Collapse in={open}>
                <Alert
                    severity={options?.severity ? options.severity : 'info'}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false)
                            }}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}>
                    <AlertTitle>{options?.title}</AlertTitle>
                    {options?.text}
                </Alert>
            </Collapse>
        </Box>
    )
}
