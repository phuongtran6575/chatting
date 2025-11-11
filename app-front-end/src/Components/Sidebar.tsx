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
    currentUser: any;
    conversations: any[];
    selectedConversation: any | null;
    selectedUser: any | null;
    onSelectConversation: (conv: any) => void;
    onSelectUser: (user: any) => void;
    refetchConversations: () => void;
}

const Sidebar = ({
    isCollapsed,
    conversations,
    currentUser,
    selectedConversation,
    selectedUser,
    onSelectConversation,
    onSelectUser,
    refetchConversations
}: SidebarProps) => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openCreateGroup, setOpenCreateGroup] = useState(false);
    const userButtonRef = useRef<HTMLDivElement | null>(null);

    const [debouncedSearch] = useDebounce(searchTerm, 400);
    const { data: searchResult, isFetching } = useSearchUsers(
        debouncedSearch,
        currentUser?.id || "",
        1,
        10
    );

    const menuOpen = Boolean(anchorEl);

    const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(menuOpen ? null : e.currentTarget);
    };

    const handleOpenCreateGroup = () => {
        setOpenCreateGroup(true);
        handleCloseMenu();
    };

    const handleCloseCreateGroup = () => {
        setOpenCreateGroup(false);
    };

    const handleCloseMenu = () => setAnchorEl(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // 👇 Helper: Tìm conversation với user cụ thể
    const findConversationWithUser = (userId: string) => {
        return conversations.find((conv: any) => {
            // Chỉ tìm trong single conversations
            if (conv.type !== "single") return false;

            // Flatten participants nếu là nested array
            const participants = Array.isArray(conv.participants[0])
                ? conv.participants.flat()
                : conv.participants;

            // Kiểm tra xem user có trong conversation không
            return participants.some((p: any) => p.id === userId);
        });
    };

    // 👇 XỬ LÝ KHI CLICK VÀO USER TRONG SEARCH RESULT
    const handleSelectUserFromSearch = (user: any) => {
        console.log("🔍 User clicked from search:", user.full_name);

        // Tìm conversation với user này
        const existingConversation = findConversationWithUser(user.id);

        if (existingConversation) {
            console.log("✅ Found existing conversation:", existingConversation.id);

            // Nếu ĐÃ có conversation → Chọn conversation đó
            onSelectConversation(existingConversation);

            // Clear search
            setIsSearching(false);
            setSearchTerm("");
        } else {
            console.log("ℹ️ No conversation found with user:", user.full_name);
            console.log("   User can start a new chat by sending a message");

            // Nếu CHƯA có conversation → Chọn user (để có thể tạo mới khi gửi tin)
            onSelectUser(user);

            // Clear search
            setIsSearching(false);
            setSearchTerm("");
        }
    };

    // Helper function để lấy tên hiển thị
    const getConversationDisplayName = (conversation: any) => {
        if (conversation.type === "group") return conversation.name;
        const other = conversation.participants?.find((p: any) => p.id !== currentUser?.id);
        return other?.full_name || "Unknown User";
    };

    const getConversationAvatar = (conversation: any) => {
        if (conversation.type === "group") return conversation.avatar_url;
        const other = conversation.participants?.find((p: any) => p.id !== currentUser?.id);
        return other?.avatar_url || "https://i.pravatar.cc/150?img=11";
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
                            <Typography sx={{ color: "rgba(255,255,255,0.5)", mt: 2 }}>
                                Searching...
                            </Typography>
                        ) : searchResult?.items?.length ? (
                            <List>
                                {searchResult.items.map((u: any) => {
                                    // 👇 Kiểm tra xem có conversation với user này không
                                    const hasConversation = !!findConversationWithUser(u.id);

                                    return (
                                        <ListItem
                                            key={u.id}
                                            onClick={() => handleSelectUserFromSearch(u)} // 👈 Dùng handler mới
                                            sx={{
                                                borderRadius: 2,
                                                mb: 1,
                                                bgcolor:
                                                    selectedUser?.id === u.id
                                                        ? "rgba(0,145,255,0.15)"
                                                        : "transparent",
                                                cursor: "pointer",
                                                position: "relative",
                                                "&:hover": { bgcolor: "rgba(0,145,255,0.1)" },
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={u.avatar_url || "https://i.pravatar.cc/150?img=20"}
                                                />
                                            </ListItemAvatar>

                                            {!isCollapsed && (
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontWeight: selectedUser?.id === u.id ? 700 : 500,
                                                            color: "#fff",
                                                        }}
                                                    >
                                                        {u.full_name}
                                                    </Typography>

                                                    {/* 👇 Badge hiển thị trạng thái */}
                                                    {hasConversation && (
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: "rgba(33, 150, 243, 0.8)",
                                                                fontSize: "0.7rem",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 0.5,
                                                                mt: 0.3
                                                            }}
                                                        >
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    width: 6,
                                                                    height: 6,
                                                                    borderRadius: "50%",
                                                                    bgcolor: "#2196f3",
                                                                }}
                                                            />
                                                            Active conversation
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </ListItem>
                                    );
                                })}
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

                                    const isSelected =
                                        (isConversation && selectedConversation?.id === item.id) ||
                                        (!isConversation && selectedUser?.id === item.id);

                                    return (
                                        <ListItem
                                            key={item.id}
                                            onClick={() =>
                                                isConversation ? onSelectConversation(item) : onSelectUser(item)
                                            }
                                            sx={{
                                                borderRadius: 2,
                                                mb: 1,
                                                bgcolor: isSelected ? "rgba(0,145,255,0.15)" : "transparent",
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
                                                        fontWeight: isSelected ? 700 : 500,
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
                currentUser={currentUser}
                onGroupCreated={() => {
                    handleCloseCreateGroup();
                    refetchConversations();
                }}
            />
        </Box>
    );
};

export default Sidebar;