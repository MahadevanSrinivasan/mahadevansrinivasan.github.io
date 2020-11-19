var handle;
var getNextSolution;
function setBoard()
{
    const resultPointer = getNextSolution(handle);
    const board = new Uint8Array(Module.HEAP8.buffer, resultPointer, 64);
    for(var i = 0; i < board.length; i++)
    {
        const cellip = document.getElementById(i);
        if(board[i])
        {
            cellip.value = "\u265b";
        }
        else
        {
            cellip.value = "";
        }
    }
    setTimeout(setBoard,2000);
}

document.addEventListener('DOMContentLoaded', function() {
    Module.onRuntimeInitialized = _ => {
        const createNqueens = Module.cwrap('Create', 'number', ['number']);
        const getNumSolutions = Module.cwrap('GetNumSolutions', 'number', ['number']);
        getNextSolution = Module.cwrap('GetNextSolution', 'number', ['number']);
        handle = createNqueens(8);
        console.log(getNumSolutions(handle));
        setBoard();
    };
}, false);
