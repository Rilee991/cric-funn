import { AppBar, Toolbar, Avatar, makeStyles, Button, IconButton, Drawer, SwipeableDrawer, Link, MenuItem, Grid, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { deepPurple } from '@material-ui/core/colors';
import React, { useState, useEffect, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { toUpper } from 'lodash';
import { AccountCircle, ExitToApp, MonetizationOnTwoTone, AccountBalanceWalletTwoTone, TableChart, HomeRounded } from '@material-ui/icons';

import { ContextProvider } from '../Global/Context';
import CricFunnLogo from '../images/logo1.png';
  
  const useStyles = makeStyles(() => ({
    header: {
      backgroundColor: "#400CCC",
      paddingRight: "79px",
      paddingLeft: "118px",
      "@media (max-width: 900px)": {
        paddingLeft: 0,
      },
    },
    logo: {
      fontFamily: "Work Sans, sans-serif",
      fontWeight: 600,
      color: "#FFFEFE",
      textAlign: "left",
    },
    menuButton: {
      fontFamily: "Open Sans, sans-serif",
      fontWeight: 700,
      size: "18px",
      marginLeft: "38px",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
    },
    drawerContainer: {
      padding: "20px 30px",
    },
    paper: {
        background: 'lightgrey'
    }
  }));
  
  export default function Navbar() {
    const contextConsumer = useContext(ContextProvider);
    const { logout, loggedInUserDetails = {} } = contextConsumer;
    const { username = "...", points, isAdmin = false } = loggedInUserDetails;
    const { header, logo, menuButton, toolbar, drawerContainer, paper } = useStyles();
    const [state, setState] = useState({
      mobileView: false,
      drawerOpen: false,
    });
  
    const { mobileView, drawerOpen } = state;

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
        icon: (<TableChart color={mobileView ? "primary": "inherit"} fontSize="large"/>)
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
  
    useEffect(() => {
      const setResponsiveness = () => {
        
        return window.innerWidth < 900
          ? setState((prevState) => ({ ...prevState, mobileView: true }))
          : setState((prevState) => ({ ...prevState, mobileView: false }));
      };
  
      setResponsiveness();
  
      window.addEventListener("resize", () => setResponsiveness());
    }, []);

    function handleLogout() {
      logout();
    }

    function closeDrawer() {
      setState({...state, drawerOpen: false});
    }
  
    const displayDesktop = () => {
      return (
        <Toolbar className={toolbar}>
          {cricFunnLogo}
          <div>{getMenuButtons()}</div>
        </Toolbar>
      );
    };
  
    const displayMobile = () => {
      const handleDrawerOpen = () =>
        setState((prevState) => ({ ...prevState, drawerOpen: true }));
      const handleDrawerClose = () =>
        setState((prevState) => ({ ...prevState, drawerOpen: false }));
  
      return (
        <Toolbar>
          <IconButton
            {...{
              edge: "start",
              color: "inherit",
              "aria-label": "menu",
              "aria-haspopup": "true",
              onClick: handleDrawerOpen,
            }}
          >
            <MenuIcon />
          </IconButton>
  
          <SwipeableDrawer
            {...{
              anchor: "left",
              open: drawerOpen,
              onClose: handleDrawerClose
            }}
            classes = {{paper: paper}}
          >
            <div className={drawerContainer}>{getDrawerChoices()}</div>
          </SwipeableDrawer>
  
          <div>{cricFunnLogo}</div>
        </Toolbar>
      );
    };
  
    const getDrawerChoices = () => {
      return headersData.map(({ label, href, disabled = false, onClick, icon = "" }) => {
        return (
          <Link
            {...{
              component: RouterLink,
              to: href,
              color: "inherit",
              style: { textDecoration: "none" },
              key: label,
            }}
            onClick = {onClick}
          >
            <ListItem button key={label}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        );
      });
    };
  
    const cricFunnLogo = (
      <Link href="/">
        <img src={CricFunnLogo} width={90} height={60}/>
      </Link>
    );
  
    const getMenuButtons = () => {
      return headersData.map(({ label, href, disabled = false, onClick, icon = "" }) => {
        return (
          <Button
            {...{
              key: label,
              color: "inherit",
              to: href,
              component: RouterLink,
              className: menuButton,
              disabled: disabled,
              onClick: onClick
            }}
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
      <header>
        <AppBar className={header}>
          {mobileView ? displayMobile() : displayDesktop()}
        </AppBar>
      </header>
    );
  }