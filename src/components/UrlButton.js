import React from 'react';
import { Tooltip, Button } from '@material-ui/core';

export const UrlButton = (props) => {
    return(
        <Tool title={ props.title } label={ props.label }
            buttonContent={ props.buttonContent }/>
    )
}

const Tool = (props) => {
    return (
        <Tooltip title={ props.title } aria-label={ props.label }>
            <Button>
                { props.buttonContent }
            </Button>
        </Tooltip>
    )
}