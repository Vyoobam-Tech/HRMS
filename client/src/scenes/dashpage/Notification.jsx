import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../features/notificationSlice";
import { Box, Typography } from "@mui/material";

const Notification = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notification.list);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    return (
        <Box sx={styles.wrapper}>
        <Box sx={styles.marquee}>
            {notifications .map((n, index) => (
                <Typography
                key={index}
                component="span"
                variant="h6"
                sx={styles.item}
                >
                {n.title}: {n.message} |
                </Typography>
            ))}
        </Box>

        <style>
    {`
    @keyframes marquee {
        0% {
        transform: translateX(100vw);
        }
        100% {
        transform: translateX(-100%);
        }
    }
    `}
    </style>

        </Box>
    );
    };

    const styles = {
    wrapper: {
        position: "relative",
        width: "100%",
        height: "60px",
        overflow: "hidden",
        backgroundColor: "#34495e",
        display: "flex",
        alignItems: "center",
    },
    marquee: {
        position: "absolute",
        whiteSpace: "nowrap",
        willChange: "transform",
        animation: "marquee 20s linear infinite",
    },
    item: {
        display: "inline-block",
        marginRight: "60px",
        fontWeight: 500,
        color: "#fff",
    },
};

export default Notification;
