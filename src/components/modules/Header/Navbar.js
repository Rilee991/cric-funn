import React, { useState, useContext } from "react";
import { AppBar, Toolbar, makeStyles, Button, IconButton, SwipeableDrawer, Link, ListItem, ListItemIcon, 
  ListItemText, Badge, Typography, Card, CardActionArea, CardContent } from "@material-ui/core";
import { MenuOpenRounded, AccountCircle, ExitToAppRounded, ListAltRounded, InsertChartRounded, 
  SettingsRounded, NotificationsActiveSharp, CasinoRounded, InsertChartTwoTone } from '@material-ui/icons';
import { Link as RouterLink } from "react-router-dom";

import { ContextProvider } from '../../../Global/Context';
import { fontVariant, matchHeadingFontSize, themeColor } from '../../../config';

import cricFunnLogo from '../../../images/logo.png';
  
const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: themeColor,
    paddingRight: "1%",
    paddingLeft: "0%",
    "@media (max-width: 900px)": {
      paddingLeft: 0,
    },
    margin: "0px 0px 50px 0px",
    width: "100%",
    maxHeight: "auto"
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between"
  },
  drawerContainer: {
    padding: "20px 20px",
  }
}));
  
const Navbar = () => {
  const contextConsumer = useContext(ContextProvider);
  const { logout, loggedInUserDetails = {}, mobileView, notifications = [], markNotificationsAsRead } = contextConsumer;
  const { username = "...", points, isAdmin = false } = loggedInUserDetails;
  const { header, toolbar, drawerContainer } = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
  }

  const closeDrawer = () => {
    setDrawerOpen(false);
  }

  const headersData = [{
    label: `${username} (${points} POINTS)`,
    href: "/",
    onClick: closeDrawer,
    icon: (<AccountCircle style={{ color: mobileView ? themeColor : "inherit" }} fontSize="default" />)
  }, {
    label: "MY BETS",
    href: "/bets",
    onClick: closeDrawer,
    icon: (<CasinoRounded style={{ color: mobileView ? themeColor : "inherit" }} fontSize="default"/>)
  }, {
    label: `STATS`,
    href: "/points",
    disabled: false,
    onClick: closeDrawer,
    icon: (<InsertChartRounded style={{ color: mobileView ? themeColor : "inherit" }} fontSize="default"/>)
  }, 
  // {
  //   label: `GLOBAL STATS`,
  //   href: "/global-stats",
  //   disabled: false,
  //   onClick: closeDrawer,
  //   icon: (<InsertChartTwoTone style={{ color: mobileView ? themeColor : "inherit" }} fontSize="default"/>)
  // }, 
  {
    label: `POINTS TABLE`,
    href: "/points-table",
    onClick: closeDrawer,
    icon: (<ListAltRounded style={{ color: mobileView ? themeColor : "inherit" }} fontSize="default"/>)
  }, {
    label: "LOGOUT",
    href: "/",
    onClick: handleLogout,
    icon: (<ExitToAppRounded style={{ color: mobileView ? themeColor : "inherit" }} fontSize="default"/>)
  }];

  if(isAdmin) {
    headersData.push({
      label: `Actions`,
      href: "/admin",
      onClick: closeDrawer,
      icon: (<SettingsRounded style={{ color: mobileView ? themeColor : "inherit" }} fontSize="default"/>)
    });
  }

  const displayDesktop = () => {
    return (
      <Toolbar className={toolbar}>
        {getCricFunnLogo}
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
        <SwipeableDrawer
          anchor="bottom"
          open={drawerOpen}
          onClose={handleDrawerClose}
        >
          <div className={drawerContainer}>{getDrawerChoices()}</div>
        </SwipeableDrawer>

        <div>{getCricFunnLogo}</div>
        <div style={{ flexGrow:1 }} />
        <div style={{ display: "flex" }}>
          <IconButton 
            aria-label="Show Notifications"
            color="inherit"
            edge="end"
            aria-haspopup="true"
            onClick={handleNotificationDrawerOpen}
            style={{ marginLeft: "6%", marginRight: "3%" }}
          >
            <Badge badgeContent={notifications.length} color="secondary">
              <NotificationsActiveSharp fontSize="large"/>
            </Badge>
          </IconButton>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-haspopup="true"
            onClick={handleDrawerOpen}
          >
            <MenuOpenRounded fontSize="large"/>
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
            <ListItem style={{ paddingLeft: "2%" }} button key={label} disabled={disabled}>
              <ListItemIcon style={{ minWidth: "35px" }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        );
      })}
      </>
    );
  };

  const getNotifications = () => {
    return (
      <>
        <Typography variant={"button"} style={{fontSize: 18}}>
          <b>Notifications</b>
        </Typography>
        <div> {
          notifications.length ? notifications.map(notification => {
            return (
              <Card style={{width: mobileView ? '100%' : '70%', marginBottom: "20px", backgroundColor:"lightgray", color: notification.isNoResult ? "purple" : (notification.betWon ? "green" : "red")}}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant={fontVariant} style={{fontSize: matchHeadingFontSize}} component="h2">
                      <b>{notification.title}</b>
                    </Typography>
                    <Typography variant={"caption"} style={{fontSize: 13}} color="textSecondary" component="p">
                      <b>{notification.body}</b>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            )
          }) : 
          <Typography gutterBottom variant={"button"} style={{fontSize: 13}} component="h2">
            <b>{"No New Notifications."}</b>
          </Typography>
        } </div>
      </>
    );
  }

  const getCricFunnLogo = (
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
          style={{ textTransform:"none" }}
        >
          <ListItem button key={label}>
            <ListItemIcon style={{ color: "white", minWidth: "2vw" }}>{icon}</ListItemIcon>
            <ListItemText disableTypography={true} style={{ color: "white" }} primary={label} />
          </ListItem>
        </Button>
      );
    });
  };

  return (
    <header style={{ minHeight: mobileView ? "1vh" : "15vh" }}>
      <AppBar className={header}>
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </header>
  );
}


export default Navbar;
