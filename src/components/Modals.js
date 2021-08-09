import React from 'react';
import { Button } from '@material-ui/core';
import { modalBackStyle } from "../floating-button/components/app.jsx";

export const ModalForCenter = (props) => {
    return(
        <div style={ Object.assign({}, modalBackStyle,
            { display: 'flex', justifyContent: 'center', alignItems: 'center' } )}>
            <div>
                <img 
                  style={{ maxWidth: '500px', minWidth: '250px', display: 'block' }}
                  src={ props.bodyModal }
                  alt=''/>
                <Button
                  style={{ margin: '20% auto 0 auto', display: 'block' }}
                  variant="contained"
                  color="primary"
                  onClick={ e => props.handleModal(false, null) }
                >
                  Close
                </Button>
            </div>
        </div>
    )
}