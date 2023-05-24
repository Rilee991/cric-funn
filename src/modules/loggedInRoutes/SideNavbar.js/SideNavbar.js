import React, { useContext } from 'react'
import Divider from '@material-ui/core/Divider';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Hidden from '@material-ui/core/Hidden';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ContextProvider } from '../../../Global/Context';
import './SideNavbar.css';
import { BubbleChartOutlined, PublicOutlined, StarBorderOutlined, StarsOutlined, TimelineOutlined, VpnKey, Whatshot, WhatshotOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.gutters,
  drawerPaper: {
    width: drawerWidth,
    linearGradient: "linear-gradient(45deg, #1634d6, black)"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));


const SideNavbar = (props) => {
    const { setIsDrawerOpen, isDrawerOpen } = props;
    const contextConsumer = useContext(ContextProvider);
    const { mobileView } = contextConsumer;
    const classes = useStyles();

    const handleDrawerToggle = () => {
        setIsDrawerOpen(prev => !prev);
    };

    const getNavItems = () => {
        const navItems = [{
            id: 1,
            name: "Home",
            to: "/",
            icon: <WhatshotOutlined />
        }, {
            id: 2,
            name: "My Bets",
            to: "/my-bets",
            icon: <TimelineOutlined />
        }, {
            id: 3,
            name: "Graphs",
            to: "/graphs",
            icon: <BubbleChartOutlined />
        }, {
            id: 4,
            name: "Global Stats",
            to: "/global-stats",
            icon: <PublicOutlined />
        }, {
            id: 5,
            name: "Points Table",
            to: "/points-table",
            icon: <StarBorderOutlined />
        }, {
            id: 6,
            name: "Logout",
            to: "/",
            onClick: () => {console.log("3")},
            icon: <VpnKey />
        }];

        return navItems;
    }

    const getDrawerItems = () => (
        <div className="tw-flex tw-flex-col tw-z-0">
            <div className="tw-flex tw-justify-center tw-h-[62px] tw-items-center">
                <Typography style={{fontSize: 18}}>
                    <b>MENU</b>
                </Typography>
            </div>
            {/* <div className={classes.toolbar} /> */}
            <Divider />
            <div>
                <List>
                    {getNavItems().map((item, index) => (
                        <Link to={item.to} key={item.id}>
                            <ListItem button key={item.name}>
                                <ListItemIcon className="neon">
                                    {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText className={index%2 == 0 ? "neon" : "neon-reverse"} primary={item.name} />
                            </ListItem>
                        </Link>
                    ))}
                </List>
                <Divider />
            </div>
        </div>
    );

    return (
        <div>
            <div>
                <nav className={`${classes.drawer} tw-z-0`} aria-label="mailbox folders">
                    <Hidden smDown implementation="css">
                        <SwipeableDrawer
                            classes={{
                                paper: classes.drawerPaper
                            }}
                            className={`tw-w-full`}
                            variant={mobileView ? "temporary" : "permanent"}
                            open={isDrawerOpen}
                            onClose={handleDrawerToggle}
                            anchor={mobileView ? 'left' : 'left'}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {getDrawerItems()}
                        </SwipeableDrawer>
                    </Hidden>
                </nav>
            </div>
        </div>
    );
}

export default SideNavbar;
