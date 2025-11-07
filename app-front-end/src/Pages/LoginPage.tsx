import { Box, Button, TextField, Typography, Divider, Paper, } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import MemoryIcon from "@mui/icons-material/Memory";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../core/hook/useAuth";
import { useState } from "react";

const LoginPage = () => {
    const [form, setForm] = useState({ email: "", password: "" })
    const { mutate: login, isPending, error } = useLogin();
    const navigate = useNavigate()

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(form, {
            onSuccess: () => {
                navigate("/chatroom")
            }
        });

    };
    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#0d1117",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    width: 400,
                    p: 4,
                    borderRadius: 3,
                    bgcolor: "#161b22",
                    textAlign: "center",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                }}
            >
                {/* Logo */}
                <MemoryIcon sx={{ fontSize: 50, color: "#00aaff", mb: 2 }} />

                {/* Title */}
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: "#fff", mb: 1 }}
                >
                    Sign in to Gemini Chat
                </Typography>

                <Typography sx={{ color: "#8b949e", mb: 3 }}>
                    Don’t have an account?{" "}
                    <Link to={"/register"} style={{ color: "#00aaff", textDecoration: "none", fontWeight: "500" }}>
                        Sign in
                    </Link>
                </Typography>

                {/* Email */}
                <TextField onChange={handleChange} name="email" value={form.email}
                    fullWidth
                    label="Email address"
                    variant="outlined"
                    slotProps={{
                        input: { sx: { color: "#fff" } },
                        inputLabel: {
                            sx: {
                                color: "#8b949e",
                                "&.Mui-focused": { color: "#00aaff" },
                            },
                        },
                    }}
                    sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#30363d" },
                            "&:hover fieldset": { borderColor: "#00aaff" },
                            "&.Mui-focused fieldset": { borderColor: "#00aaff" },
                        },
                    }}
                />

                {/* Password */}
                <TextField onChange={handleChange} name="password" value={form.password}
                    fullWidth
                    type="password"
                    label="Password"
                    variant="outlined"
                    slotProps={{
                        input: { sx: { color: "#fff" } },
                        inputLabel: {
                            sx: {
                                color: "#8b949e",
                                "&.Mui-focused": { color: "#00aaff" },
                            },
                        },
                    }}
                    sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#30363d" },
                            "&:hover fieldset": { borderColor: "#00aaff" },
                            "&.Mui-focused fieldset": { borderColor: "#00aaff" },
                        },
                    }}
                />

                {/* Sign in button */}
                <Button onClick={handleLogin} disabled={isPending}
                    fullWidth
                    variant="contained"
                    sx={{
                        bgcolor: "#00aaff",
                        color: "#fff",
                        py: 1.2,
                        fontWeight: "bold",
                        mb: 3,
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#0090dd" },
                    }}
                >
                    Sign in
                </Button>

                <Divider
                    sx={{
                        my: 3,
                        color: "#8b949e",
                        fontSize: 14,
                        "&::before, &::after": {
                            borderColor: "#30363d",
                            borderTopWidth: "1px",
                        },
                    }}
                >
                    OR
                </Divider>

                {/* Google button */}
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    sx={{
                        borderColor: "#30363d",
                        color: "#c9d1d9",
                        textTransform: "none",
                        fontWeight: 500,
                        borderRadius: 2,
                        "&:hover": {
                            borderColor: "#00aaff",
                            color: "#00aaff",
                        },
                    }}
                >
                    Sign in with Google
                </Button>
            </Paper>
        </Box>
    );
}
export default LoginPage