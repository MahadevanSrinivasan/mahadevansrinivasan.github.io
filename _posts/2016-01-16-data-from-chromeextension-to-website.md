---
layout: post
title:  "Sending data to your site from your Chrome Extension"
date:   2016-01-16 21:18:00
tags: chrome extension get post request
---

### Opening a new tab with a specific address from your Chrome extension

This part is well documented in [Google's help articles](https://developer.chrome.com/extensions/tabs#method-create). For completeness sake, let us start with discussing this. Before we create a new tab, we should add permissions for accessing "chrome.tabs" in your `manifest.json`.

{% highlight json %}
"permissions": [
    "tabs"
  ],
{% endhighlight %}

Now we are ready to open a new tab. We need to do this from your `background.js` script. In the following example, we open a new tab when the *page action* button is clicked. If your extenstion does not use a *page action*, you could modify it to be used with a button click or some other event. Notice the **question mark** at the end of the URL. Of course, there should be a global variable named *data* which contains the get parameters.

{% highlight js %}

chrome.pageAction.onClicked.addListener(function sendData() {
  url = "http://yoursite.com/yourpage.html?";
  var params = [];
  for(key in data)
    params.push(encodeURIComponent(key) + "=" + data[key]);
  url = url + params.join("&");
  chrome.tabs.create({ url: url });
});

{% endhighlight %}

### Get is easy, Post is a little more complicated.

Sending a post request to one's site from a chrome extension is not as straightforward. We need an intermediate *local* HTML file which can in turn do a post request. In the below example, we first redirect to send.html (which is part of the chrome extension). This send.html contains javascript needed for the post request. Notice the *chrome.runtime.getURL* function call to get the absolute path of the send.html file. 

The first url is the website address you want to be redirected to eventually. Data to be sent with post is packaged as a javascript object for ease of extraction later. 

#### Code to be placed in background.js

{% highlight js %}
chrome.pageAction.onClicked.addListener(function sendData() {
  url = "http://yoursite.com/yourpage.html";
  data = {"key": value};
  chrome.tabs.create(
    { url: chrome.runtime.getURL("send.html") },
    function(tab) {
      var handler = function(tabId, changeInfo) {
        if(tabId === tab.id && changeInfo.status === "complete"){
          chrome.tabs.onUpdated.removeListener(handler);
          chrome.tabs.sendMessage(tabId, {url: url, data: data});
        }
      };

      // in case we're faster than page load (usually):
      chrome.tabs.onUpdated.addListener(handler);
      // just in case we're too late with the listener:
      chrome.tabs.sendMessage(tab.id, {url: url, data: data});
    }
  );  
});
{% endhighlight %}

#### Code to be placed in send.html

{% highlight html %}
<html>
  <head>
    <title>Redirecting...</title>
  </head>
  <body>
    <h1>Redirecting...</h1>
    <script src="post.js"></script>
  </body>
</html>
{% endhighlight %}

#### Code to be placed in post.js

{% highlight js %}
  var onMessageHandler = function(message){
  // Ensure it is run only once, as we will try to message twice
  chrome.runtime.onMessage.removeListener(onMessageHandler);

  var form = document.createElement("form");
  form.setAttribute("method", "LINK");
  form.setAttribute("action", message.url);
  for(var key in message.data) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", message.data[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  console.log(message);
  form.submit();
};

chrome.runtime.onMessage.addListener(onMessageHandler);

{% endhighlight %}
