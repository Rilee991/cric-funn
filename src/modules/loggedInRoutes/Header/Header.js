import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AppBar, CssBaseline, IconButton, Toolbar, makeStyles, Badge } from '@material-ui/core';
import { OfflineBolt, Reorder } from '@material-ui/icons';

import cricFunnLogo from '../../../res/images/logo.png';

import IOSSwitch from '../../../components/common/Switch';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
		background: "linear-gradient(2deg, black, #10007e)"
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('md')]: {
			display: 'none',
		}
	},
	notificationButton: {
		marginRight: theme.spacing(2)
	},
	customBadge: {
		background: "#0c1b6e"
	}
}));

const Header = (props) => {
	const { setIsNavOpen, setIsNotificationsOpen, totalNotifs = 0, clearNotifications, isBday, toggleConfetti,
		setToggleConfetti, isOnline
	} = props;
	const classes = useStyles();

	const handleDrawerToggle = () => {
		setIsNavOpen(prev => !prev);
	};

	const handleNotificationsToggle = () => {
		setIsNotificationsOpen(prev => {
			if(prev) clearNotifications();

			return !prev;
		});
	}

	const getCricFunnLogo = () => (
		<Link to="/">
		  <img src={cricFunnLogo} width={100} height={70}/>
		</Link>
	);

  	return (
		<React.Fragment>
			{/* <CssBaseline /> */}
			<AppBar position="fixed" className={`${classes.appBar} tw-shadow-none tw-z-[10] tw-w-full`}>
				<Toolbar className={"tw-flex tw-justify-between"} style={{ "background": "transparent"}}>
					<div className="tw-flex tw-items-center tw-gap-1">
						<div>
							{getCricFunnLogo()}
						</div>
					</div>
					<div className="tw-flex tw-items-center tw-justify-center">
						{isBday && 
							<div className="tw-flex">
								<IOSSwitch checked={toggleConfetti} onChange={() => setToggleConfetti(prev => !prev)} name="checkedB" />
							</div>
						}
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleNotificationsToggle}
							className={`${classes.notificationButton} tw-m-0 tw-p-2`}
						>
							<Badge component="button" badgeContent={totalNotifs} classes={{ badge: classes.customBadge }}>
								<i className="pi pi-bell tw-text-2xl" />
							</Badge>
						</IconButton>
						{isOnline && <IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={`${classes.menuButton} tw-m-0 tw-p-2`}
						>
							<i className="pi pi-bars tw-text-2xl" />
						</IconButton>}
					</div>
				</Toolbar>
			</AppBar>
		</React.Fragment>
	);
}

Header.propTypes = {
	window: PropTypes.func
};

export default Header;
