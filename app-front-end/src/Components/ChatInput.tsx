import {
    Box,
    TextField,
    IconButton,
    InputAdornment,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import EmojiEmotionsRoundedIcon from "@mui/icons-material/EmojiEmotionsRounded";

const ChatInput = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#0d1627",
                p: 2,
                borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
        >
            {/* Ô nhập tin nhắn */}
            <TextField
                fullWidth
                placeholder="Nhắn tin với Alex the Adventurer..."
                variant="outlined"
                InputProps={{
                    sx: {
                        bgcolor: "#2c3e55",
                        borderRadius: 50,
                        color: "#cfd8dc",
                        px: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                    },
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton size="small" sx={{ color: "#90a4ae" }}>
                                <EmojiEmotionsRoundedIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {/* Nút gửi tin nhắn */}
            <IconButton
                sx={{
                    ml: 1.5,
                    bgcolor: "#3b4a63",
                    color: "#fff",
                    p: 1.2,
                    borderRadius: "50%",
                    "&:hover": {
                        bgcolor: "#4a5d7a",
                    },
                }}
            >
                <SendRoundedIcon />
            </IconButton>
        </Box>
    );
}
export default ChatInput;