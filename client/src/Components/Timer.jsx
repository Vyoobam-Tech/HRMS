import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'

const Timer = () => {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    },[])

    const formatTime = (date) => {
        const h = String(date.getHours()).padStart(2,"0")
        const m = String(date.getMinutes()).padStart(2,"0")
        const s = String(date.getSeconds()).padStart(2,"0")
        return `${h}:${m}:${s}`
    }
  return (
    <Box fontWeight="bold" fontSize={20} color="#34495e">
        {formatTime(currentTime)}
    </Box>
  )
}

export default Timer