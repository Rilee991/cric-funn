import React, { useState, useContext } from "react";
import { AppBar, Toolbar, makeStyles, Button, IconButton, SwipeableDrawer, Link, ListItem, ListItemIcon, ListItemText, Badge, Typography, Card, CardActionArea, CardContent } from "@material-ui/core";
import { Menu, Notifications, AccountCircle, ExitToApp, MonetizationOnTwoTone, AccountBalanceWalletTwoTone, TableChartOutlined, HomeRounded } from '@material-ui/icons';
import { Link as RouterLink } from "react-router-dom";
import { toUpper } from 'lodash';

import { ContextProvider } from '../../../Global/Context';
import { fontVariant, matchHeadingFontSize, themeColor } from '../../../config';

import cricFunnLogo from '../../../images/logo.png';
  
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
    const { logout, loggedInUserDetails = {}, mobileView, notifications = [], markNotificationsAsRead } = contextConsumer;
    const { username = "...", points, isAdmin = false } = loggedInUserDetails;
    const { header, toolbar, drawerContainer } = useStyles();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

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

      const handleNotificationDrawerOpen = () => {
        setNotificationDrawerOpen(true);
      }

      const handleNotificationDrawerClose = () => {
        setNotificationDrawerOpen(false);
        markNotificationsAsRead();
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
          <div style={{flexGrow:1}} />
          <div style={{display: "flex"}}>
            <IconButton aria-label="Show Notifications" color="inherit" edge="end" aria-haspopup="true" onClick={handleNotificationDrawerOpen}>
              <Badge badgeContent={notifications.length} color="secondary">
                <Notifications fontSize="large"/>
              </Badge>
            </IconButton>
          </div>

          <SwipeableDrawer
            anchor="bottom"
            open={notificationDrawerOpen}
            onClose={handleNotificationDrawerClose}
          >
            <div className={drawerContainer}>{getNotifications()}</div>
          </SwipeableDrawer>
        </Toolbar>
      );
    };
  
    const getDrawerChoices = () => {
      return (
        <>
          <Typography variant={fontVariant} style={{fontSize: 18}}>
            <b>Menu</b>
          </Typography>
          {headersData.map(({ label, href, disabled = false, onClick, icon = "" }) => {
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
        })}
        </>
      )
    };

    const getNotifications = () => {
      return (
        <>
          <Typography variant={fontVariant} style={{fontSize: 18}}>
            <b>Notifications</b>
          </Typography>
          <div>
            {notifications.length ? notifications.map(notification => {
            return (
              <Card style={{width: mobileView ? '100%' : '70%', marginBottom: "20px", backgroundColor:"lightgray", color: notification.isNoResult ? "purple" : (notification.betWon ?"green" : "red")}}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant={fontVariant} style={{fontSize: matchHeadingFontSize}} component="h2">
                      <b>{notification.title}</b>
                    </Typography>
                    <Typography variant={fontVariant} style={{fontSize: 13}} color="textSecondary" component="p">
                      <b>{notification.body}</b>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            )}) 
            : 
            <Typography gutterBottom variant={fontVariant} style={{fontSize: 13}} component="h2">
              <b>{"No New Notifications."}</b>
            </Typography>
          }
        </div>
        </>
      );
    }
  
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