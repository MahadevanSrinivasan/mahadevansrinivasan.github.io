---
layout: post
title:  "Setting up your own site with Flask"
date:   2016-08-27 17:03:00
tags: flask database blog
---

If you want to host your own blog with minimal setup time, you could use something like tumblr or wordpress. But, if you are like me, you would want to code everything up yourself. [Flask](flask.pocoo.org/) is a very lightweight Python based framework which supports templating, database support etc., Flask provides some [excellent documentation](http://flask.pocoo.org/docs/0.11/tutorial/introduction/) on how to set it up to write your own blog system. But, I ran into a few snags. So, I thought of sharing some of the gotchas.

### Flaskr, a blogging application

First step is [creating the folder structure](http://flask.pocoo.org/docs/0.11/tutorial/folders/#tutorial-folders). Flask looks for the css and the javascript files in the `static` folder. HTML templates are placed in the `templates` folder. Create those two first.

Next step is to [create a database schema](http://flask.pocoo.org/docs/0.11/tutorial/schema/#tutorial-schema). You need to know a bit of SQL for this. If you want a quick brushup, check out this [Codeschool course on SQL](https://www.codeschool.com/courses/try-sql). In this step, you put the SQL commands in a file to create the database you want. The example creates a new table with three fields: id, title and text. These are the parameters of your blog. Feel free to add more fields. For examples, you could add the *Time of creation* or *Author* etc.,

We need to setup the [Application code](http://flask.pocoo.org/docs/0.11/tutorial/setup/#tutorial-setup) next. If you know Python, this is quite easy to understand. Flask is just a python module. You import and use it just like any other module. A small gotcha in this specific step. Documentation is not up-to-date. To run the flask application, you need to give the python filename **with** the extension. 

{% highlight python %}
export FLASK_APP=flaskr.py
export FLASK_DEBUG=1
flask run
{% endhighlight %}

At this point, you still can't see your site. But that is ok. Step 4 is to [create the database connections](http://flask.pocoo.org/docs/0.11/tutorial/dbcon/#tutorial-dbcon). It is quite straightforward. Put all the code in your `flaskr.py` file.  In the next step, we actually [create the database](http://flask.pocoo.org/docs/0.11/tutorial/dbinit/#tutorial-dbinit). But, instead of using `sqlite3` command directly, we create it with a Python function. Running `flask initdb` creates the database and the table for you. After running this command, look into your flaskr directly and you will notice a `flaskr.db` file. You can use `sqlite3` to see what's inside it for debugging purposes.

### Some good ol' HTML templating

Now comes the fun part, link the Python code and your HTML code. You need to create templates for your HTML pages. But, let us write the Python function which decides which HTML file to render. Follow the instructions on this [page](http://flask.pocoo.org/docs/0.11/tutorial/views/#tutorial-views). We also create a login and logout function so only someone with credentials can edit the page. Everybody else can just view the page. Just like Wordpress.

Finally, we get into the [HTML templating](http://flask.pocoo.org/docs/0.11/tutorial/templates/#tutorial-templates). Now, this is a mix of HTML and something that looks like Python. If you have done Ruby before, this should look very familiar. Remember the Python functions we wrote for rendering the HTML page in the last step. That function sends some data into this template. Compare the names of variables. It is very easy to loop over a list or any iterable datatype. In the last step, we will add some [style to the page](http://flask.pocoo.org/docs/0.11/tutorial/css/#tutorial-css). Make sure you store the CSS files into the `static` folder and the HTML templates into the `templates` folder.

How to run this? You need to execute `flask run` assuming you have already run `export FLASK_APP=flaskr.py`. On Windows, you need to change `export` to `set`. 

I had my `flask` application running on my raspberry pi. But, I wanted to access it from a different computer. To do this, you need to enable your `flask` application to be visible to other machines. Add the following line to the end of the `flaskr.py`:

{% highlight python %}
app.run(host='0.0.0.0')
{% endhighlight %}

To see your site in full glory, open your browser and goto the IP address of the machine running the flaskr.py file on port 5000. For example, I had it running on my Raspberry Pi. And its IP address was 192.168.1.101. So, I had to goto the following address on my browser `192.168.1.101:5000`.

