import {
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface ChatInfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInfoSidebar = ({ isOpen, onClose }: ChatInfoSidebarProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: isOpen ? 320 : 0,
        bgcolor: "#142033",
        height: "100vh",
        overflow: "hidden",
        transition: "width 0.3s ease",
        borderLeft: isOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}
    >
      {isOpen && (
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Thông tin liên hệ
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.7)" }}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

          {/* Avatar + Tên */}
          <Stack alignItems="center" spacing={1.5}>
            <Avatar
              src="https://i.pravatar.cc/150?img=3"
              sx={{ width: 80, height: 80 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Chef Carlo
            </Typography>
          </Stack>

          {/* Về */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{ opacity: 0.7, mb: 1, fontWeight: 600 }}
            >
              Về
            </Typography>
            <Typography
              variant="body2"
              sx={{ opacity: 0.8, lineHeight: 1.6 }}
            >
              Một người bạn đồng hành AI với tính cách độc đáo. Sẵn sàng trò chuyện về
              những đam mê và sở thích của họ.
            </Typography>
          </Box>

          {/* Phương tiện đã chia sẻ */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{ opacity: 0.7, mb: 1, fontWeight: 600 }}
            >
              Phương tiện đã chia sẻ
            </Typography>
            <Stack direction="row" spacing={1.5}>
              {[1, 2, 3].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 24,
                  }}
                >
                  🖼️
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Xóa cuộc trò chuyện */}
          <Box
            sx={{
              mt: 6,
              color: "#f87171",
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <DeleteOutlineIcon />
            <Typography variant="body1">Xóa cuộc trò chuyện</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatInfoSidebar;
