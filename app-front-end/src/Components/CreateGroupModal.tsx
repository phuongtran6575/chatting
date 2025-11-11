import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Checkbox, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { useGetAllUsers } from "../core/hook/useUser";

interface CreateGroupModal {

}

const CreateGroupModal = ({ open, onClose, currentUser, handleCreate }: any) => {
    const { data: listUser } = useGetAllUsers()
    const [selected, setSelected] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");

    const handleToggle = (id: string) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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
                <Button fullWidth variant="contained" onClick={handleCreate}>
                    Tạo nhóm
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGroupModal;
