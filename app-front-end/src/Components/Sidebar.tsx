import { Avatar, Box, Divider, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, TextField, Typography, } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../core/Stores/authStore";
import { useGetAllUsers, useSearchUsers } from "../core/hook/useUser";
import { useDebounce } from "use-debounce";
import CloseIcon from '@mui/icons-material/Close';
import { useGetUserConversations } from "../core/hook/useConversation";
import type { User } from "../core/Types";
import CreateGroupModal from "./CreateGroupModal";


interface SidebarProps {
    isCollapsed: boolean;
    onSelectUser: (user: any) => void;  // 🧩 callback gửi user ra ngoài
    selectedUser: any | null;           // 🧠 user hiện đang chọn
    currentUser: User | null;
    conversations: any | null
}

const Sidebar = ({ isCollapsed, onSelectUser, selectedUser, currentUser, conversations }: SidebarProps) => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openCreateGroup, setOpenCreateGroup] = useState(false);
    const userButtonRef = useRef<HTMLDivElement | null>(null);

    const [debouncedSearch] = useDebounce(searchTerm, 400);
    const { data: searchResult, isFetching } = useSearchUsers(debouncedSearch, currentUser?.id || "", 1, 10);
    //console.log("Conversations in Sidebar:", conversations);

    const menuOpen = Boolean(anchorEl);
    const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(menuOpen ? null : e.currentTarget);
    };

    const handleOpenCreateGroup = () => {
        setOpenCreateGroup(true); // ✅ mở modal
        handleCloseMenu(); // đóng menu
    };

    const handleCloseCreateGroup = () => {
        setOpenCreateGroup(false); // ✅ đóng modal
    };

    const handleCreateGroup = () => {
        // 🧩 Xử lý tạo nhóm ở đây
        console.log("Creating group...");
        handleCloseCreateGroup();
    };

    const handleCloseMenu = () => setAnchorEl(null);
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    // Helper function để lấy tên hiển thị
    const getConversationDisplayName = (conversation: any) => {
        if (conversation.type === 'group') {
            return conversation.name;
        }
        // Với single chat, tìm participant không phải current user
        const otherParticipant = conversation.participants?.find(
            (p: any) => p.id !== currentUser?.id
        );
        // console.log("Other Participant:", otherParticipant);
        return otherParticipant?.full_name || 'Unknown User';
    };

    // Helper function để lấy avatar
    const getConversationAvatar = (conversation: any) => {
        if (conversation.type === 'group') {
            return conversation.avatar_url || "https://i.pravatar.cc/150?img=11";
        }

        // Với single chat, lấy avatar của người còn lại
        const otherParticipant = conversation.participants?.find(
            (p: any) => p.id !== currentUser?.id
        );

        return otherParticipant?.avatar_url || "https://i.pravatar.cc/150?img=11";
    };


    return (
        <Box
            sx={{
                width: isCollapsed ? 80 : 280,
                height: "100vh",
                bgcolor: "#0d1627",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                transition: "width 0.3s ease",
            }}
        >
            {/* 🔍 Search bar */}
            {!isCollapsed && (
                <Box sx={{ p: 2, pb: 0 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search users..."
                        size="small"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsSearching(true)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "rgba(255,255,255,0.6)" }} />
                                </InputAdornment>
                            ),
                            endAdornment: isSearching && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setIsSearching(false);
                                            setSearchTerm("");
                                        }}
                                        sx={{
                                            color: "rgba(255,255,255,0.6)",
                                            "&:hover": { color: "#fff" },
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                bgcolor: "rgba(255,255,255,0.1)",
                                color: "#fff",
                                "& fieldset": { borderColor: "transparent" },
                                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                "&.Mui-focused fieldset": { borderColor: "#2196f3" },
                            },
                            input: { color: "#fff" },
                            "& input::placeholder": { color: "rgba(255,255,255,0.6)" },
                        }}
                    />
                </Box>
            )}

            {/* Danh sách người dùng */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", p: isCollapsed ? 0.5 : 2 }}>
                {isSearching && searchTerm ? (
                    <>
                        <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                            Search Results
                        </Typography>

                        {isFetching ? (
                            <Typography sx={{ color: "rgba(255,255,255,0.5)", mt: 2 }}>Searching...</Typography>
                        ) : searchResult?.items?.length ? (
                            <List>
                                {searchResult.items.map((u: any) => (
                                    <ListItem
                                        key={u.id}
                                        onClick={() => onSelectUser(u)} // 🧩 click → gửi user ra cha
                                        sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            bgcolor:
                                                selectedUser?.id === u.id ? "rgba(0,145,255,0.15)" : "transparent",
                                            cursor: "pointer",
                                            "&:hover": { bgcolor: "rgba(0,145,255,0.1)" },
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={u.avatar_url || "https://i.pravatar.cc/150?img=20"} />
                                        </ListItemAvatar>
                                        {!isCollapsed && (
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: selectedUser?.id === u.id ? 700 : 500,
                                                    color: "#fff",
                                                }}
                                            >
                                                {u.full_name}
                                            </Typography>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography
                                variant="body2"
                                sx={{ color: "rgba(255,255,255,0.6)", textAlign: "center", mt: 2 }}
                            >
                                No users found
                            </Typography>
                        )}
                    </>
                ) : (
                    <>
                        <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                            Friends
                        </Typography>

                        <List>
                            {conversations.length > 0 ? (
                                conversations.map((item: any) => {
                                    const isConversation = !!item.participants;
                                    const displayName = isConversation
                                        ? getConversationDisplayName(item)
                                        : item.full_name;
                                    const avatar = isConversation
                                        ? getConversationAvatar(item)
                                        : item.avatar_url || "https://i.pravatar.cc/150?img=10";

                                    return (
                                        <ListItem
                                            key={item.id}
                                            onClick={() => onSelectUser(item)}
                                            sx={{
                                                borderRadius: 2,
                                                mb: 1,
                                                bgcolor:
                                                    selectedUser?.id === item.id
                                                        ? "rgba(0,145,255,0.15)"
                                                        : "transparent",
                                                cursor: "pointer",
                                                "&:hover": { bgcolor: "rgba(0,145,255,0.1)" },
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={avatar} />
                                            </ListItemAvatar>
                                            {!isCollapsed && (
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: selectedUser?.id === item.id ? 700 : 500,
                                                        color: "#fff",
                                                    }}
                                                >
                                                    {displayName}
                                                </Typography>
                                            )}
                                        </ListItem>
                                    );
                                })
                            ) : (
                                <Typography sx={{ color: "#fff", textAlign: "center", mt: 2 }}>
                                    No conversations or friends
                                </Typography>
                            )}
                        </List>
                    </>
                )}
            </Box>

            {/* Footer user info */}
            {!isCollapsed && (
                <Box
                    ref={userButtonRef}
                    onClick={handleToggleMenu}
                    sx={{
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: menuOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
                        cursor: "pointer",
                        transition: "0.3s",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar src={"https://i.pravatar.cc/150?img=15"} />
                        <Box>
                            <Typography sx={{ fontWeight: 600 }}>{currentUser?.full_name}</Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                                {currentUser?.email}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        size="small"
                        sx={{
                            color: "#fff",
                            transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "0.3s",
                        }}
                    >
                        <ExpandLessIcon />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                        PaperProps={{
                            sx: {
                                bgcolor: "#152238",
                                color: "#fff",
                                borderRadius: 2,
                                minWidth: 220,
                                boxShadow: "0 -4px 12px rgba(0,0,0,0.3)",
                                p: 1,
                            },
                        }}
                    >
                        <MenuItem onClick={handleCloseMenu}>My Account</MenuItem>
                        <MenuItem onClick={handleCloseMenu}>Settings</MenuItem>
                        <MenuItem onClick={handleOpenCreateGroup}>Create Group</MenuItem>
                        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                        <MenuItem onClick={handleLogout} sx={{ color: "#ff4d4d", fontWeight: 600 }}>
                            Log Out
                        </MenuItem>
                    </Menu>
                </Box>

            )}
            <CreateGroupModal
                open={openCreateGroup}
                onClose={handleCloseCreateGroup}
                allUsers={[]} // truyền danh sách user ở đây nếu có
                currentUser={currentUser}
                handleCreate={handleCreateGroup}
            />
        </Box>
    );
};

export default Sidebar;
