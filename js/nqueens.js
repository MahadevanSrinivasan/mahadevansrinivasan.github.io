class Nqueens {
    constructor(N) {
        this.N = N;
        this.N2 = N*N;
        this.board = Array(this.N2);
        this.solutions = Array();
        for(var i = 0; i < this.N2; i++)
        this.board[i] = false;
        this.solve(0);
        console.log(this.solutions.length);
    }
    
    a(i, j)
    {
        return i*this.N+j;
    }
    
    is_move_possible(row, col)
    {
        var i = 0, j = 0;
        for(i = 0; i < row; i++)
        {
            if(this.board[this.a(i,col)]) return false;
        }
        
        for(i = row, j = col; i >= 0 && j >= 0; i--,j--)
        {
            if(this.board[this.a(i,j)]) return false;
        }
        
        for(i = row, j = col; i >= 0 && j < this.N; i--,j++)
        {
            if(this.board[this.a(i,j)]) return false;
        }
        
        return true;
    }
    
    solve(row)
    {
        if(row == this.N) 
        {
            this.solutions.push(Array.from(this.board));
        }
        for(var i = 0; i < this.N; i++)
        {
            var idx = this.a(row, i);
            if(this.is_move_possible(row, i))
            {
                this.board[idx] = true;
                this.solve(row+1);
                this.board[idx] = false;
            }
        }
    }
    
}

var solns;
var curr = 0;

function setBoard()
{
    curr = (curr + 1) % solns.length;
    board = solns[curr];
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
    n = new Nqueens(8);
    solns = n.solutions;
    setBoard();
}, false);
