import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const Popup = (props) => {
    const { isOpen = false, duration = 3000, position = { vertical: "top", horizontal: "right" }, handleClose, 
        severity = "error", children
    } = props;

    return (
        <Snackbar open={isOpen} autoHideDuration={duration} onClose={handleClose} anchorOrigin={position} className="tw-z-[10000]">
            <Alert className="tw-rounded-3xl" variant="filled" onClose={handleClose} severity={severity}>
                {children}
            </Alert>
        </Snackbar>
    );
}

Popup.propTypes = {
    isOpen: PropTypes.bool,
    duration: PropTypes.number,
    position: PropTypes.object,
    handleClose: PropTypes.func,
    severity: PropTypes.string
}

export default Popup;
