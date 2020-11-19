---
layout: "post"
title:  "Nqueens using Webassembly"
date:   2020-11-18 17:27:00
tags: nqueens 8queens webassembly wasm hide javascript
---

In the last post, we discussed the 8 queens problem and showed some C++ code. But, when we wanted to use it in Web (without any server side interaction), we had to give away our source code and also had to rewrite everything in Javascript. Is there a way to hide the code and also reuse the C++ code, you ask? Yes, there is. It is called [Webassembly](https://webassembly.org/). I will show you how. 

### Webassembly basics

Thankfully, there is a webassembly compiler toolchain called [Emscripten](https://emscripten.org/index.html) that can easily compile your C/C++ code. For our use case, we are going to compile a single program. So, we could simply call the `emcc` compiler instead of `g++`. If you have a bigger project that uses something like CMake, emcc can still compile it without any issues. 

To avoid the hassle of setting up my own build environment, I went the docker route. If you are not familiar with docker, I will cover it in another post. For now, think of it as a virtual machine that comes with all the dependencies needed to do a specific task (in our case, compile programs with emscripten toolchain).

The only requirement to interface your native code with Javascript is the need for pure C functions. This is because C++ compilers mangle the symbol names. So, I have modified my C++ nqueens code to add C interfaces for the functions we need to call from Webassembly. In this case, there is a `Create` function that solves the Nqueens problem. There is a `GetNumSolutions` function that returns the number of possible solutions and a `GetNextSolution` function that returns the array of results in sequential order every time it is called. I have marked these three functions as C by wrapping them around `extern "C"`. Finally, I have added a tag `EMSCRIPTEN_KEEPALIVE` for these functions to let emscripten know that these functions should not be optimized out since they are not called. Note how we don't have a main function. 

{% highlight c %}
#include <vector>
#ifdef __EMSCRIPTEN__
// This is where EMSCRIPTEN_KEEPALIVE is defined
// Without this macro, these functions will not be exported
// as they are not called by anyone explicitly
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

using namespace std;

class NQueens
{
public:
    NQueens(int _N) : N(_N)
    {
        board.resize(N*N);
        curr = 0;
        solve(0);
    }
    int count()
    {
        return solutions.size();
    }
    char* get_next_solution()
    {
        curr = (curr + 1) % solutions.size();
        return solutions[curr].data();
    }
private:
    int N;
    int curr;
    vector<char> board;
    vector<vector<char> > solutions;
    int a(int i, int j)
    {
        return i*8+j;
    }

    char is_pos_valid(int row, int col)
    {
        int i = 0, j = 0;

        /* Only placed queens till row-1, no need to search further */
        for(i = 0; i < row; i++)
        {
            if(board[a(i,col)]) return false;
        }
        /* Go above current row, towards the left diagonal */
        for(i = row, j = col; i  >= 0 && j >= 0; i--, j--)
        {
            if(board[a(i,j)]) return false;
        }
        /* Go above current row, towards the right diagonal */
        for(i = row, j = col; i >= 0 && j < N; i--, j++)
        {
            if(board[a(i,j)]) return false;
        }

        return true;
    }

    void solve(int row)
    {
        if(row == N)
        {
            solutions.push_back(board);
            return;
        }

        for(int i = 0; i < N; i++)
        {
            if(is_pos_valid(row, i))
            {
                board[a(row, i)] = true;
                solve(row+1);
                board[a(row, i)] = false;
            }
        }
    }
};
#ifdef __cplusplus
extern "C" {
#endif

    void* Create(int N);
    int GetNumSolutions(void* handle);
    char* GetNextSolution(void* handle);

#ifdef __cplusplus
} // extern "C" 
#endif

EMSCRIPTEN_KEEPALIVE void* Create(int N)
{
    return new NQueens(8);
}

EMSCRIPTEN_KEEPALIVE int GetNumSolutions(void* handle)
{
    NQueens* n = (NQueens *) handle;
    return n->count();
}

EMSCRIPTEN_KEEPALIVE char* GetNextSolution(void* handle)
{
    NQueens* n = (NQueens *) handle;
    return n->get_next_solution();
}

{% endhighlight %}


### How to compile this program?

[Emscripten](https://emscripten.org/index.html) website has excellent documentation. You can consult that site for more details. For our case, I used the following command on my Windows machine to compile the C++ code to Webassembly. 

{% highlight bash %}
docker run --rm -v /path/to/code:/src -w /src emscripten/emsdk emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS=["cwrap"] nqueens.cpp
{% endhighlight %}

This command emits out two files: `a.out.js` and `a.out.wasm`. The Javascript file is an auto-generated wrapper to access our exposed webassembly functions. `a.out.wasm` is the binary file containing our compiled code - much like an object file. Our implementation is completely hidden. Great!

### How to access the Webassembly code from Javascript?

Again, Emscripten covers a lot of this. I also consulted this [Google Developer page](https://developers.google.com/web/updates/2018/03/emscripting-a-c-library) for my reference. It is a great read! I recommend going through it once. Here is the javascript code I had to write to interface with Webassembly. Note, how we use `number` for pointers. You can find more information about different types that are available [here](https://emscripten.org/docs/api_reference/preamble.js.html#cwrap).

{% highlight javascript %}

document.addEventListener('DOMContentLoaded', function() {
    Module.onRuntimeInitialized = _ => {
        const createNqueens = Module.cwrap('Create', 'number', ['number']);
        const getNumSolutions = Module.cwrap('GetNumSolutions', 'number', ['number']);
        const getNextSolution = Module.cwrap('GetNextSolution', 'number', ['number']);
        handle = createNqueens(8);
        console.log(getNumSolutions(handle));
        const resultPointer = getNextSolution(handle);
        const board = new Uint8Array(Module.HEAP8.buffer, resultPointer, 64);
        console.log(board);
    };
}, false);

{% endhighlight %}

### Live demo

How about a live demo? Of course. I am using the same [frontend code](http://theshybulb.com/nqueens.html) as last time. But, in the [new version](http://theshybulb.com/nqueens_wasm.html), I am using the Webassembly interface described above. This means, we are actually running C++ code in the browser. Hurray! Hit me up if you have any questions. 