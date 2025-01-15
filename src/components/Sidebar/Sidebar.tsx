import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Toolbar,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1976d2', // Primary blue color
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
            backgroundColor: '#1565c0', // Darker blue for header
            color: '#ffffff',
          }}
        >
          Welcome to your Dashboard
        </Typography>
        <List>
          <ListItem
            sx={{
              '&:hover': {
                backgroundColor: '#1565c0', // Highlight on hover
              },
            }}
          >
            <ListItemIcon sx={{ color: '#ffffff' }}>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem
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
          </ListItem>
          <ListItem
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
          </ListItem>
          <ListItem
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
          </ListItem>
          <ListItem
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
          </ListItem>
          <ListItem
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
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
