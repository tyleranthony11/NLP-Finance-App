import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import "./LoginModal.css";

function LoginModal({ open, onClose }) {
  const navigate = useNavigate();
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginRedirect({
        scopes: ["openid", "profile", "email"],
        redirectStartPage: `${window.location.origin}/dashboard`,
      });

      onClose();
      navigate("/dashboard");
    } catch (err) {
      console.error("Microsoft login failed", err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: { className: "login-dialog" },
      }}
    >
      <DialogTitle className="login-title">Employee Login</DialogTitle>

      <DialogContent>
        <Box className="login-form" sx={{ py: 1 }}>
          <Typography variant="body2">
            Continue with your Microsoft work account to access the dashboard.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions className="login-actions">
        <Button onClick={onClose} className="login-cancel">
          Cancel
        </Button>
        <Button
          onClick={handleLogin}
          className="login-submit"
          variant="contained"
        >
          Continue with Microsoft
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginModal;
