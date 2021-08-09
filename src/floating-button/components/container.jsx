import React from 'react';
import { InputRange } from './input.jsx';

export class Container extends React.Component{
    constructor(props){
        super(props);
        this.style = {
            height: '400px',
            width: '300px',
            margin: '0 auto',
            flexDirection: 'column',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            borderRadius: '15px',
            position: 'fixed',
            bottom: '20px',
            overflow: 'hidden',
            zIndex: '99999'
        }
    }

    render(){
        let pos = (this.props.position === 'left') ? { left : '20px' } : { right : '20px'};
        let display = (this.props.show) ? 'none' : 'block';

        return(
            <div style={ Object.assign({},
                    this.style,
                    pos,
                    { display : display }
                )}
                id="chatbox">
                <div style={ 
                    Object.assign({}, titleStyle,   
                    { backgroundColor: this.props.background},
                    { color: this.props.colorText } )
                }>
                    <h3 style={ 
                        Object.assign({},
                        { fontSize: '16px' },
                        { fontFamily: 'sans-serif' },
                        { fontWeight: '400' })
                    }>
                        Way of Works
                    </h3>
                    <p 
                        style={ {fontSize: '25px'} }
                        onClick={ this.props.event }
                        id="minMaxChatbox"
                    >
                        -
                    </p>
                </div>
                <iframe src={ 'https://chat.wow2.xinnux.com/' + 
                            this.props.company.toLowerCase() + '/' +
                            this.props.campaign + '/index.html' }
                    frameBorder='0'
                    title={ this.props.campaign }
                    style={
                        Object.assign({},
                        { height: '92%' }, 
                        { width: '100%' },
                        { display: 'inline-block' })
                    }>
                </iframe>
            </div>
        );
    }
}

export class ColorSelector extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div style={{ margin: '10px auto' }}>
                <div>Red: 
                    <InputRange type='range' min="0" max="255"
                        event={ this.props.event } name='red'/> 
                    { this.props.red }
                </div>
                <div>Green:
                    <InputRange type="range" min="0" max="255"
                        event={ this.props.event } name='green'/> 
                    { this.props.green }
                </div>
                <div>Blue:
                    <InputRange type="range" min="0" max="255"
                        event={ this.props.event } name='blue'/> 
                    { this.props.blue }
                </div>    
            </div>
        )
    }
}

const titleStyle = {
    height: '8%',
    borderRadius: '15px 15px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.5)',
}