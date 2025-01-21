import React from 'react';
import { Link, Outlet} from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Toolbar,
  Box,
  ListItemButton,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const Sidebar: React.FC = () => {
  return (
    <Box>
      <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1976d2',
          color: '#ffffff',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            textAlign: 'center',
            padding: '16px',
            backgroundColor: '#1565c0',
            color: '#ffffff',
          }}
        >
          Welcome to your Dashboard
        </Typography>
        <List>
          {/* Link to Products */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/products"
              sx={{
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItemButton>
          </ListItem>

          {/* Link to Add Product */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/addproduct"
              sx={{
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>
                <AddShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Add Product" />
            </ListItemButton>
          </ListItem>

          {/* Link to Customers */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/customers"
              sx={{
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Customers" />
            </ListItemButton>
          </ListItem>

          {/* Link to Add Customer */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/addcustomer"
              sx={{
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Customer" />
            </ListItemButton>
          </ListItem>

          {/* Link to Users */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/users"
              sx={{
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>

          {/* Link to Add User */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/adduser"
              sx={{
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>
                <PersonAddAltIcon />
              </ListItemIcon>
              <ListItemText primary="Add User" />
            </ListItemButton>
          </ListItem>
          {/* Link to CreateOrder */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/main/createorder"
              sx={{
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>
                <AddShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Create Order" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      </Drawer>
      <Box sx={{ flex: 1, padding: 3 }}>
      {/* Render nested routes here */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Sidebar;
