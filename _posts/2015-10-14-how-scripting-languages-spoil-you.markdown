---
layout: post
title:  "How scripting languages spoil you"
date:   2015-10-14 21:51:00
tags: raspberry pi 64bit overflow typecast C
---

I love Python. But, I have to admit that it spoils you. I just spent 20 minutes trying to code up a simple program to do linear regression. This problem looks deceptively simple. In fact, it *is* deceptively simple, *on paper*. 

Here is the problem. You have a set of numbers X and another set of number Y. Find the linear fit that best describes the relation between Y and X. Here is an (example)[http://www.stat.wmich.edu/s216/book/node126.html] that I took. Copying the numbers here for easy reference. `miles[]` represent X and `price[]` represent Y. 

{% highlight c %}
int miles[] = {9300, 10565, 15000, 15000, 17764,
               57000, 65940, 73676, 77006, 93739,
               146088, 153260};
int price[] = {7100, 15500, 4400, 4400, 5900, 4600,
               8800, 2000, 2750, 2550, 960, 1025};
{% endhighlight %}

### Raspberry Pi & 64 bit arithmetic

Computation of Mean is so simple I won't go over it. Let us go into the standard deviation computation. To compute standard deviation, we need take every element, find how far it is from the mean, square it to make it a positive number. Do this calculation for all the elements and average them up. Another minor thing to take into account is how to average them up. If you have N elements, you could either divide by N or (N-1) to compute the average. More information on the wikipedia article on (standard deviation)[https://en.wikipedia.org/wiki/Standard_deviation#Estimation]. For our calculation, we will use N-1. 

That's quite easy. Loop over each element using a for loop and compute the sum of the *deviations* first. That's where I hit my first roadblock. I was happily declaring all the variables as integers and to make things worse I was running my program on a Raspberry Pi (which is a 32-bit machine). I coded up everything and out comes the result which is totally unexpected. Started scratching my head. Let us call mean of `miles[]` as `xbar` which computes to 61194. What was happening was, `(miles[0] - xbar)*(miles[0] - xbar)` was happily overflowing. Computing it manually (of course I used a Calculator), it is `(9300 - 61194) * (9300 - 61194) = 2692987236` which was happily overflowing the signed integer number I had blissfully declared. So, I figured that out and got cocky again. Made the standard deviation variable a `long` and ran the program again. My Pi FU-ed me again. Turns out, `long` is not that long. In Raspberry Pi, I have to use `long long` to get to 64 bits. 

### Typecasting

Next lesson I learned today was about typecasting. Look at this very simple C program. Without the typecast, you end up overflowing the data. Why? `a` is defined as a signed number. When we do the multiplication without the cast, we first do a signed mutliplication which goes over 32 bits. And then we try to fit this into the variable b which is also unsigned. C sign extends the data and you end up with a negative number. On the other hand, if you do the cast, you first create enough room to store a 64 bit number and then do the multiplication. This fixes the overflow. Another way to fix this problem would be, if you know your number `a` is going to be unsigned, you could define it as unsigned. But still it is only a matter of time before we end up with a value of 65536 or more as `a` to cause the overflow. So, always be cautious and know your limits.

{% highlight c %}
int main()
{
     int a = 61194;
     long long b = 0;
 
     b = a * a; // b = -550261660, Wrong!
     printf("b = %lld\n", b); 
     b = (long long) a * a; // b = 3744705636, Correct!
     printf("b = %lld\n", b);
 
     return 0;
}
{% endhighlight %}

### Bottomline

Knowing C makes you a strong programmer. But it starts with getting kicked right on your nuts! You can find my final program right here on my (Github Repository)[https://github.com/MahadevanSrinivasan/cprograms/blob/master/linearfit.c].
