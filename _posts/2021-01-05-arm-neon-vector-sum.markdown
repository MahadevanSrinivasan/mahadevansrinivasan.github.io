---
layout: "post"
title:  "ARM NEON vector sum"
date:   2021-01-04 23:27:00
tags: ARM NEON vector sum SIMD Intrinsics
---

Recently I was working on optimizing a piece of code for ARM architecture using NEON intrinsics. But, I found the documentation quite dense for beginners. This is an introduction post for those interested in optimizing their code for ARM processors. If you are not familiar with it, the usual way to optimize math operations for ARM processors is by using the [NEON](https://developer.arm.com/architectures/instruction-sets/simd-isas/neon) instruction set. Basic idea is to load several items into the registers and do operations in batches. 

## Codekata: Vector Sum

To give a slightly more concrete example, let us optimize the code for adding two vectors of floating point numbers element by element. To make it interesting, I am going to implement this in several ways.

### Naive implementation

In plain C++, you would do such an operation as follows. Note I have a couple of helper functions to time the subroutine implemented as C++ lambdas. Also, there is a `check_answer` function that returns true if the results are as expected.

{% highlight c++ %}

auto tic = [](){ return std::chrono::high_resolution_clock::now(); };
auto toc = [](auto tic) {std::chrono::duration<double> elapsed = std::chrono::high_resolution_clock::now() - tic; return elapsed.count(); };

double sum_vectors_naive(std::vector<float> a, std::vector<float> b)
{
    std::vector<float> ans(a.size());
    auto t0 = tic();
    for(size_t i = 0; i < a.size(); i++)
    {
        ans[i] = a[i] + b[i];
    }
    auto t1 = toc(t0);
    assert(check_answer(ans));
    return t1;
}

{% endhighlight %}

### STL implementation

One could also use the [transform](https://en.cppreference.com/w/cpp/algorithm/transform) function in STL to compute the sum. Interestingly, this approach runs at half the speed for a vector of size 4096. 

{% highlight c++ %}

double sum_vectors_stl(std::vector<float> a, std::vector<float> b)
{
    std::vector<float> ans(a.size());
    auto t0 = tic();
    std::transform(a.begin(), a.end(), b.begin(), ans.begin(), std::plus<>());
    auto t1 = toc(t0);
    assert(check_answer(ans));
    return t1;
}

{% endhighlight %}

### NEON implementation first stab

This implementation needs a bit of explanation. It uses three NEON intrinsics: `vld1q_f32`, `vaddq_f32` and `vst1q_f32`. Let us dissect them one by one.

[vld1q_f32](https://developer.arm.com/architectures/instruction-sets/simd-isas/neon/intrinsics?search=vld1q_f32) has the following function signature: `float32x4_t vld1q_f32 (float32_t const * ptr)`. It takes a pointer to a 32-bit floating point array and loads 4 values into register(s). For now, ignore the 1 in the name of the function. We will get back to it in a bit. 


[vaddq_f32](https://developer.arm.com/architectures/instruction-sets/simd-isas/neon/intrinsics?search=vaddq_f32) is where the magic happens. It has the function signature: `float32x4_t vaddq_f32 (float32x4_t a, float32x4_t b)`. This means it can add 4 pairs of float at the same time. 

[vst1q_f32](https://developer.arm.com/architectures/instruction-sets/simd-isas/neon/intrinsics?search=vst1q_f32) does the reverse of `vld1q_f32`. Saves the values from the register(s) into an array pointed by the pointer.

{% highlight c++ %}

double sum_vectors_neonx1(std::vector<float> a, std::vector<float> b)
{
    std::vector<float> ans(a.size());
    auto t0 = tic();
    for(size_t i = 0; i < a.size(); i += 4)
    {
        auto ax = vld1q_f32(a.data() + i);
        auto bx = vld1q_f32(b.data() + i);
        float32x4_t cx = vaddq_f32(ax, bx);
        vst1q_f32(ans.data() + i, cx);
    }
    auto t1 = toc(t0);
    assert(check_answer(ans));
    return t1;
}

{% endhighlight %}

How fast does this run? In my experiments this runs 1.6x faster than the naive implementation for a 4096 length vector. That's a nice 60% boost.

### NEON implementation second stab

This implementation uses three new NEON intrinsics: `vld4q_f32`, `vaddq_f32` and `vst4q_f32`. They are very similar to the previous intrinsics except they load 16 floats at a time. Remember how we skipped over the 1 in `vld1q_f32` instruction. That number decides how ARM interleaves the data. With 1, there is no interleaving. 

To understand the interleaving done by `vld4q_f32`, imagine a vector {1.0, 2.0, ... , 16.0}. When ARM loads these 16 floats into registers, it loads them as follows: {1.0, 4.0, 8.0, 12.0, 2.0, 6.0, 10.0, 14.0, 3.0, 7.0, 11.0, 15.0, 4.0, 8.0, 12.0, 16.0}. Given that we load and store them using interleaving of 4 and we are only operating on two elements at a time, we can get away with this. 

You may think, why is there a need for such interleaving? Why can't we just load them in order? Imagine your data is an image and you have stored them in RGB format. You can easily load them into registers with `vld3q_*` and get all the Rs in the first register, all the Gs in the second and all the Bs in the third. Yes, it does make it a little complicated if you don't need that and you want to load a bigger contiguous chunk. Looks like ARM is realizing the usefulness and [adding some additional intrinsics](https://developer.arm.com/architectures/instruction-sets/simd-isas/neon/intrinsics?search=vld1q_f32_x4), but they are not available with all the compilers yet. As of this writing, `vld1q_f32_x4` is not available with gcc 9.3.0 shipped with Raspberry Pi 4. 

{% highlight c++ %}

double sum_vectors_neonx4(std::vector<float> a, std::vector<float> b)
{
    std::vector<float> ans(a.size());
    auto t0 = tic();
    for(size_t i = 0; i < a.size(); i += 16)
    {
        auto ax = vld4q_f32(a.data() + i);
        auto bx = vld4q_f32(b.data() + i);
        float32x4x4_t cx;
        cx.val[0] = vaddq_f32(ax.val[0], bx.val[0]);
        cx.val[1] = vaddq_f32(ax.val[1], bx.val[1]);
        cx.val[2] = vaddq_f32(ax.val[2], bx.val[2]);
        cx.val[3] = vaddq_f32(ax.val[3], bx.val[3]);
        vst4q_f32(ans.data() + i, cx);
    }
    auto t1 = toc(t0);
    assert(check_answer(ans));
    return t1;
}

{% endhighlight %}

How fast is this implementation? It is ~1.9x faster for a 4096 vector sum. 

### Test driver code

Finally, here is the main function that calls all these implementations and benchmarks them. 

{% highlight c++ %}

#include <vector>
#include <numeric>
#include <algorithm>
#include <iostream>
#include <arm_neon.h>
#include <chrono>
#include <assert.h>

bool check_answer(std::vector<float> ans)
{
    if (std::all_of(ans.cbegin(), ans.cend(), [](float i){ return abs(i - 3.0f) <= 1e-5; })) {
        return true;
    }
    return false;
}

int main(int argc, char* argv[])
{
    const size_t num_elements = 4096;
    std::vector<float> a(num_elements, 1.0f);
    std::vector<float> b(num_elements, 2.0f);
    std::vector<double> results(4, 0.0);
    for(int i = 0; i < 1000; i++)
    {
        results[0] += (sum_vectors_naive(a, b));
        results[1] += (sum_vectors_stl(a, b));
        results[2] += (sum_vectors_neonx1(a, b));
        results[3] += (sum_vectors_neonx4(a, b));
    }
    double base = results[0];
    std::transform(results.begin(), results.end(), results.begin(), [base](double val) {return base / val;});
    print_vector(results);
    return 0;
}

{% endhighlight %}