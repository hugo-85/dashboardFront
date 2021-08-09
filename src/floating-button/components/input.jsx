import React from 'react';

export class Input extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <input 
                type={ this.props.type }
                maxLength={ this.props.length || '' } 
                style={ this.props.style }
                value={ this.props.text }
                placeholder={ this.props.text }
                onChange={ this.props.event }/> 
        );
    }
}

export class InputRange extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <input 
                type="range" 
                min={ this.props.min } 
                max={ this.props.max }
                onChange={ this.props.event }
                name={ this.props.name }/>
        );
    }
}