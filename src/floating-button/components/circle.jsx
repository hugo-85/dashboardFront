import React from 'react';

export class Circle extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <span 
                style={ this.props.style }
                color={ this.props.color }
                onClick={ this.props.event }>
            </span>
        );
    }
}