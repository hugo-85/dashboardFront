import React from 'react';

export class Parrafo extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <p>{ this.props.title }</p>
    }
}