import React from 'react';
import { Grid } from '@material-ui/core';

import Copyright from './Copyright';
import SocialMedia from './SocialMedia';

const Credits = () => {
    return (
        <Grid container justify="space-evenly" alignContent="space-around" direction="column">
			<Grid item>
				<Copyright textColor="black" />
			</Grid>
			<Grid item>
				<SocialMedia />
			</Grid>
		</Grid>
    );
}

export default Credits;
