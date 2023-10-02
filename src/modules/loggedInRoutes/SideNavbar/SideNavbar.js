import React from 'react'
import { Divider, SwipeableDrawer, Hidden, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { BsCurrencyExchange } from 'react-icons/bs';

import cricFunnLogo from '../../../res/images/logo.png';
import { CloseRounded } from '@material-ui/icons';

const drawerWidth = 340;
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
    const { setIsNavOpen, isNavOpen, navSelected, navItems, setNavSelected, mobileView, configurations } = props;
    const classes = useStyles();

    const handleDrawerToggle = () => {
        setIsNavOpen(prev => !prev);
    }

    const onClickNavItem = (item) => {
        setNavSelected(item.id);
        setIsNavOpen(false);
        item.onClick && item.onClick();
    }

    const getRemainingCredits = () => {
        const totalHits = configurations["totalHits"];

        return 100-Math.min(100,totalHits);
    }

    const getCricFunnLogo = () => (
		<Link href="/">
		  <img src={cricFunnLogo} width={100} height={70}/>
		</Link>
	);

    const getDrawerItems = () => (
        <div className="tw-flex tw-flex-col tw-z-10 tw-h-screen tw-justify-between">
            <div className="tw-ml-[4vw]">
                <div className="tw-flex tw-h-[62px] tw-items-center tw-px-4 tw-justify-between">
                    {/* <Typography style={{fontSize: 18}}>
                        <b>MENU</b>
                    </Typography> */}
                    {/* <div className="tw-px-4 tw-flex tw-items-center tw-justify-evenly"> */}
                        {getCricFunnLogo()}
                        <div className={`tw-text-white tw-cursor-pointer tw-block md:tw-hidden`} onClick={() => setIsNavOpen(false)}>
                            <CloseRounded />
                        </div>
                    {/* </div> */}
                </div>
                <Divider />
                <div>
                    <List>
                        {navItems.map((item, index) => (
                            <Link to={item.to} key={item.id} onClick={() => onClickNavItem(item)}>
                                <ListItem style={{ borderLeft: navSelected == item.id ? "2px solid white" : "", background: navSelected == item.id ? "linear-gradient(45deg, black, #1504b3)" : "", borderRadius: "0px 40px 40px 0px" }} className={`${item.disabled ? "hover:tw-bg-[#5a0404]" : "hover:tw-bg-[#232121]"} tw-mb-1`} button key={item.name}>
                                    <ListItemIcon className="tw-text-white">
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText className={`${item.disabled ? "tw-text-gray-400" : "tw-text-white"}`}>
                                        <p className={`${item.subText ? "tw-leading-[1.4rem]" : ""} tw-text-lg tw-font-noto ${navSelected == item.id ? "tw-font-semibold" : ""}`}>{item.name}</p>
                                        {item.subText ? <p className="tw-text-base tw-leading-4 tw-text-gray-500">
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
            <div>
                <ListItem style={{ borderRadius: "40px" }} className={`tw-mb-1 tw-cursor-default`} button>
                    <ListItemIcon className="tw-text-white">
                        <BsCurrencyExchange className="tw-w-5 tw-h-5" />
                    </ListItemIcon>
                    <ListItemText className={"tw-text-white"}>
                        <p className="tw-text-sm tw-leading-4 tw-text-gray-400 tw-font-noto">
                            Credits Left Today: <b>{getRemainingCredits()}</b>
                        </p>
                    </ListItemText>
                </ListItem>
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
