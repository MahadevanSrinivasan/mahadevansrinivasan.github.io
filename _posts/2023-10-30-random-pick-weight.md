---
layout: "post"
title:  "Random pick weight"
date:   2023-10-30 10:46:00
tags: Leetcode random weight stl
---

In this post, I plan to tackle the problem of picking a number based on a given weight (probability). In Leetcode, this is called [Random pick with weight](https://leetcode.com/problems/random-pick-with-weight/) problem. The main thing I want to highlight here is how we can use pure STL constructs to solve the entire problem in 5 lines. Of course, we'd want to know how binary search works. But it is also useful to know the STL libraries that implement binary search for you. 

# Approach

Main thing to figure out in this problem is how to go from weights to some kind of a distribution. If you know the concepts of [probability distribution](https://en.wikipedia.org/wiki/Probability_distribution) and [cumulative distribution function](https://en.wikipedia.org/wiki/Cumulative_distribution_function), this is pretty simple. Even if you don't, the problem tries to explain this in an easy to understand format. Here is my take in the explanation:

## Aside: PDF vs CDF
A PDF defines a set of probabilities associated with a set of events. Think of tossing a fair coin. PDF of that random discrete event can be defined as follows: 

```
{HEAD: 1/2, TAIL: 1/2}
```

A slightly more complex example is for a six-sided die. It's PDF is defined as follows:

```
{1: 1/6, 2: 1/6, 3: 1/6, 4: 1/6, 5: 1/6, 6: 1/6}
```

Note how a PDF always sums up to 1.0. Because some event has to happen when we run a random experiment and put together all possible events should sum up to a probability of 1.0. In our problem, we are given weights instead of probabilities. Once can think of probabilities as normalized weights. In both the examples, all events have equal weights and we could choose any positive number to represent it.

On to the topic of CDF, it is simply an accumulated version of PDF. If we use the unnormalized version, we can simply accumulate the weights to come up with its cumulative equivalent. Now, why is CDF important?

Imagine a set of weights: [1, 1, 1] and its cumulative version [1, 2, 3]. If we choose a random floating point number between 0 and 3 and choose the number smallest number greater than the chosen number, we could simulate the random event selection exactly. This becomes more obvious when we look at non-equal weights. Let's consider weights = [100, 1000, 10000]. It's 10 times more likely to choose the 2nd number compared to the 1st and 10 times more likely to choose the 3rd number compared to the 2nd. Writing this in cumulative form, we get [100, 1100, 11100]. Imagine these three numbers as three intervals: [0 - 100], [100.x - 1100], [1100.x - 11100]. See how each range is 10 times as big as the previous range. If we choose a random number between 0 and 11100 and see which interval it falls inside, we have chosen a number according to the given weight distribution.

# Solution

To go from weights to cumulative, we use the STL function [partial_sum](https://en.cppreference.com/w/cpp/algorithm/partial_sum). It does exactly what we want to go from raw weights to cumulative weights. Notice, how I used `back_inserter` to insert the results into the `cumulative` vector. This removes the need for resizing the cumulative vector. 

Picking of a random number between 0 and the last number in the cumulative vector is as simple as generating a large number using `rand()` and using modulo operation to reduce the range. This level of randomness is enough for this problem. 

Finally, how to we find which interval that number landed in. We can use `binary search` since `cumulative` vector is sorted (it's left as an exercise to the reader to prove it is so). But, we don't need to write it from scratch since STL provides us with an `upper_bound` function. [Upper bound](https://en.cppreference.com/w/cpp/algorithm/upper_bound) returns an iterator to the smallest element greater than the element we are searching for. This works perfectly for us. 

Finally to go from this iterator to the index of the element, we use the [std::distance](https://en.cppreference.com/w/cpp/iterator/distance) function. 

{% highlight c++ %}
class Solution {
public:
    Solution(vector<int>& w) {
        std::partial_sum(w.cbegin(), w.cend(), std::back_inserter(cumulative));
    }

    int pickIndex() {
        int idx = rand() % cumulative.back();
        auto upper = std::upper_bound(cumulative.begin(), cumulative.end(), idx);
        return std::distance(cumulative.begin(), upper);
    }
    std::vector<int> cumulative;
};
{% endhighlight %}
