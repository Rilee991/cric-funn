import React, { useState, useContext } from "react";
import { AppBar, Toolbar, makeStyles, Button, IconButton, SwipeableDrawer, Link, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Menu, AccountCircle, ExitToApp, MonetizationOnTwoTone, AccountBalanceWalletTwoTone, TableChartOutlined, HomeRounded } from '@material-ui/icons';
import { Link as RouterLink } from "react-router-dom";
import { toUpper } from 'lodash';

import { ContextProvider } from '../Global/Context';
import { themeColor } from '../config';

import cricFunnLogo from '../images/logo.png';
  
const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: themeColor,
    paddingRight: "2%",
    paddingLeft: "0%",
    "@media (max-width: 900px)": {
      paddingLeft: 0,
    },
    margin: "0px 0px 50px 0px",
    width: "100%"
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between"
  },
  drawerContainer: {
    padding: "20px 20px",
  }
}));
  
  export default function Navbar() {
    const contextConsumer = useContext(ContextProvider);
    const { logout, loggedInUserDetails = {}, mobileView } = contextConsumer;
    const { username = "...", points, isAdmin = false } = loggedInUserDetails;
    const { header, toolbar, drawerContainer } = useStyles();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const headersData = [
      {
        label: toUpper(username),
        href: "/",
        onClick: closeDrawer,
        disabled: true,
        icon: (<AccountCircle color={mobileView ? "primary": "inherit"} fontSize="large"/>)
      },
      {
        label: "MY BETS",
        href: "/bets",
        onClick: closeDrawer,
        icon: (<AccountBalanceWalletTwoTone color={mobileView ? "primary": "inherit"} fontSize="large"/>)
      },
      {
        label: `${points} POINTS`,
        href: "/",
        disabled: true,
        icon: (<MonetizationOnTwoTone color="disabled" fontSize="large"/>)
      },
      {
        label: `POINTS TABLE`,
        href: "/points-table",
        onClick: closeDrawer,
        icon: (<TableChartOutlined color={mobileView ? "primary": "inherit"} fontSize="large"/>)
      },
      {
        label: "LOGOUT",
        href: "/",
        onClick: handleLogout,
        icon: (<ExitToApp color="error" fontSize="large"/>)
      }
    ];

    if(isAdmin) {
      headersData.push({
        label: `ADMIN RIGHTS`,
        href: "/admin",
        onClick: closeDrawer,
        icon: (<HomeRounded color={mobileView ? "primary": "inherit"} fontSize="large"/>)
      });
    }

    function handleLogout() {
      logout();
    }

    function closeDrawer() {
      setDrawerOpen(false);
    }
  
    const displayDesktop = () => {
      return (
        <Toolbar className={toolbar}>
          {generateCricFunnLogo}
          <div>{getMenuButtons()}</div>
        </Toolbar>
      );
    };
  
    const displayMobile = () => {
      const handleDrawerOpen = () => {
        setDrawerOpen(true);
      }

      const handleDrawerClose = () => { 
        setDrawerOpen(false);
      }
  
      return (
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-haspopup="true"
            onClick={handleDrawerOpen}
            
          >
            <Menu fontSize="large"/>
          </IconButton>
  
          <SwipeableDrawer
            anchor="bottom"
            open={drawerOpen}
            onClose={handleDrawerClose}
          >
            <div className={drawerContainer}>{getDrawerChoices()}</div>
          </SwipeableDrawer>
  
          <div>{generateCricFunnLogo}</div>
        </Toolbar>
      );
    };
  
    const getDrawerChoices = () => {
      return headersData.map(({ label, href, disabled = false, onClick, icon = "" }) => {
        return (
          <Link
            component={RouterLink}
            to={disabled ? "#" : href}
            color="inherit"
            key={label}
            style={{textDecoration: "none"}}
            onClick={onClick}
          >
            <ListItem button key={label} disabled={disabled}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        );
      });
    };
  
    const generateCricFunnLogo = (
      <Link href="/">
        <img src={cricFunnLogo} width={100} height={70}/>
      </Link>
    );
  
    const getMenuButtons = () => {
      return headersData.map(({ label, href, disabled = false, onClick, icon = "" }) => {
        return (
          <Button
            key={label}
            color="inherit"
            component={RouterLink}
            disabled={disabled}
            onClick={onClick}
            to={href}
          >
            <ListItem button key={label}>
              <ListItemIcon color="primary">{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </Button>
        );
      });
    };
  
    return (
      <header style={{height: mobileView ? "5px" : "72px"}}>
        <AppBar className={header}>
          {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
      </header>
    );
  }