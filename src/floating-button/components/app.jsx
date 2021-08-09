import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import * as Buttons from './button.jsx';
import { Container, ColorSelector } from './container.jsx';
import { Parrafo } from './titles.jsx';
import { Circle } from './circle.jsx'; 
import { Input } from './input.jsx';
import { tryDOM } from '../src/scriptGenerating.js';

export class ButtonContainer extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            generate: '',
            model: '0',
            color: 'white',
            colorText: 'black',
            position: 'right',
            text: 'Charla con nosotros',
            showBubble: true,
            previsualizar: true,
            backgroundBlue: 23,
            backgroundRed: 49,
            backgroundGreen: 120,
            colorBlue: 233,
            colorRed: 19,
            colorGreen: 20
        }

        //Contenedores JSX
        this.buttonModel = '';
        this.containerIframe = '';
        
        //Eventos
        this.changeModel = this.changeModel.bind(this);
        this.changeBackground = this.changeBackground.bind(this);
        this.changeColorText = this.changeColorText.bind(this);
        this.changePosition = this.changePosition.bind(this);
        this.changeText = this.changeText.bind(this);
        this.generateScript = this.generateScript.bind(this);
        this.chooseElementToShow = this.chooseElementToShow.bind(this);
        this.changeCheckBox = this.changeCheckBox.bind(this);
        this.changeCustomBackground = this.changeCustomBackground.bind(this);
        this.changeCustomColor = this.changeCustomColor.bind(this);
        this.copyContent = this.copyContent.bind(this);
    }

    //=======================Cambiar modelo
    changeModel(ev){
        this.setState({ model: ev.target.value });
    }

    //=======================Background
    changeBackground(ev){
        this.setState({ color: ev.target.getAttribute('color') });
    }

    //Cambio background custom
    changeCustomBackground(ev){
        switch(ev.target.getAttribute('name')){
            case 'blue':
                this.setState({ backgroundBlue : ev.target.value });
                break;
            case 'red':
                this.setState({ backgroundRed : ev.target.value });
                break;
            case 'green':
                this.setState({ backgroundGreen : ev.target.value });
                break;
            default:
                return false;
        }
    }

    //=======================Color de texto
    changeColorText(ev){
        this.setState({ colorText: ev.target.getAttribute('color') });
    }

    //Cambio color de texto custom
    changeCustomColor(ev){
        switch(ev.target.getAttribute('name')){
            case 'blue':
                this.setState({ colorBlue : ev.target.value });
                break;
            case 'red':
                this.setState({ colorRed : ev.target.value });
                break;
            case 'green':
                this.setState({ colorGreen : ev.target.value });
                break;
            default:
                return false;
        }
    }

    //=======================Comportamiento de botón
    
    //Desplegar/retraer
    chooseElementToShow(){
        this.setState({ showBubble: !this.state.showBubble })
    }

    //Checkbox "previsualizar"
    changeCheckBox(){
        this.setState({ previsualizar: !this.state.previsualizar });
    }

    //Fixed izquierda o derecha
    changePosition(ev){
        this.setState({ position: ev.target.value });
    }
    
    //Cambiar texto a mostrar en :hover
    changeText(ev){
        this.setState({ text: ev.target.value });
    }

    //=========================== Generación Script
    generateScript(){
        let change = new Promise((res, rej) => {
            this.setState({ showBubble: true });
            res('ok');
            rej('no');
        });
        change.then(async () => {
            this.buttonModel = <Buttons.ButtonModelTwo
                                    background={ this.state.color }
                                    colorText={ this.state.colorText }
                                    text={ this.state.text }
                                    position={ this.state.position }
                                    event={ this.chooseElementToShow }/>;
            this.containerIframe = <Container
                                    background={ this.state.color }
                                    colorText={ this.state.colorText }
                                    position={ this.state.position }
                                    event={ this.chooseElementToShow }
                                    show={ this.state.showBubble }
                                    campaign={ this.props.campaign }
                                    company={ this.props.company }/>;
            let cnt =   <div style={ floatingStyle }>
                            { this.buttonModel }{ this.containerIframe }
                        </div>;
            let script = await tryDOM(ReactDOMServer.renderToString(cnt), this.props.campaign);
            this.setState({ generate: script.data });
        });
    }

    //Copiar contenido (al hacer clic en el botón de copiar)
    copyContent(){
        document.getElementsByName('domGenerated')[0].select();
        document.execCommand('copy');
    }

    render(){
        switch(this.state.model){
            case '0':
            default:
                this.buttonModel = null;
                this.containerIframe = null;
                break;
            case '1':
                this.buttonModel = <Buttons.ButtonModelOne 
                                    background={ this.state.color }
                                    colorText={ this.state.colorText }
                                    position={ this.state.position }
                                    event={ this.chooseElementToShow }/>;
                this.containerIframe = <Container
                                    background={ this.state.color }
                                    colorText={ this.state.colorText }
                                    position={ this.state.position }
                                    event={ this.chooseElementToShow }
                                    campaign={ this.props.campaign }
                                    company={ this.props.company }/>;
                break;
            case '2':
                this.buttonModel = <Buttons.ButtonModelTwo
                                    background={ this.state.color }
                                    colorText={ this.state.colorText }
                                    text={ this.state.text }
                                    position={ this.state.position }
                                    event={ this.chooseElementToShow }/>;
                this.containerIframe = <Container
                                    background={ this.state.color }
                                    colorText={ this.state.colorText }
                                    position={ this.state.position }
                                    event={ this.chooseElementToShow }
                                    show={ this.state.showBubble }
                                    campaign={ this.props.campaign }
                                    company={ this.props.company }/>;
                break;
        }

        return(
            <div style={ modalBackStyle }>
                <Buttons.CloseButton event={ this.props.event }/>
                <div style={ containerStyle }>
                    <div style={ rowStyle }>
                        <Parrafo title="Button model"/>
                        <select 
                            value={ this.state.model }
                            onChange={ this.changeModel }
                            style={ Object.assign({}, {height: '30px'},{alignSelf: 'center'})}
                        >
                            <option value="0">Choose a model</option>
                            <option value="1">Model 1</option>
                            <option value="2">Model 2</option>
                        </select>
                    </div>
                    <div>
                        <Parrafo title={  'Background color: ' + this.state.color }/>
                        <div style={ rowStyle }>
                            <Circle 
                                style={Object.assign({}, spanStyle, {backgroundColor: '#4e4376'} )}
                                color='#4e4376'
                                event={ this.changeBackground }/>
                            <Circle 
                                style={Object.assign({}, spanStyle, {backgroundColor: '#ffffff'} )}
                                color='#ffffff'
                                event={ this.changeBackground }/>
                            <Circle 
                                style={Object.assign({}, spanStyle, {backgroundColor: '#000000'} )}
                                color='#000000'
                                event={ this.changeBackground }/>
                            <Circle 
                                style={Object.assign({}, spanStyle, { backgroundColor: 
                                    'rgb(' + 
                                    this.state.backgroundRed + ',' +
                                    this.state.backgroundGreen + ',' +
                                    this.state.backgroundBlue + ')'
                                })}
                                color={ 'rgb(' + 
                                    this.state.backgroundRed + ',' +
                                    this.state.backgroundGreen + ',' +
                                    this.state.backgroundBlue + ')' }
                                event={ this.changeBackground }/>
                        </div>
                        <ColorSelector
                            event={ this.changeCustomBackground }
                            red={ this.state.backgroundRed }
                            green={ this.state.backgroundGreen }
                            blue={ this.state.backgroundBlue }/>
                        <Parrafo title={ 'Text color: ' + this.state.colorText }/>
                        <div style={ rowStyle }>
                            <Circle 
                                style={Object.assign({}, spanStyle, {backgroundColor: '#4e4376'} )}
                                color='#4e4376'
                                event={ this.changeColorText }/>
                            <Circle 
                                style={Object.assign({}, spanStyle, {backgroundColor: '#ffffff'} )}
                                color='#ffffff'
                                event={ this.changeColorText }/>
                            <Circle 
                                style={Object.assign({}, spanStyle, {backgroundColor: '#000000'} )}
                                color='#000000'
                                event={ this.changeColorText }/>
                            <Circle 
                                style={Object.assign({}, spanStyle, { backgroundColor: 
                                    'rgb(' + 
                                    this.state.colorRed + ',' +
                                    this.state.colorGreen + ',' +
                                    this.state.colorBlue + ')'
                                })}
                                color={ 'rgb(' + 
                                    this.state.colorRed + ',' +
                                    this.state.colorGreen + ',' +
                                    this.state.colorBlue + ')' }
                                event={ this.changeColorText }/>
                        </div>
                        <ColorSelector
                            event={ this.changeCustomColor }
                            red={ this.state.colorRed }
                            green={ this.state.colorGreen }
                            blue={ this.state.colorBlue }/>
                    </div>
                    <div style={ Object.assign({}, rowStyle, { alignItems: 'center' })}>
                        { (this.state.model === '2') ? <Parrafo title='Additional text'/> : null }
                        { (this.state.model === '2') 
                            ? <Input type='text' length='40' style={ inputStyle }
                                    text={ this.state.text } event={ this.changeText }/> 
                            : null }
                    </div>
                    <div style={ rowStyle }>
                        <Parrafo title="Ubication"/>
                        <select 
                            value={ this.state.position } onChange={ this.changePosition }
                            style={ Object.assign({}, {height: '30px'},{alignSelf: 'center'})}
                        >
                            <option value="none">Choose a position</option>
                            <option value="right">Right fixed</option>
                            <option value="left">Left fixed</option>
                        </select>
                    </div>
                    <div style={ rowStyle }>
                        <div style={{ display: 'flex', justifyContent: 'flex-start'}}>
                            <Parrafo title="Preview"/>
                            <input 
                                style={{ alignSelf: 'center' }}
                                type="checkbox"
                                checked={ this.state.previsualizar }
                                onChange={ this.changeCheckBox } />
                        </div>
                        <div style={ columnStyle }>
                            { (this.state.previsualizar)
                                ? (this.state.showBubble) ? this.buttonModel : this.containerIframe 
                                : null
                            }
                            { (this.buttonModel) 
                                ? <button
                                    id='generar' 
                                    style={ buttonStyle }
                                    onClick={ this.generateScript }>
                                        Generar script
                                    </button>
                                : null }
                        </div>
                    </div>
                    
                    { (this.state.generate !== '')
                        ?   <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderTop: '1px solid #0a0a0a',
                                width: '60%',
                                margin: '0 auto',
                                paddingTop: '2%' 
                            }}>
                                <input type="text" readOnly name="domGenerated"
                                    style={{
                                        width: '100%',
                                        padding: '3px',
                                        textAlign: 'center'
                                    }}
                                    value={ this.state.generate }
                                />
                                <FontAwesomeIcon icon={faCopy}
                                    style={{ marginLeft: '5px' }}
                                    onClick={ this.copyContent }/>
                            </div>
                        : null }
                </div>
            </div>
        );
    }
}

