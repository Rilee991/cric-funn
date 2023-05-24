import React, { useContext } from 'react'
import Divider from '@material-ui/core/Divider';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Hidden from '@material-ui/core/Hidden';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ContextProvider } from '../../../Global/Context';

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
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));


const SideNavbar = (props) => {
  const contextConsumer = useContext(ContextProvider);
  const { mobileView } = contextConsumer;
  const classes = useStyles();

  const handleDrawerToggle = () => {
    props.setIsDrawerOpen(prev => !prev);
  };

  const drawer = (
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
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
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
                            open={props.isDrawerOpen}
                            onClose={handleDrawerToggle}
                            anchor={mobileView ? 'left' : 'left'}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </SwipeableDrawer>
                    </Hidden>
                </nav>
            </div>
        </div>
    );
}

export default SideNavbar;
