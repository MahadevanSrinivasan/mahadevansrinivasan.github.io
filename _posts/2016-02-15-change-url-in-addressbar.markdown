---
layout: post
title:  "Little Javascript tricks for your chrome extension"
date:   2016-02-15 12:51:00
tags: javascript chromeextension
---

While developing my chrome plugin [Shut up and cast]({% post_url 2015-10-18-announcing-shutupandcast %}), I learned a lot of tricks in Javascript. I shared one of them in them in the [last post]({% post_url 2016-01-16-data-from-chromeextension-to-website }). In this post, I am planning to share a few small tricks.

### Change the URL in the address bar without reloading the page

When you send a GET data to your webpage, you most often than not end up with a long URL. Sometimes, you don't want to expose your data as well. Of course, if you want to completely hide it, you can use a POST request. As discussed in our previous post, POST needs a redirect and hence is slower. So, if you are not super worried about secrecy but at the same time want a simple way to hide the data, you can do a small javascript trick to change your URL without a page reload. 

{% highlight js %}
window.history.pushState("", "Sometitle", "/newurl.html");
{% endhighlight %}

Let us say your URL had some clunky data like `http://yoursite.com/newurl.html?data=value&data2=value2`. Running the above Javascript code will modify the address bar value to `http://yoursite.com/newurl.html`. All you are doing is moving the old page to your history and updating the URL. 

### Continuously updating things while hovering over element

Let us say you want to update some data when the user moves their mouse over an element. The event you are interested in is `mousemove` as in the following example. 

{% highlight js %}
document.getElementById("element").addEventListener('mousemove', mousemoveHandler);
{% endhighlight %}

This works quite well but you could do handle the events a little better by adding a small check in your mousemoveHandler function like the following:

{% highlight js %}
function mousemoveHandler(event)
{
  var x, y;
  if(event.offsetX == x && event.offsetY == y) {
    return;
  }
  // Rest of your function goes here
}
{% endhighlight %}

### Periodic updates

To do some periodic updates, you need to use a timer. Let us say, you need to call a function every second. Following example does that:

{% highlight js %}
var globalTimer = null;
function periodicFunction()
{
  // Do your periodic processing here
  globalTimer = setTimeout(periodicFunction, 1000);
}
{% endhighlight %}

This is perfect. But, you need to be careful that the periodicFunction won't be called more than once. If that happens, there is nothing stopping from creating two timers or worse several. That's why it is a good idea to save the timer information to a global variable. Wit thism you can clear the timer if needed to stop the periodic update. And then, when needed again, you can start it.

{% highlight js %}
if(globalTimer)
  clearInterval(globalTimer);
periodicFunction();
{% endhighlight %}

