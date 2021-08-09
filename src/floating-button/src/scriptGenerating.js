import axios from 'axios';

const apiUrl = process.env.REACT_APP_URL_API;

export async function tryDOM(DOM, marca){
    let firstConfig = 'document.getElementById("bubble").style.display = "block";' +
            'document.getElementById("chatbox").style.display = "none";',
        clickOne = 'document.getElementById("bubble").addEventListener("click",' +
        '() => { document.getElementById("bubble").style.display = "none";' +
        'document.getElementById("chatbox").style.display = "initial"; });',
        clickTwo = 'document.getElementById("minMaxChatbox").addEventListener("click",' +
        '() => { document.getElementById("chatbox").style.display = "none";' +
        'document.getElementById("bubble").style.display = "initial"; });',
        staticScript = '<script>' + firstConfig + clickOne + clickTwo + '</script>',
        finalString = DOM + staticScript;
    let retorno = await axios({
        method: 'POST',
        url: `${apiUrl}files/floating-button`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: { 
            button: finalString,
            marca: marca
        }
    })
    .then(res => { return res.data })
    .catch(err => { return err });

    return retorno;
}
