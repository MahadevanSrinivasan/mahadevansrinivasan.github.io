---
layout: post
title:  "Ultimate guide to pointers"
date:   2015-10-07 19:54:00
tags: pointers c
---

Pointers in C are one of the most confusing concepts. I am going to document
how pointers work in the order of increasing complexity.

### Simple example of an integer pointer

A pointer variable is specific to a specific type. For example, if you want
to point to an integer variable, you define it as `int *p`. The asterisk says
that p can point to an integer. Right now, it is pointing to nothing. In C, nothing
is `NULL`. To make it point to an integer `x`, you do it like on line 11. Below 
example also shows how to pass the variable x as a pointer to a different function. 

{% highlight c %}
#include <stdio.h>

void printvalueofx(int *p)
{
	printf("printvalueof: Addr: %p,  Value = %d\n", p, *p);
}

int main(void)
{
	int x = 12;
	int *p = &x;

	printf("x = %d\n", x);
	*p = 42;
	printf("main: Addr: %p, Value = %d\n", p, *p);
	/* Pass the pointer to the function */
	printvalueofx(p);

	return 0;
}
{% endhighlight %}


