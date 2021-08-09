import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export const SnackBar = (props) => {
    return (
        <Snackbar open={props.open} autoHideDuration={6000} onClose={props.handleClose}>
            <Alert onClose={props.handleClose} severity={props.snackbarType }>
            { props.snackbarText }
            </Alert>
        </Snackbar>
    )
};

const AlertSnack = (props) => {
    return <Alert elevation={6} variant="filled" {...props} />;
}