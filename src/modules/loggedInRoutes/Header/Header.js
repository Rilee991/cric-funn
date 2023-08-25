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
		setToggleConfetti
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
		<Link href="/">
		  <img src={cricFunnLogo} width={100} height={70}/>
		</Link>
	);

  	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="fixed" className={`${classes.appBar} tw-shadow-none tw-z-[1] tw-w-full`}>
				<Toolbar className={"tw-flex tw-justify-between"} style={{ "background": "transparent"}}>
					<div className="tw-flex tw-items-center tw-gap-1">
						<div>
							{getCricFunnLogo()}
						</div>
					</div>
					<div className="tw-flex tw-items-center tw-justify-center">
						{isBday && 
							<div className="tw-flex">
								<IOSSwitch className="tw-w-8 tw-h-8" checked={toggleConfetti} onChange={() => setToggleConfetti(prev => !prev)} name="checkedB" />
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
								<OfflineBolt className="tw-w-7 tw-h-7"/>
							</Badge>
						</IconButton>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={`${classes.menuButton} tw-m-0 tw-p-2`}
						>
							<Reorder className="tw-w-7 tw-h-7" />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
}

Header.propTypes = {
	window: PropTypes.func
};

export default Header;
