const NOMBRE_DIV_WRITER = '#div_writer';
const NOMBRE_SPAN_WRITER = "#span_writer";
const NOMBRE_CARET_WRITER = "#caret_writer";
const DEFAULT_TEXT_WRITER = ">\u00A0"

let writerIsFocused = false;
let isWriterTextSelected = false;
let arrayPostionWriterTextSelected = [];
let writerContainer = document.querySelector(NOMBRE_DIV_WRITER);
let writer = document.querySelector(NOMBRE_SPAN_WRITER);

writerContainer.addEventListener('click', writerOnFocus);
writerContainer.addEventListener('blur', writerLostFocus);
document.body.addEventListener('keydown', (ev) => modifyLastLetterToWriter(ev));
document.body.addEventListener('paste', (ev) => pasteTextToWriter(ev));
document.addEventListener("selectionchange", modifySelectedTextFromWriter);

/*FUNCIONES*/
function modifyLastLetterToWriter(ev){
    if(writerIsFocused){
        var caretNode = document.querySelector(NOMBRE_CARET_WRITER);
        writer.removeChild(caretNode);
        var previousText = writer.textContent;
        if(ev.key.length == 1 && !ev.ctrlKey){
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
        if(isWriterTextSelected){
            writer.textContent = previousText.substring(0,arrayPostionWriterTextSelected[0]) + paste + previousText.substring(arrayPostionWriterTextSelected[1], previousText.length);
            isWriterTextSelected = false;
            arrayPostionWriterTextSelected = [];
        }
        else
            writer.textContent = previousText + paste;
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