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

const friends = [
    { name: "Alex the Adventurer", avatar: "https://i.pravatar.cc/150?img=11" },
    { name: "Chef Carlo", avatar: "https://i.pravatar.cc/150?img=3" },
    { name: "Professor Eva", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Zen Master Kaito", avatar: "https://i.pravatar.cc/150?img=8" },
    { name: "Nina the Navigator", avatar: "https://i.pravatar.cc/150?img=9" },
    { name: "RoboSensei", avatar: "https://i.pravatar.cc/150?img=10" },
];

interface SidebarProps {
    isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    // 🧠 State
    const [selected, setSelected] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const userButtonRef = useRef<HTMLDivElement | null>(null);

    // 🧩 Hooks
    const { data: profile, isLoading: isLoadingReadMe, error: errorReadMe } = useReadMe();
    const isReady = !!profile?.user?.id;
    const [debouncedSearch] = useDebounce(searchTerm, 400);
    const { data: searchResult, isFetching } = useSearchUsers(debouncedSearch, isReady ? profile.user.id : "", 1, 10);
    const { data: users, isLoading: isLoadingUsers, error: errorUSers } = useGetAllUsers(1, 10);

    useEffect(() => {
        console.log("🔍 search term:", debouncedSearch);
        console.log("👤 current user id:", profile?.user?.id);
        console.log("📊 search result:", searchResult?.items);
    }, [debouncedSearch, profile?.user?.id, searchResult]);

    // 🧮 Filter friends (local)
    const filteredFriends = useMemo(
        () => friends.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [searchTerm]
    );

    // 🧭 Dropdown menu
    const menuOpen = Boolean(anchorEl);
    const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(menuOpen ? null : e.currentTarget);
    };
    const handleCloseMenu = () => setAnchorEl(null);
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (isLoadingReadMe || isLoadingUsers) return <p>Loading profile...</p>;
    if (errorReadMe || errorUSers) return <p>Error loading profile</p>;
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
            {/* 🔍 Search Bar */}
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
                        // ❌ XÓA onBlur (để không tự thoát search mode)
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "rgba(255,255,255,0.6)" }} />
                                </InputAdornment>
                            ),
                            // ✅ Nút X để thoát search mode
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

            {/* 🧑‍🤝‍🧑 Friends or Search Results */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    px: isCollapsed ? 0.5 : 2,
                    py: 2,
                    transition: "all 0.3s ease",
                }}
            >
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
                                        onClick={() => {
                                            // ❗ KHÔNG thoát search mode ở đây nữa
                                            setSelected(u.full_name);
                                        }}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            bgcolor:
                                                selected === u.full_name ? "rgba(0, 145, 255, 0.15)" : "transparent",
                                            transition: "0.3s",
                                            cursor: "pointer",
                                            justifyContent: isCollapsed ? "center" : "flex-start",
                                            "&:hover": { bgcolor: "rgba(0, 145, 255, 0.1)" },
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={u.avatar_url || "https://i.pravatar.cc/150?img=20"} />
                                        </ListItemAvatar>
                                        {!isCollapsed && (
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: selected === u.full_name ? 700 : 500,
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
                                sx={{
                                    color: "rgba(255,255,255,0.6)",
                                    textAlign: "center",
                                    mt: 2,
                                }}
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
                            {users?.items.map((friend) => {
                                const isSelected = selected === friend.full_name;
                                return (
                                    <ListItem
                                        key={friend.full_name}
                                        onClick={() => setSelected(friend.full_name)}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            bgcolor: isSelected ? "rgba(0, 145, 255, 0.15)" : "transparent",
                                            transition: "0.3s",
                                            cursor: "pointer",
                                            justifyContent: isCollapsed ? "center" : "flex-start",
                                            "&:hover": { bgcolor: "rgba(0, 145, 255, 0.1)" },
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={"https://i.pravatar.cc/150?img=11"} />
                                        </ListItemAvatar>
                                        {!isCollapsed && (
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: isSelected ? 700 : 500,
                                                    color: "#fff",
                                                }}
                                            >
                                                {friend.full_name}
                                            </Typography>
                                        )}
                                    </ListItem>
                                );
                            })}
                        </List>
                    </>
                )}
            </Box>

            {/* 👤 Footer user menu */}
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
                        <Avatar src="https://i.pravatar.cc/150?img=15" />
                        <Box>
                            <Typography sx={{ fontWeight: 600 }}>{profile.user.full_name}</Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "rgba(255,255,255,0.6)",
                                    fontSize: 12,
                                }}
                            >
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
