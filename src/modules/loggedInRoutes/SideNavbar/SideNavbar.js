import React from 'react'
import { Divider, SwipeableDrawer, Hidden, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography } from '@material-ui/core';
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
    background: "black"//"linear-gradient(45deg, #1634d6, black)"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));


const SideNavbar = (props) => {
    const { setIsNavOpen, isNavOpen, navSelected, navItems, setNavSelected, mobileView } = props;
    const classes = useStyles();

    const handleDrawerToggle = () => {
        setIsNavOpen(prev => !prev);
    }

    const onClickNavItem = (item) => {
        setNavSelected(item.id);
        setIsNavOpen(false);
        item.onClick && item.onClick();
    }

    const getDrawerItems = () => (
        <div className="tw-flex tw-flex-col tw-z-0">
            <div className="tw-flex tw-justify-center tw-h-[62px] tw-items-center">
                <Typography style={{fontSize: 18}}>
                    <b>MENU</b>
                </Typography>
            </div>
            <Divider />
            <div>
                <List>
                    {navItems.map((item, index) => (
                        <Link to={item.to} key={item.id} onClick={() => onClickNavItem(item)}>
                            <ListItem style={{ background: navSelected == item.id ? "darkslateblue" : "", borderRadius: "40px" }} className={`${item.disabled ? "hover:tw-bg-red-800" : "hover:tw-bg-purple-800"} tw-mb-1`} button key={item.name}>
                                <ListItemIcon className="tw-text-white">
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText className={item.disabled ? "tw-text-gray-300" : "tw-text-white"}>
                                    <p className={item.subText && item.disabled ? "tw-leading-4" : ""}>{item.name}</p>
                                    {item.disabled ? <p className="tw-text-sm tw-leading-4 tw-text-gray-400">
                                        {item.subText}
                                    </p> : null }
                                </ListItemText>
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
                            open={isNavOpen}
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
