---
layout: post
date: 2020-11-05 22:42:00
title: "Catch2 test framework"
tags: catch2 lru cache algorithm
---

In one of our previous posts, we discussed the [LRU cache algorithm]({% post_url 2018-05-09-lru-cache %}). How do we go about writing tests for such an algorithm or in general any code we write? There are a multitude of test frameworks to choose from - [Google Test](https://github.com/google/googletest), [Boost Test](https://www.boost.org/doc/libs/1_66_0/libs/test/doc/html/index.html), etc., But, I am going to cover the [Catch2 framework](https://github.com/catchorg/Catch2/) here as it is very easy to get started with and works really well for most simple use cases. It is also a single header file so very simple to integrate. 

### Getting Catch2 single header library

As of this writing, the latest Catch2 header is maintained at this [branch](https://github.com/catchorg/Catch2/tree/v2.x). And you can directly get the single header file from this [link](https://github.com/catchorg/Catch2/releases/download/v2.13.3/catch.hpp).

### Using Catch2 to test LRU Cache

Catch2 usage is quite easy to understand with a simple example. Here is the code needed to test our LRU cache implementation (replicating the original code here for convenience):

{% highlight c++ %}
#define CATCH_CONFIG_MAIN
#include <catch2.hpp>
#include <unordered_map>
#include <list>
#include <iostream>
using namespace std;

class LRUCache {
private:
unordered_map<int, pair<int, list<int>::iterator>> cache;
int maxcapacity;
list<int> used;
public:
    LRUCache(int capacity) {
        cache.clear();
        used.clear();
        maxcapacity = capacity;
    }

    int get(int key) {
        auto it = cache.find(key);
        int retval = -1;
        if(it != cache.end())
        {
            retval = it->second.first;
            used.erase(it->second.second);
            used.push_front(key);
            it->second.second = used.begin();
        }
        return retval;
    }

    void put(int key, int value) {
        auto it = cache.find(key);
        if(it != cache.end())
        {
            it->second.first = value;
            used.erase(it->second.second);
            used.push_front(key);
            it->second.second = used.begin();
        }
        else
        {
            if(cache.size() == maxcapacity)
            {
                cache.erase(used.back());
                used.pop_back();
            }
            used.push_front(key);
            cache[key] = {value, used.begin()};
        }
    }
};

TEST_CASE( "Filling up the cache", "[lrucache]" ) {
    LRUCache l(3);

    SECTION("Single entry")
    {
        l.put(0, 10);
        REQUIRE(l.get(0) == 10);
    }

    SECTION("Two entries")
    {
        l.put(0, 10);
        l.put(1, 11);
        REQUIRE(l.get(0) == 10);
        REQUIRE(l.get(1) == 11);
    }

    SECTION("Three entries")
    {
        l.put(0, 10);
        l.put(1, 11);
        l.put(2, 12);
        REQUIRE(l.get(0) == 10);
        REQUIRE(l.get(1) == 11);
        REQUIRE(l.get(2) == 12);
    }
}
TEST_CASE( "Overflow the cache", "[lrucache]" ) {
    LRUCache l(3);
    l.put(0, 10);
    l.put(1, 11);
    l.put(2, 12);
    l.put(3, 13);
    
    REQUIRE(l.get(0) == -1);
    REQUIRE(l.get(1) == 11);
    REQUIRE(l.get(2) == 12);
    REQUIRE(l.get(3) == 13);
}

{% endhighlight %}

### How does it work?

- Note that there is no main() function. We instruct Catch2 to provide it by defining `CATCH_CONFIG_MAIN` - there is a way to [override](https://github.com/catchorg/Catch2/blob/v2.x/docs/own-main.md#top) it for more complex use-cases. 
- We have two simple TEST_CASEs. You can think of them as functions with some tags.
- TEST_CASEs can also have SECTIONs. SECTIONs share the code outside their scope
- REQUIRE statements help us to check whether the expected values are returned by our functions
- We can tag test cases and have control to [execute a specific test case or even a section](https://github.com/catchorg/Catch2/blob/v2.x/docs/command-line.md#specifying-which-tests-to-run)
- You can selectively run a specific test case by tag (lrucache) or by name
- There are many more cool features - quite well documented in the [Catch2 documentation page](https://github.com/catchorg/Catch2/blob/v2.x/docs/Readme.md#top)

