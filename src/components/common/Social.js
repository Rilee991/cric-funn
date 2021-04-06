import React from 'react';
import { ListItem, Button } from '@material-ui/core';
import { Facebook, LinkedIn, Twitter } from '@material-ui/icons';

function Social() {
    return (
        <ListItem button style={{justifyContent:"center"}}>
            <Button color="primary" onClick={() => window.open(
            'https://www.facebook.com/StoneCypher33',
            '_blank'
            )}>
                <Facebook color="primary" fontSize="large" />
            </Button>

            <Button color="primary" onClick={() => window.open(
            'https://www.linkedin.com/in/rohit-kumar-a92418141/',
            '_blank'
            )}>
                <LinkedIn color="primary" fontSize="large" />
            </Button>

            <Button color="primary" onClick={() => window.open(
            'https://twitter.com/IamRohitKumar22',
            '_blank'
            )}>
                <Twitter color="primary" fontSize="large" />
            </Button>
        </ListItem>
    );
}

export default Social;