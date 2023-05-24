import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, CssBaseline, IconButton, Toolbar, Typography, makeStyles } from '@material-ui/core';
import { NotificationImportantRounded, Menu } from '@material-ui/icons';

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

const LoggedInHeader = (props) => {
	const { setIsDrawerOpen } = props;
	const classes = useStyles();

	const handleDrawerToggle = () => {
		setIsDrawerOpen(prev => !prev);
	};

  	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="fixed" className={`${classes.appBar} tw-z-[10000] tw-w-full`}>
				<Toolbar className={"tw-flex tw-flex-row-reverse tw-justify-between"}>
					<div>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={`${classes.menuButton} tw-m-0`}
						>
							<NotificationImportantRounded />
						</IconButton>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={`${classes.menuButton} tw-m-0`}
						>
							<Menu />
						</IconButton>
					</div>
					<div>
						<Typography variant="h6" noWrap>
							Responsive drawer
						</Typography>
					</div>
				</Toolbar>
			</AppBar>
		{/* <main className={classes.content}>
			<div className={classes.toolbar} />
			<Typography paragraph>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
			ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
			facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
			gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
			donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
			adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
			Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
			imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
			arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
			donec massa sapien faucibus et molestie ac.
			</Typography>
			<Typography paragraph>
			Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
			facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
			tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
			consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
			vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
			hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
			tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
			nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
			accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
			</Typography>
		</main> */}
		</div>
	);
}

LoggedInHeader.propTypes = {
	window: PropTypes.func
};

export default LoggedInHeader;
