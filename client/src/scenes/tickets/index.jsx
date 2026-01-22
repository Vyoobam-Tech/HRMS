import React, { useEffect, useState } from 'react'
import Header from '../../Components/Header'
import { Button, Card, CardContent, Chip, IconButton, MenuItem, TextField, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import ApplyTicketDialog from '../../Components/ApplyTicketDialog'
import { deleteTicket, fetchAllTicket, fetchTicketByEmpId, resetTicketState, updateTicketStatus } from '../../features/ticketSlice'
import { Stack } from '@mui/system'
import DeleteIcon from "@mui/icons-material/Delete";


const index = () => {

    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth);

    const { list, all } = useSelector((state) => state.ticket)

    const tickets = user?.role === "employee" ? list : all;

    useEffect(() => {
        dispatch(resetTicketState())

        if (user?.role === "employee" && user?.empid) {
            dispatch(fetchTicketByEmpId(user.empid))
        }

        if (user?.role === "admin" || user?.role === "superadmin") {
            dispatch(fetchAllTicket())
        }
    }, [dispatch, user])


    const handleDeleteTicket = (ticketId) => {
        dispatch(deleteTicket(ticketId));
    };
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
                    onClick={() => setOpen(true)}
                >
                    Raise Ticket
                </Button>
                <ApplyTicketDialog open={open} handleClose={() => setOpen(false)}/>
            </>
        )}

        <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
            TICKET REQUESTS
        </Typography>

        {tickets.length === 0 && <Typography>No tickets raised</Typography>}

        {tickets.map((ticket) => (
        <Card
            key={ticket.ticketId}
            sx={{
            mb: 3,
            boxShadow: 3,
            borderRadius: 2,
            }}
        >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>

            {/* Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={0.5}
            >
                <Typography variant="h6">
                {ticket.subject}
                </Typography>

                <Chip
                label={ticket.priority}
                size="small"
                color={
                    ticket.priority === "High"
                    ? "error"
                    : ticket.priority === "Medium"
                    ? "warning"
                    : "success"
                }
                />
            </Stack>

            {/* Description */}
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                }}
            >
                {ticket.description}
            </Typography>

            <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            >
            {/* LEFT SIDE */}
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                {(user?.role === "admin" || user?.role === "superadmin") ? (
                <TextField
                    select
                    size="small"
                    value={ticket.status}
                    onChange={(e) =>
                    dispatch(
                        updateTicketStatus({
                        id: ticket.ticketId,
                        status: e.target.value,
                        })
                    )
                    }
                    sx={{ minWidth: 120 }}
                >
                    {["Open", "In Progress", "Closed"].map((status) => (
                    <MenuItem key={status} value={status}>
                        {status}
                    </MenuItem>
                    ))}
                </TextField>
                ) : (
                <Chip
                    label={ticket.status}
                    color={
                    ticket.status === "Open"
                        ? "info"
                        : ticket.status === "In Progress"
                        ? "warning"
                        : "success"
                    }
                />
                )}

                <Chip label={ticket.category} variant="outlined" />

                <Chip
                label={new Date(ticket.createdAt).toLocaleDateString()}
                size="small"
                variant="outlined"
                />
            </Stack>

            {/* RIGHT SIDE */}
            {(user?.role === "admin" || user?.role === "superadmin") && (
                <IconButton
                color="error"
                onClick={() => handleDeleteTicket(ticket.ticketId)}
                >
                <DeleteIcon />
                </IconButton>
            )}
            </Stack>
        </CardContent>
    </Card>
        ))}


    </div>
    )
}

export default index