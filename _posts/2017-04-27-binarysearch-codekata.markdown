---
layout: post
title:  "Binary Search"
date:   2017-04-27 21:37:00
tags: algorithm binary search codekata 
---

Binary Search is probably one of the first algorithms Computer Science students learn. It is quite simple to implement but you are likely to run into a couple of corner case scenarios. As [codekata](http://codekata.com/kata/kata02-karate-chop/) puts it, practicing it over and over helps. Not just praciticing writing the same code, but trying to achieve the same results through different implementations. A note on choice of language: I chose Python for its simplicity of accessing and slicing lists. 

### Test cases

Let's start with the test cases. There aren't that many - empty list, odd sized list and even sized list. All with and without the search term. Here is codekata's test case list in Python. This function takes in a binary search implementation whose signature is `(int, array_of_int) -> int` and runs through all the test cases.

{% highlight python %}
def testbinarysearch(f):
  assert(-1 == f(3, []))
  assert(-1 == f(3, [1]))
  assert(0 == f(1, [1]))
  #
  assert(0 == f(1, [1, 3, 5]))
  assert(1 == f(3, [1, 3, 5]))
  assert(2 == f(5, [1, 3, 5]))
  assert(-1 == f(0, [1, 3, 5]))
  assert(-1 == f(2, [1, 3, 5]))
  assert(-1 == f(4, [1, 3, 5]))
  assert(-1 == f(6, [1, 3, 5]))
  #
  assert(0 == f(1, [1, 3, 5, 7]))
  assert(1 == f(3, [1, 3, 5, 7]))
  assert(2 == f(5, [1, 3, 5, 7]))
  assert(3 == f(7, [1, 3, 5, 7]))
  assert(-1 == f(0, [1, 3, 5, 7]))
  assert(-1 == f(2, [1, 3, 5, 7]))
  assert(-1 == f(4, [1, 3, 5, 7]))
  assert(-1 == f(6, [1, 3, 5, 7]))
  assert(-1 == f(8, [1, 3, 5, 7]))
{% endhighlight %}

### Iterative solution

Most obvious solution is an iterative one, atleast to me. There are a couple of places one could go wrong here. First is the while loop's exit condition. It should be `lo <= hi` otherwise when the search item is the final element of a split, you will not find it. For example, solve test cases 3 and 4 by hand and see what happens if the while condition is wrong. 

Next is the way we compute the `mid` value. This is not a big concern for Python but in languages like C, doing `(hi + lo)/2` could result in an overflow when your list size is large. This is one of the [long standing bugs in binary search](https://research.googleblog.com/2006/06/extra-extra-read-all-about-it-nearly.html).

Finally the `return` statement outside the while loop. This handles the search fail case. 

{% highlight python %}
def binarysearch(s, l):
  lo = 0
  hi = len(l) - 1
  while(lo <= hi):
    mid = (hi - lo)/2 + lo
    if(l[mid] == s):
      return mid
    elif(l[mid] < s):
      lo = mid + 1
    else:
      hi = mid - 1
  return -1
{% endhighlight %}

### Recursive solution

Recursive solution is not that hard either. You just need an additional wrapper function to use the predefined function signature. Instead of a while loop, we have an if condition. One might think that we do not need that if condition. Think again. Without it, we will fall into an infinite loop. Another pitfall is in the `elif` and `else` condition. It is easy to forget the `return` and just call the function. That will again result in an infinite loop. Other than these two things, nothing much to say about the recursive solution.

{% highlight python %}
def binarysearch2(s, l):
  return binarysearchrecursive(s, l, 0, len(l) - 1)

def binarysearchrecursive(s, l, lo, hi):
  if(lo <= hi):
    mid = (hi - lo)/2 + lo
    if(l[mid] == s):
      return mid
    elif(l[mid] < s):
      return binarysearchrecursive(s, l, mid + 1, hi)
    else:
      return binarysearchrecursive(s, l, lo, mid-1)
  return -1
{% endhighlight %}

### Slicing solution

This uses some Python specialties - list slicing. Here instead of passing the entire list to the recursive function, we only pass in the list where our search term may be present. It may be tempting to implement it exactly like the recursive solution but with list slicing until you start running into failures. Reason for that is the expected return value. Return value is the index of the search element in the original list. Once you slice, you lose the original indexing (unless the search term is in the left half of all the splits). Only way to fix this is by passing the index of the left most element in the original list and adding it to the returned value. Think about it. 

{% highlight python %}
def binarysearchslice(s, l, offset):
  lo = 0
  hi = len(l) - 1
  if(lo <= hi):
    mid = (hi - lo)/2 + lo
    if(l[mid] == s):
      return (mid + offset)
    elif(l[mid] < s):
      return binarysearchslice(s, l[mid+1:], offset+mid+1)
    else:
      return binarysearchslice(s, l[:mid], offset)
  return -1

def binarysearch3(s, l):
  return binarysearchslice(s, l, 0)
{% endhighlight %}

### Conclusion

Codekata asks for 5 different solutions. I could only come up with these 3 in one day. I have not thought about other ways of solving this problem. I will update the blog post when I have more approaches. 
