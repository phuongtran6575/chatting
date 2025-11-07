import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Checkbox, List, ListItem, ListItemText } from "@mui/material";

const CreateGroupModal = ({ open, onClose, allUsers, currentUser }: any) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");
    const { mutateAsync: createGroup } = useCreateGroupConversation();

    const handleToggle = (id: string) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handleCreate = async () => {
        if (!groupName.trim() || selected.length < 2) return;
        await createGroup({
            creator_id: currentUser.id,
            member_ids: selected,
            group_name: groupName,
        });
        onClose();
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
                    {allUsers.map((u: any) => (
                        <ListItem key={u.id} onClick={() => handleToggle(u.id)} button>
                            <Checkbox checked={selected.includes(u.id)} />
                            <ListItemText primary={u.full_name} />
                        </ListItem>
                    ))}
                </List>
                <Button fullWidth variant="contained" onClick={handleCreate}>
                    Tạo nhóm
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGroupModal;
