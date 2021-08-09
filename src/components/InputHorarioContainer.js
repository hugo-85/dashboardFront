import React from 'react';
import { Input } from '@material-ui/core';

const InputHorario = (props) => {
    return(
        <div>
            { props.title } &nbsp;
            <InputContainer identifier={ props.identifierInicio }
                label={ props.labelInicio }
                classes={ props.classes }
                horarios={ props.horariosInicio }
                style={ (props.error)
                    ? { borderBottom: '2px solid red' }
                    : null}/>
            &nbsp; a &nbsp;
            <InputContainer identifier={ props.identifierFin }
                label={ props.labelFin }
                classes={ props.classes }
                horarios={ props.horariosFin }
                style={ (props.error)
                    ? { borderBottom: '2px solid red' }
                    : null}/>
            &nbsp;({ props.required })
            { (props.error)
                ? <p>Tienes que completar este campo</p>
                : null }
        </div>
    )
}

const InputContainer = (props) => {
    return(
        <Input
            type="number"
            inputProps={{ min: "1", max: "24" }}
            id={ props.identifier }
            label= { props.label }
            name= { props.identifier }
            margin="normal"
            variant="outlined"
            className={ props.classes }
            placeholder={ props.horarios }
        />
    )
}

export default InputHorario;