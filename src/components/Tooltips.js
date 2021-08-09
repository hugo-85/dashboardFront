import React from 'react';
import { Tooltip, Typography, Button } from "@material-ui/core"

export const HtmlTooltip = (props) => {
    return (
        <Tooltip 
            style= { styles }
            placement={ props.placement }
            title={
                <React.Fragment>
                    <Typography color="inherit">{ props.informativeText }</Typography>
                    <p>{ props.content }</p>
                </React.Fragment>
            }
        >
            <Button>{ props.icon}</Button>
        </Tooltip>
    )
}

const styles = {
    backgroundColor: 'inherit',
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    maxHeight: 220,
    fontSize: '12px',
    border: "none",
}