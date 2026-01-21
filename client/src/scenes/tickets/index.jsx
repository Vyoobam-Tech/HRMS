import React from 'react'
import Header from '../../Components/Header'
import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

const index = () => {

    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth);

  return (
    <div
        style={{
        minHeight: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
        }}
    >

        {user?.role === "employee" && (
            <>
                <Header title="TICKETS"/>
                <Button
                    variant='contained'
                    color='primary'
                >
                    Raise Ticket
                </Button>
            </>
        )}

        <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
            TICKET REQUESTS
        </Typography>
    </div>
  )
}

export default index