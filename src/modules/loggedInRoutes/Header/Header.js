import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AppBar, CssBaseline, IconButton, Toolbar, makeStyles, Badge } from '@material-ui/core';
import { OfflineBolt, Reorder } from '@material-ui/icons';

import cricFunnLogo from '../../../images/logo.png';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		}
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
	const { setIsNavOpen, setIsNotificationsOpen, totalNotifs = 0, clearNotifications } = props;
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
			<AppBar position="fixed" className={`${classes.appBar} tw-z-[10000] tw-w-full`}>
				<Toolbar className={"tw-flex tw-flex-row-reverse tw-justify-between"} style={{ "background": "linear-gradient(0deg, #1b004a, #50045a)"}}>
					<div>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleNotificationsToggle}
							className={`${classes.notificationButton} tw-m-0`}
						>
							<Badge component="button" badgeContent={totalNotifs} classes={{ badge: classes.customBadge }}>
								<OfflineBolt />
							</Badge>
						</IconButton>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={`${classes.menuButton} tw-m-0`}
						>
							<Reorder />
						</IconButton>
					</div>
					<div className="tw-flex tw-items-center tw-gap-1">
						<div>
							{getCricFunnLogo()}
						</div>
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
