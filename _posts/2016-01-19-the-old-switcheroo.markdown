---
layout: post
title:  "The Old Switcheroo"
date:   2016-01-19 22:13:00
tags: switch quirk c
---

I recently learned (the hard way, as usual) something about the Switch statement in C. I had a part of code which I want executed for all the cases in the switch statement. So I naively put that statement just above the first case statement inside the switch structure.

Take a look at this simplified version of the code:

{% highlight c %}
#include <stdio.h>
int main()
{
  int b = 100;
  int i = 0;
  switch (i)
  {
    b = 10; // This statement never executes
    case 0:
      printf("b = %d\n", b);
    break;
    default:
      break;
  }
  return 0;
}
{% endhighlight %}

`b = 10` is the common code that I want executed for all the values of `i`. To my surprise, the above program returned an output of 100 and the worst part is gcc does not throw any warnings even with the `-Wall` option.

Solution is quite simple. Move the `b = 10` statement above the switch statement. Don't know if it is a quirk of the language or if it is expected. I will provide an update if I find any more details.
