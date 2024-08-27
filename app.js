const NOMBRE_DIV_WRITER = '#div_writer';
const NOMBRE_SPAN_WRITER = "#span_writer";
const NOMBRE_CARET_WRITER = "#caret_writer";
const DEFAULT_TEXT_WRITER = ">\u00A0";

const NOMBRE_DIV_READER = "#div_reader";
const NOMBRE_SPAN_READER = "#span_reader";
const NOMBRE_CARET_READER = "#caret_reader";
const NOMBRE_BUTTON_READER = "#button_reader";
const NOMBRE_INICIO_BUTTON_READER = "#inicio_reader_buton";
const DEFAULT_TEXTO_READER = ">\u00A0";

const NOMBRE_DIV_IMAGEN = "#div_imagen";

const TEXTO_BUTTON_READER_DEFAULT = "";
const TEXTO_BUTTON_READER_COPIAR = "copiar texto";
const TEXTO_BUTTON_READER_TERMINAR = "terminar escritura";

const NOMBRE_CLASE_HIDEN = "hiden";

const MENSAJE_TEXTO_VACIO = "querido <<nombre sujeto de prueba>>, por favor ingrese algún texto en el primer panel.";

/*ATRIBUTOS*/
/*----writer-----*/
let writerIsFocused = false;
let isWriterTextSelected = false;
let arrayPostionWriterTextSelected = [];
let writerContainer = document.querySelector(NOMBRE_DIV_WRITER);
let writer = document.querySelector(NOMBRE_SPAN_WRITER);

/*----reader-----*/
let reader = document.querySelector(NOMBRE_SPAN_READER);
let readerContainer = document.querySelector(NOMBRE_DIV_READER);
let btnReader = document.querySelector(NOMBRE_BUTTON_READER);

let idReaderAnimation = null;
let textoReader = "";

let imgContainer = document.querySelector(NOMBRE_DIV_IMAGEN);

/*----encripta-----*/
const listaTextosEncriptador = [
    {text:'e',replace:'enter',textRegex:'e{1}',replaceRegex:'enter{1}'},
    {text:'i',replace:'imes',textRegex:'i{1}',replaceRegex:'imes{1}'},
    {text:'a',replace:'ai',textRegex:'a{1}',replaceRegex:'ai{1}'},
    {text:'o',replace:'ober',textRegex:'o{1}',replaceRegex:'ober{1}'},
    {text:'u',replace:'ufat',textRegex:'u{1}',replaceRegex:'ufat{1}'},
]

/*EVENTOS*/
writerContainer.addEventListener('click', writerOnFocus);
writerContainer.addEventListener('blur', writerLostFocus);
document.body.addEventListener('keydown', (ev) => modifyLastLetterToWriter(ev));
document.body.addEventListener('paste', (ev) => pasteTextToWriter(ev));
document.addEventListener("selectionchange", modifySelectedTextFromWriter);

/*FUNCIONES*/
/*-----WRITER-------*/
function modifyLastLetterToWriter(ev){
    if(writerIsFocused){
        var caretNode = document.querySelector(NOMBRE_CARET_WRITER);
        writer.removeChild(caretNode);
        var previousText = writer.textContent;
        if(ev.key.length == 1 && !ev.ctrlKey && esTextoLetrasMinusculas(ev.key)){
            if(isWriterTextSelected){
                writer.textContent = previousText.substring(0,arrayPostionWriterTextSelected[0]) + ev.key + previousText.substring(arrayPostionWriterTextSelected[1], previousText.length);
                isWriterTextSelected = false;
                arrayPostionWriterTextSelected = [];
            }
            else
                writer.textContent = previousText + ev.key;
        }else if((ev.key == "Backspace" || ev.key == "Delete") && previousText != DEFAULT_TEXT_WRITER){
            if(isWriterTextSelected){
                writer.textContent = previousText.substring(0,arrayPostionWriterTextSelected[0]) + previousText.substring(arrayPostionWriterTextSelected[1], previousText.length);
                isWriterTextSelected = false;
                arrayPostionWriterTextSelected = [];
            }
            else if(ev.key == "Backspace")
                writer.textContent = previousText.slice(0,-1)
        }
        writer.appendChild(caretNode);
    }
}

function pasteTextToWriter(ev){
    if(writerIsFocused){
        var paste = (ev.clipboardData || window.clipboardData).getData("text");
        var caretNode = document.querySelector(NOMBRE_CARET_WRITER);
        writer.removeChild(caretNode);
        var previousText = writer.textContent;
        if(esTextoLetrasMinusculas(paste)){
            if(isWriterTextSelected){
                writer.textContent = previousText.substring(0,arrayPostionWriterTextSelected[0]) + paste + previousText.substring(arrayPostionWriterTextSelected[1], previousText.length);
                isWriterTextSelected = false;
                arrayPostionWriterTextSelected = [];
            }
            else
                writer.textContent = previousText + paste;
        }
        writer.appendChild(caretNode);
    }
}

function modifySelectedTextFromWriter(){
    var selection = window.getSelection();
    if(!selection.rangeCount){
        isWriterTextSelected = false;
        arrayPostionWriterTextSelected = [];
        return;
    }
    var range = window.getSelection().getRangeAt(0);
    var texto = "";    
    if(range.startContainer.parentNode.isSameNode(writer) && range.endContainer.parentNode.isSameNode(writer)){
        var startOffset = range.startOffset < DEFAULT_TEXT_WRITER.length ? DEFAULT_TEXT_WRITER.length : range.startOffset;
        var endOffset = range.endOffset < startOffset ? startOffset : range.endOffset;
        if(startOffset == endOffset){
            isWriterTextSelected = false;
            arrayPostionWriterTextSelected = [];
        }else{
            isWriterTextSelected = true;
            arrayPostionWriterTextSelected = [startOffset,endOffset];
        }
    }else{
        isWriterTextSelected = false;
        arrayPostionWriterTextSelected = [];
    }
}

function writerOnFocus(){
    writerIsFocused = true;
}

function writerLostFocus(){
    writerIsFocused = false;
}

function esTextoLetrasMinusculas(texto){
    var textoRegex = "([a-z ])";
    var flagsRegex = "g";
    var regex = new RegExp( textoRegex + '{' + texto.length + '}', flagsRegex);
    return regex.test(texto);
}

/*------READER------*/
function habilitarReader(){
    /*texto */
    var caretReader = reader.querySelector(NOMBRE_CARET_READER);
    reader.removeChild(caretReader);
    reader.textContent = DEFAULT_TEXTO_READER;
    reader.appendChild(caretReader);
    /*botón */
    var inicioBtn = btnReader.querySelector(NOMBRE_INICIO_BUTTON_READER);
    btnReader.removeChild(inicioBtn);
    btnReader.textContent = TEXTO_BUTTON_READER_DEFAULT;
    btnReader.insertBefore(inicioBtn,btnReader.firstChild);
    /*ocultar imagen */
    imgContainer.classList.add(NOMBRE_CLASE_HIDEN);
    /*mostrar div texto */
    readerContainer.classList.remove(NOMBRE_CLASE_HIDEN);
}

function escribirReader(texto){
    /*Cerrar animación anterior*/
    cerrarAnimacionActiva();
    /*botón */
    var inicioBtn = btnReader.querySelector(NOMBRE_INICIO_BUTTON_READER);
    btnReader.removeChild(inicioBtn);
    btnReader.textContent = TEXTO_BUTTON_READER_TERMINAR;
    btnReader.insertBefore(inicioBtn,btnReader.firstChild);
    /*texto */
    textoReader = texto;
    var caretReader = reader.querySelector(NOMBRE_CARET_READER);
    reader.removeChild(caretReader);
    reader.textContent = DEFAULT_TEXTO_READER;
    reader.appendChild(caretReader);
    let funcionAppendLetter = () => {
        var longitudAgregadaTexto = reader.textContent.length-DEFAULT_TEXTO_READER.length-caretReader.textContent.length;
        if(longitudAgregadaTexto >= texto.length)
        {
            window.clearInterval(idReaderAnimation);
            btnReader.removeChild(inicioBtn);
            btnReader.textContent = TEXTO_BUTTON_READER_COPIAR;
            btnReader.insertBefore(inicioBtn,btnReader.firstChild);
        }else{
            var first = reader.firstChild;
            first.textContent = first.textContent + texto.charAt(longitudAgregadaTexto);
        }
    }
    idReaderAnimation = setInterval(funcionAppendLetter, 50);
}

function terminarAnimacionEscritura(){
    /*Cerrar animación activa */
    cerrarAnimacionActiva();
    /*texto */
    var caretReader = reader.querySelector(NOMBRE_CARET_READER);
    reader.removeChild(caretReader);
    reader.textContent = DEFAULT_TEXTO_READER;
    reader.appendChild(caretReader);
    var first = reader.firstChild;
    first.textContent = first.textContent + textoReader;
    /*botón */
    var inicioBtn = btnReader.querySelector(NOMBRE_INICIO_BUTTON_READER);
    btnReader.removeChild(inicioBtn);
    btnReader.textContent = TEXTO_BUTTON_READER_COPIAR;
    btnReader.insertBefore(inicioBtn,btnReader.firstChild);
}

function copiarTextoReader(){
    /*Agregar texto al clipboard */
    navigator.clipboard.writeText(textoReader);
}

function cerrarAnimacionActiva(){
    if(idReaderAnimation)
        window.clearInterval(idReaderAnimation);
}

function botonReaderHandler(){
    /*texto en el boton */
    var textoBoton = "";
    var inicioBtn = btnReader.querySelector(NOMBRE_INICIO_BUTTON_READER);
    btnReader.removeChild(inicioBtn);
    textoBoton = btnReader.textContent;
    btnReader.insertBefore(inicioBtn,btnReader.firstChild);
    /*ejecutar función según texto del botón*/
    switch (textoBoton) {
        case TEXTO_BUTTON_READER_COPIAR:
            copiarTextoReader();
            break;
        case TEXTO_BUTTON_READER_TERMINAR:
            terminarAnimacionEscritura();
            break;
        default:
            break;
    }
}

/*------ENCRIPTADOR------*/
function encriptarTextoWriter(){
    /*texto writer*/
    var first = writer.firstChild;
    var textoWriter = first.textContent.substring(DEFAULT_TEXT_WRITER.length, first.textContent.length);
    /*Activar reader*/
    habilitarReader();
    /*Escribir texto encriptado en reader*/
    escribirReader(new Encriptador(textoWriter,listaTextosEncriptador).encriptarTexto());
}

function desencriptarTextoWriter(){
    /*texto writer*/
    var first = writer.firstChild;
    var textoWriter = first.textContent.substring(DEFAULT_TEXT_WRITER.length, first.textContent.length);
    /*Activar reader*/
    habilitarReader();
    /*Escribir texto encriptado en reader*/
    escribirReader(new Encriptador(textoWriter,listaTextosEncriptador).desencriptarTexto());
}

function verificarTexoVacio(texto){
    return texto === ""|| texto == null;
}

class Encriptador{
    constructor(texto, listaEncriptacion){
        this.textoAEncriptar = texto;
        this.listaTextosAEncriptar = listaEncriptacion;
        this.listaRangosEncriptados = [];
    }

    encriptarTexto(){
        if(verificarTexoVacio(this.textoAEncriptar))
            return MENSAJE_TEXTO_VACIO;
        let textoEncriptado = "";
        let textoBuscado = "";
        let textoRemplazo = "";
        let textoBuscadoRegex = "";
        let regex = null;
    
        let listaTextosEncontrados = [];

        let posInicioTextoEncontrado = 0;
        let posFinTextoEncontrado = 0;

        let acumuladoDeplazamientos = 0;

        for(var indexTextoBuscado = 0; indexTextoBuscado < this.listaTextosAEncriptar.length; indexTextoBuscado++){
            acumuladoDeplazamientos = 0;
            textoBuscado = this.listaTextosAEncriptar[indexTextoBuscado].text;
            textoRemplazo = this.listaTextosAEncriptar[indexTextoBuscado].replace;
            textoBuscadoRegex = this.listaTextosAEncriptar[indexTextoBuscado].textRegex;
            regex = new RegExp(textoBuscadoRegex,'g');
            listaTextosEncontrados = [...this.textoAEncriptar.matchAll(regex)];
            for(var indexTextoEncontrado = 0; indexTextoEncontrado < listaTextosEncontrados.length; indexTextoEncontrado++){
                posInicioTextoEncontrado = acumuladoDeplazamientos + listaTextosEncontrados[indexTextoEncontrado].index;
                posFinTextoEncontrado = posInicioTextoEncontrado + textoBuscado.length - 1;
                if(!(this.#positionHasBeenReplaced(posInicioTextoEncontrado) || this.#positionHasBeenReplaced(posFinTextoEncontrado))){
                    this.#replaceSubstring(posInicioTextoEncontrado,textoBuscado.length, textoRemplazo);
                    acumuladoDeplazamientos += textoRemplazo.length - textoBuscado.length;
                }
            }
        }
        textoEncriptado = this.textoAEncriptar;
        return textoEncriptado;
    }

    desencriptarTexto(){
        if(verificarTexoVacio(this.textoAEncriptar))
            return MENSAJE_TEXTO_VACIO;
        let textoEncriptado = "";
        let textoBuscado = "";
        let textoRemplazo = "";
        let textoBuscadoRegex = "";
        let regex = null;
    
        let listaTextosEncontrados = [];

        let posInicioTextoEncontrado = 0;
        let posFinTextoEncontrado = 0;

        let acumuladoDeplazamientos = 0;

        for(var indexTextoBuscado = this.listaTextosAEncriptar.length - 1; indexTextoBuscado > -1; indexTextoBuscado--){
            acumuladoDeplazamientos = 0;
            textoBuscado = this.listaTextosAEncriptar[indexTextoBuscado].replace;
            textoRemplazo = this.listaTextosAEncriptar[indexTextoBuscado].text;
            textoBuscadoRegex = this.listaTextosAEncriptar[indexTextoBuscado].replaceRegex;
            regex = new RegExp(textoBuscadoRegex,'g');
            listaTextosEncontrados = [...this.textoAEncriptar.matchAll(regex)];
            for(var indexTextoEncontrado = 0; indexTextoEncontrado < listaTextosEncontrados.length; indexTextoEncontrado++){
                posInicioTextoEncontrado = acumuladoDeplazamientos + listaTextosEncontrados[indexTextoEncontrado].index;
                posFinTextoEncontrado = posInicioTextoEncontrado + textoBuscado.length - 1;
                if(!(this.#positionHasBeenReplaced(posInicioTextoEncontrado) || this.#positionHasBeenReplaced(posFinTextoEncontrado))){
                    this.#replaceSubstring(posInicioTextoEncontrado,textoBuscado.length, textoRemplazo);
                    acumuladoDeplazamientos += textoRemplazo.length - textoBuscado.length;
                }
            }
        }
        textoEncriptado = this.textoAEncriptar;
        return textoEncriptado;
    }

    #replaceSubstring(startposition,length,replace){
        let endPosition = startposition + length - 1;
        let lenghtDifference = replace.length - length;

        this.textoAEncriptar = this.textoAEncriptar.substring(0,startposition) + replace + this.textoAEncriptar.substring(endPosition + 1, this.textoAEncriptar.length);

        this.#moveUpperReplacements(endPosition,lenghtDifference);
        let replacement = {start: startposition, end:startposition + replace.length - 1}
        this.listaRangosEncriptados.push(replacement);
    }

    #moveUpperReplacements(startPosition,stepLength){
        let itemEndPos = 0;
        let itemStartPos = 0;
        for(var replacementIndex = 0; replacementIndex < this.listaRangosEncriptados.length; replacementIndex++){
            itemEndPos = this.listaRangosEncriptados[replacementIndex].end;
            if(itemEndPos >= startPosition){
                itemStartPos =  this.listaRangosEncriptados[replacementIndex].start;
                this.listaRangosEncriptados[replacementIndex].end = itemEndPos + stepLength;
                if(itemStartPos >= startPosition)
                    this.listaRangosEncriptados[replacementIndex].start = itemStartPos + stepLength;
            }
        }
    }

    #positionHasBeenReplaced(position){
        for(var replacementIndex = 0; replacementIndex < this.listaRangosEncriptados.length; replacementIndex++){
            if(position >= this.listaRangosEncriptados[replacementIndex].start && position <= this.listaRangosEncriptados[replacementIndex].end)
                return true;
        }
        return false;
    }
}