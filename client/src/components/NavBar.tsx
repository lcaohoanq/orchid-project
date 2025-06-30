import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Button,
  Box,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  AccountCircle,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.context";
import { useCart } from "../contexts/cart.context";

const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu(); // Close menu before logout
    logout();
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    handleCloseNavMenu(); // Close nav menu before navigation
    navigate(path);
  };

  const handleUserNavigation = (path: string) => {
    handleCloseUserMenu(); // Close user menu before navigation
    navigate(path);
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Brand + Management Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Orchids Shop
          </Typography>

          {isAuthenticated && user?.role !== "USER" && (
            <>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
                id="nav-menu-button"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="nav-menu"
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                MenuListProps={{
                  "aria-labelledby": "nav-menu-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={() => handleNavigation("/manage/employees")}>
                  User Management
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/manage/orchids")}>
                  Orchid Management
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/manage/orders")}>
                  Order Management
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Right: Cart + User Account */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Cart">
            <IconButton onClick={() => navigate("/cart")} color="inherit">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {isAuthenticated ? (
            <>
              <Tooltip title={user?.email || "User Account"}>
                <IconButton
                  onClick={handleOpenUserMenu}
                  color="inherit"
                  id="user-menu-button"
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu
                id="user-menu"
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                MenuListProps={{
                  "aria-labelledby": "user-menu-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={() => handleUserNavigation("/my-profile")}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => handleUserNavigation("/my-orders")}>
                  My Orders
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
                <Divider />
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    Role: {user?.role}
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
