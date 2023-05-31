import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AppBar, CssBaseline, IconButton, Toolbar, makeStyles } from '@material-ui/core';
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
	}
}));

const Header = (props) => {
	const { setIsNavOpen, setIsNotificationsOpen } = props;
	const classes = useStyles();

	const handleDrawerToggle = () => {
		setIsNavOpen(prev => !prev);
	};

	const handleNotificationsToggle = () => {
		setIsNotificationsOpen(prev => !prev);
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
				<Toolbar className={"tw-flex tw-flex-row-reverse tw-justify-between"} style={{ "background": "linear-gradient(44deg, #250c51, #605317)"}}>
					<div>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleNotificationsToggle}
							className={`${classes.menuButton} tw-m-0`}
						>
							<OfflineBolt />
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
