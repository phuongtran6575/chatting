import { Avatar, Box, Divider, IconButton, InputAdornment, List, ListItem, ListItemAvatar, Menu, MenuItem, TextField, Typography, } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../core/Stores/authStore";
import { useGetAllUsers, useSearchUsers } from "../core/hook/useUser";
import { useReadMe } from "../core/hook/useAuth";
import { useDebounce } from "use-debounce";
import CloseIcon from '@mui/icons-material/Close';


interface SidebarProps {
    isCollapsed: boolean;
    onSelectUser: (user: any) => void;  // 🧩 callback gửi user ra ngoài
    selectedUser: any | null;           // 🧠 user hiện đang chọn
}

const Sidebar = ({ isCollapsed, onSelectUser, selectedUser }: SidebarProps) => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const userButtonRef = useRef<HTMLDivElement | null>(null);

    const { data: profile, isLoading: isLoadingReadMe } = useReadMe();
    const [debouncedSearch] = useDebounce(searchTerm, 400);
    const { data: searchResult, isFetching } = useSearchUsers(debouncedSearch, profile?.user?.id || "", 1, 10);
    const { data: users, isLoading: isLoadingUsers } = useGetAllUsers(1, 10);

    const menuOpen = Boolean(anchorEl);
    const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(menuOpen ? null : e.currentTarget);
    };
    const handleCloseMenu = () => setAnchorEl(null);
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (isLoadingReadMe || isLoadingUsers) return <p>Loading...</p>;
    if (!profile?.user) return <p>No user found</p>;

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
                            {users?.items.map((friend: any) => (
                                <ListItem
                                    key={friend.id}
                                    onClick={() => onSelectUser(friend)}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        bgcolor:
                                            selectedUser?.id === friend.id
                                                ? "rgba(0,145,255,0.15)"
                                                : "transparent",
                                        cursor: "pointer",
                                        "&:hover": { bgcolor: "rgba(0,145,255,0.1)" },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar src={friend.avatar_url || "https://i.pravatar.cc/150?img=11"} />
                                    </ListItemAvatar>
                                    {!isCollapsed && (
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: selectedUser?.id === friend.id ? 700 : 500,
                                                color: "#fff",
                                            }}
                                        >
                                            {friend.full_name}
                                        </Typography>
                                    )}
                                </ListItem>
                            ))}
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
                        <Avatar src={profile.user.avatar_url || "https://i.pravatar.cc/150?img=15"} />
                        <Box>
                            <Typography sx={{ fontWeight: 600 }}>{profile.user.full_name}</Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                                {profile.user.email}
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
                        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                        <MenuItem onClick={handleLogout} sx={{ color: "#ff4d4d", fontWeight: 600 }}>
                            Log Out
                        </MenuItem>
                    </Menu>
                </Box>

            )}
        </Box>
    );
};

export default Sidebar;