/* Estilos */

//Background modal
export const modalBackStyle={
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '9999',
    backgroundColor: 'rgba(0,0,0,.4)'
}

//Contenedor principal
export const containerStyle= {
    width: '45%',
    padding: '2% 0',
    boxShadow: '0px 0px 5px black',
    fontFamily: 'Arial',
    textAlign: 'center',
    position: 'absolute',
    top: '5%',
    left: 'calc(100% - (22.5% + 50%))',
    background: '#fff',
    zIndex: '99999'
};

//Círculos de colores
const spanStyle= {
    borderRadius: '50%',
    border: '1.5px solid #fafafa',
    boxShadow: '0px 0px 5px black',
    width: '30px',
    height: '30px',
    display: 'block'
};

//Flex row
const rowStyle ={
    display: 'flex',
    justifyContent: 'space-between',
    width: '80%',
    margin: '0 auto'
}

//Flex column
const columnStyle ={
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}

//Botón de generar código
const buttonStyle ={
    padding: '5px',
    border: 'none',
    marginTop: '15px',
    boxShadow: '1px 1px 3px rgba(0,0,0,.3)'
}

//Texto de botón
const inputStyle ={
    padding: '5px',
    outline: 'none',
    margin: '0 auto',
    display: 'block'
}

//Contenedor de botón flotante
const floatingStyle = {
    zIndex: '99999',
    fontSize: '16px',
    fontFamily: 'sans-serif',
    fontWeight: 400
}