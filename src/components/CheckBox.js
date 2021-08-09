import React from "react";
import { FormGroup, Checkbox, FormControlLabel, FormLabel, FormControl } from "@material-ui/core";
import InputHorario from './InputHorarioContainer';

const CheckBox = (props) => {
    let days = [], finded = false;
    Object.keys(props.daysWeek).forEach(day => {
        days.push({ day: props.daysWeek[day], key: day });
        if(props.daysWeek[day]) finded = true;
    });

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">{ props.text }</FormLabel>
            <FormGroup style={{ flexDirection: 'row' }}>
                { days.map(item => <CheckBoxLabel item={ item } handler={ props.handler }/>)}
            </FormGroup>
            { finded
                ?   <div>
                        <InputHorario title='Horario 1: de'
                            identifierInicio={ props.identifierInicio1}
                            identifierFin={ props.identifierFin1}
                            labelInicio='Horario de apertura'
                            labelFin='Horario de cierre'
                            classes={ props.classes }
                            horariosInicio={ props.horariosInicio1 }
                            classes={ props.classes }
                            horariosFin={ props.horariosFin1 }
                            required={ props.required1 }
                            error={ props.error }/>
                        <InputHorario title='Horario 2: de'
                            identifierInicio={props.identifierInicio2}
                            identifierFin={props.identifierFin2}
                            labelInicio='Horario de apertura'
                            labelFin='Horario de cierre'
                            classes={ props.classes }
                            horariosInicio={ props.horariosInicio2 }
                            classes={ props.classes }
                            horariosFin={ props.horariosFin2 }
                            required={ props.required2 }
                            error={ null }/>
                    </div>
                :   null
            }
        </FormControl>
    );    
}

const CheckBoxLabel = (props) => {
    return <FormControlLabel
                control={<Checkbox 
                    checked={ props.item.day }
                    onChange={ props.handler }
                    name={ props.item.key }/>}
                label={ props.item.key.substr(0,1).toUpperCase() }
            />
}

export default CheckBox;