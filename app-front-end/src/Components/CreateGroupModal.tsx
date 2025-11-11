import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Checkbox, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { useGetAllUsers } from "../core/hook/useUser";
import { useCreateGroupConversation } from "../core/hook/useConversation";

interface CreateGroupModalProps {
    open: boolean;
    onClose: () => void;
    currentUser: any;
    onGroupCreated?: (newGroup: any) => void;
}

const CreateGroupModal = ({ open, onClose, currentUser, onGroupCreated }: CreateGroupModalProps) => {
    const { data: listUser } = useGetAllUsers();

    const [selected, setSelected] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");

    // ✅ Hook tạo group
    const createGroupMutation = useCreateGroupConversation(
        currentUser?.id,
        selected,
        groupName
    );

    const handleToggle = (id: string) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handleCreate = async () => {
        if (!groupName.trim()) {
            alert("Vui lòng nhập tên nhóm!");
            return;
        }
        if (selected.length < 2) {
            alert("Cần ít nhất 2 thành viên để tạo nhóm!");
            return;
        }

        try {
            const newGroup = await createGroupMutation.mutateAsync(); // gọi API
            alert("Tạo nhóm thành công!");
            onClose();
            onGroupCreated?.(newGroup); // ✅ báo ngược cho Sidebar biết nhóm mới
        } catch (error) {
            console.error("Lỗi tạo nhóm:", error);
            alert("Không thể tạo nhóm, vui lòng thử lại.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Tạo nhóm chat</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Tên nhóm"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <List>
                    {listUser?.items.map((u: any) => (
                        <ListItem key={u.id} disablePadding>
                            <ListItemButton onClick={() => handleToggle(u.id)}>
                                <Checkbox checked={selected.includes(u.id)} />
                                <ListItemText primary={u.full_name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleCreate}
                    disabled={createGroupMutation.isPending}
                >
                    {createGroupMutation.isPending ? "Đang tạo..." : "Tạo nhóm"}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGroupModal;