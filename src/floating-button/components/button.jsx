import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTimes } from '@fortawesome/free-solid-svg-icons';


export class ButtonModelOne extends React.Component{
    constructor(props){
        super(props);
        this.style = {
            height: '80px',
            width: '80px',
            borderRadius: '50%',
            boxShadow: '0 0 5px #0a0a0a',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            bottom: '20px',
            zIndex: '99999'
        }
    }

    render(){
        let pos = (this.props.position === 'left') ? { left : '20px' } : { right : '20px'};
        return(
            <div 
                style={ 
                    Object.assign({},
                        this.style,
                        { backgroundColor: this.props.background },
                        pos)
                    }
                onClick={ this.props.event }
                id='bubble'
            >
                <FontAwesomeIcon 
                    icon={ faComment } 
                    style={{ color: this.props.colorText, width: '25px', height: '25px'}}/>
            </div>
        );
    }
}

export class ButtonModelTwo extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            width: 'auto',
        }

        this.style = {
            display: 'block',
            padding: '5px 10px',
            borderRadius: '0px 20px',
            boxShadow: '0 2px 15px rgba(44, 80, 239, 0.21)',
            position: 'fixed',
            bottom: '20px'
        }

        this.expandContainer = this.expandContainer.bind(this);
        this.hideContainer = this.hideContainer.bind(this);
    }

    expandContainer(){
        this.setState({ width: '200px' });
    }

    hideContainer(){
        this.setState({ width: 'auto' });
    }

    render(){
        let pos = (this.props.position === 'left') ? { left : '20px' } : { right : '20px'};
        return(
            <div style={
                Object.assign({},
                    this.style,
                    { backgroundColor: this.props.background }, 
                    { width: this.state.width },
                    { color: this.props.colorText },
                    pos
                )}
                data-text={ this.props.text }
                onMouseEnter={ this.expandContainer }
                onMouseLeave={ this.hideContainer }
                onClick={ this.props.event }
                id='bubble'
            >
                <svg x="0px" y="0px" viewBox="0 0 27 21.9" role="img" data-reactid=".0.4.0"
                    style={
                        Object.assign({},
                        { height: '28px' },
                        { width: '28px' })
                    }
                >
                    <path 
                        fill={ this.props.colorText }
                        d="M23.2,0L2.6,1.7C1,1.9,0,3.2,0,4.9v8c0,1.6,0.8,3,2.4,3.1l5.3,0.5c0,0,1,1.6,0.3,3.2C7.2,21.3,6,21.9,6,21.9 c4.2,0,6.6-3.1,7.8-4.9l9.4,0.7c1.8,0.2,3.8-1.3,3.8-3.1V3.1C27,1.3,25-0.1,23.2,0z M6.4,10.1c-0.9,0-1.7-0.7-1.7-1.7 c0-0.9,0.7-1.7,1.7-1.7C7.3,6.8,8,7.5,8,8.5C8,9.4,7.3,10.1,6.4,10.1z M13.2,10.1c-0.9,0-1.7-0.7-1.7-1.7c0-0.9,0.7-1.7,1.7-1.7 c0.9,0,1.7,0.7,1.7,1.7C14.8,9.4,14.1,10.1,13.2,10.1z M19.9,10.1c-0.9,0-1.7-0.7-1.7-1.7c0-0.9,0.7-1.7,1.7-1.7 c0.9,0,1.7,0.7,1.7,1.7C21.6,9.4,20.9,10.1,19.9,10.1z"
                        data-reactid=".0.4.0.2">
                    </path>
                </svg>
                { (this.state.width !== 'auto') 
                    ? <span style={ Object.assign({}, 
                        { display: 'inline-block' },
                        { marginLeft: '10px' }
                        )}>{ this.props.text }</span>
                    : null }
            </div>
        );
    }
}

export class CloseButton extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div style={ closeButtonStyles } onClick={ this.props.event }>
                <FontAwesomeIcon icon={ faTimes }/>
            </div>
        )
    }
}

export const closeButtonStyles = {
    backgroundColor: '#0a0a0a',
    color: '#fafafa',
    border: '1px solid #fafafa',
    width: '30px',
    height: '30px',
    borderRadius:'50%',
    top: '4%',
    left: 'calc(100% - (22.5% + 50%))',
    position: 'absolute',
    zIndex: '999999',
    lineHeight: '30px',
    textAlign: 'center'
}

