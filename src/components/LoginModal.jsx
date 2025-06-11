import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./LoginModal.css";

function LoginModal({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    window.open("/dashboard", "_blank");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper:{ className: "login-dialog" }
        }}
    >
      <DialogTitle className="login-title">Employee Login</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate className="login-form">
          <TextField label="Username" fullWidth autoFocus />
          <TextField label="Password" type="password" fullWidth />
        </Box>
      </DialogContent>
      <DialogActions className="login-actions">
        <Button onClick={onClose} className="login-cancel">
          Cancel
        </Button>
        <Button onClick={handleLogin} className="login-submit">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginModal;


