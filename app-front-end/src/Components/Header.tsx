import { Box, Stack, Avatar, Typography, IconButton, } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { User } from "../core/Types";
import { getConversationDisplayName } from "../core/helper/getConversationComponent";

interface HeaderProps {
    onToggleSidebar: () => void;
    onToggleInfo: () => void;
    selectedConversation: any | null;
    currentUser: User | null;
}

const Header = ({ onToggleSidebar, onToggleInfo, selectedConversation, currentUser }: HeaderProps) => {
    console.log("Header selecterUser:", selectedConversation)
    return (
        <Box sx={{
            height: 64,
            px: 2,
            bgcolor: "#0F1C32",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
            {/* Bên trái */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton size="small" sx={{ color: "white" }} onClick={onToggleSidebar}>
                    <MenuIcon />
                </IconButton>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar src="https://i.pravatar.cc/150?img=12" sx={{ width: 40, height: 40 }} />
                    <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 700 }}>
                        {getConversationDisplayName(selectedConversation, currentUser)}
                    </Typography>
                </Stack>
            </Stack>

            {/* Bên phải */}
            <Stack direction="row" spacing={1}>
                <IconButton sx={{ color: "rgba(255,255,255,0.7)" }}>
                    <CallOutlinedIcon />
                </IconButton>
                <IconButton sx={{ color: "rgba(255,255,255,0.7)" }}>
                    <VideocamOutlinedIcon />
                </IconButton>
                <IconButton sx={{ color: "rgba(255,255,255,0.7)" }} onClick={onToggleInfo}>
                    <InfoOutlinedIcon />
                </IconButton>
            </Stack>
        </Box>
    );
};

export default Header;
