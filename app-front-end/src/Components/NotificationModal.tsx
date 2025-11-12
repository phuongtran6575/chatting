import { Avatar, Box, Button, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Modal, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
interface Notification {
    id: string;
    type: "message" | "call" | "invite" | "general";
    title?: string;
    body?: string;
    payload?: string;
    is_read?: boolean;
    created_at?: string;
    sender?: {
        name: string;
        avatarUrl?: string;
    };
}

interface NotificationModalProps {
    open: boolean;
    onClose: () => void;
    notifications: Notification[];
    onAcceptInvite?: (id: string) => void;
    onDeclineInvite?: (id: string) => void;
}

export default function NotificationModal(props: NotificationModalProps) {
    const { open, onClose, notifications, onAcceptInvite, onDeclineInvite } = props;
    const [tab, setTab] = useState(0);

    // 👉 Tách theo loại
    const generalInvites = notifications.filter(
        (n) => n.type === "invite" || n.type === "general"
    );
    const messageCalls = notifications.filter(
        (n) => n.type === "message" || n.type === "call"
    );

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const renderList = (list: Notification[]) => {
        if (list.length === 0) {
            return (
                <Typography textAlign="center" color="text.secondary" sx={{ py: 2 }}>
                    No notifications
                </Typography>
            );
        }

        return (
            <List>
                {list.map((noti) => (
                    <ListItem
                        key={noti.id}
                        alignItems="flex-start"
                        sx={{
                            bgcolor: noti.is_read ? "#fafafa" : "#f0f8ff",
                            borderRadius: 2,
                            mb: 1,
                            p: 1.5,
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                {noti.type === "message" ? (
                                    <MessageIcon />
                                ) : noti.type === "call" ? (
                                    <PhoneIcon />
                                ) : noti.type === "invite" ? (
                                    <GroupAddIcon />
                                ) : (
                                    <NotificationsIcon />
                                )}
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                            primary={noti.title || "Notification"}
                            secondary={noti.body || ""}
                            primaryTypographyProps={{
                                fontWeight: noti.is_read ? 400 : 600,
                            }}
                        />

                        {/* Với loại invite, có thể thêm nút Accept / Decline */}
                        {noti.type === "invite" && (
                            <Box display="flex" gap={1} ml={1}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onAcceptInvite?.(noti.id)}
                                >
                                    Accept
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => onDeclineInvite?.(noti.id)}
                                >
                                    Decline
                                </Button>
                            </Box>
                        )}
                    </ListItem>
                ))}
            </List>
        );
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 420,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 2,
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                        Notifications
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Tabs */}
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="General / Invites" />
                    <Tab label="Messages / Calls" />
                </Tabs>

                <Divider sx={{ mb: 1 }} />

                {/* Nội dung tab */}
                {tab === 0 ? renderList(generalInvites) : renderList(messageCalls)}
            </Box>
        </Modal>
    );
}