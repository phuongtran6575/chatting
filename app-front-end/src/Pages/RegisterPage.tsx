import { Box, Button, Paper, TextField, Typography, Divider, } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import MemoryIcon from "@mui/icons-material/Memory";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../core/hook/useAuth";
import { useState } from "react";
import type { AxiosError } from "axios";

const RegisterPage = () => {
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();
    const { mutate: register, isPending, error } = useRegister();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        const data = {
            full_name: form.full_name,
            email: form.email,
            phone_number: form.phone_number,
            password: form.password,
            confirm_password: form.confirmPassword,
        };

        register(data, {
            onSuccess: () => {
                alert("Đăng ký thành công!");
                navigate("/login");
            },
            onError: (error) => {
                const err = error as AxiosError<{ detail?: string }>;
                alert(err.response?.data?.detail || "Đăng ký thất bại!");
            },
        });
    };

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", }}>
            <Paper elevation={6} sx={{ width: 400, p: 4, borderRadius: 3, bgcolor: "#161b22", textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", }} >
                {/* Logo */}
                <MemoryIcon sx={{ fontSize: 50, color: "#00aaff", mb: 2 }} />

                {/* Title */}
                <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff", mb: 1 }}>
                    Create your account
                </Typography>

                <Typography sx={{ color: "#8b949e", mb: 3 }}>
                    Already have an account?{" "}
                    <Link to={"/login"} style={{ color: "#00aaff", textDecoration: "none", fontWeight: "500" }}>
                        Sign in
                    </Link>
                </Typography>

                {/* Full name */}
                <TextField fullWidth label="Full name" variant="outlined" value={form.full_name} onChange={handleChange} name="full_name"
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
                    }} />

                {/* Email */}
                <TextField fullWidth label="Email address" variant="outlined" value={form.email} onChange={handleChange} name="email"
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
                <TextField fullWidth label=" Phone number" variant="outlined" value={form.phone_number} onChange={handleChange} name="phone_number"
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
                <TextField fullWidth type="password" label="Password" variant="outlined" value={form.password} onChange={handleChange} name="password"
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

                {/* Confirm Password */}
                <TextField fullWidth type="password" label="Confirm Password" variant="outlined" value={form.confirmPassword} onChange={handleChange} name="confirmPassword"
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

                {/* Sign up button */}
                <Button fullWidth variant="contained" onClick={handleRegister} disabled={isPending}
                    sx={{ bgcolor: "#00aaff", color: "#fff", py: 1.2, fontWeight: "bold", mb: 3, textTransform: "none", borderRadius: 2, "&:hover": { bgcolor: "#0090dd" }, }}>
                    Sign up
                </Button>

                {/* Divider OR */}
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

                {/* Google sign-up */}
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
                    Sign up with Google
                </Button>
            </Paper>
        </Box>
    );
}
export default RegisterPage;