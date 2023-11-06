---
layout: post
title:  "Letter Combinations of a Phone Number"
date:   2023-11-06 10:41:00
tags: backtracking leetcode
---

In the [lowest common ancestor post]({% post_url 2023-11-03-lowest-common-ancestor %}), we briefly talked about backtracking. In this problem, we will dig a little deeper into that idea. Here the problem is figuring out for a given number sequence, all possible strings it could represent based on a mapping (think of your smartphone's dialer app and how each number has a set of letters on it).

## Approach

We have to do an exhaustive search of all possible combinations for a given sequence of numbers. If we think of how could do it manually, we can better understand the actual code. Let's look at an example with two digits: `23`. `2` corresponds to `abc` and `3` corresponds to `def`. Here are all the intermediate results:

```
Processing digit: 2, result = {}, results = {}
Processing digit: 3, result = {a}, results = {}
Processing digit: ?, result = {ad}, results = {}
Processing digit: 3, result = {a}, results = {ad }
Processing digit: ?, result = {ae}, results = {ad }
Processing digit: 3, result = {a}, results = {ad ae }
Processing digit: ?, result = {af}, results = {ad ae }
Processing digit: 2, result = {}, results = {ad ae af }
Processing digit: 3, result = {b}, results = {ad ae af }
Processing digit: ?, result = {bd}, results = {ad ae af }
Processing digit: 3, result = {b}, results = {ad ae af bd }
Processing digit: ?, result = {be}, results = {ad ae af bd }
Processing digit: 3, result = {b}, results = {ad ae af bd be }
Processing digit: ?, result = {bf}, results = {ad ae af bd be }
Processing digit: 2, result = {}, results = {ad ae af bd be bf }
Processing digit: 3, result = {c}, results = {ad ae af bd be bf }
Processing digit: ?, result = {cd}, results = {ad ae af bd be bf }
Processing digit: 3, result = {c}, results = {ad ae af bd be bf cd }
Processing digit: ?, result = {ce}, results = {ad ae af bd be bf cd }
Processing digit: 3, result = {c}, results = {ad ae af bd be bf cd ce }
Processing digit: ?, result = {cf}, results = {ad ae af bd be bf cd ce }
Final results = {ad ae af bd be bf cd ce cf}
```
Here I have used `?` to signify the end of the digits. Notice how we fix the 1st letter as `a` and process the subsequent digits. Only after we finish processing all possible values for the 2nd digit with 1st letter fixed at `a` do we switch the 1st letter to `b`. This idea can be extended to any number of input digits. More generically, we keep choosing the 1st letter for every digit till we get to the last digit. For the last digit, we choose all possible characters for the final position and add the final strings to the results vector. Then we return from the recursive call to the last but one digit and choose the 2nd possible value for that digit and continue to the last digit again. And we continue until there is nothing left to explore. In my implementation, instead of storing intermediate string results and resizing them at every step, I store them as a vector of characters till we reach the end condition at which point, I convert the result vector into a string and add it to the final results vector.

This coding paradigm will come up over and over in many problems. I will cover a few more in the subsequent blog posts to help cement the understanding.

## Final solution

{% highlight c %}
{% raw %}
class Solution {
public:
    void helper(string& digits, int start) {
        if (start >= digits.size()) {
            string s(result.begin(), result.end());
            results.push_back(s);
            return;
        }
        for (char ch: m[digits[start]]) {
            result.push_back(ch);
            helper(digits, start + 1);
            result.pop_back();
        }
    }
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return results;
        helper(digits, 0);
        return results;
    }
private:
    std::unordered_map<char, std::string> m = {{'2', "abc"}, 
                                           {'3', "def"},
                                           {'4', "ghi"},
                                           {'5', "jkl"},
                                           {'6', "mno"},
                                           {'7', "pqrs"},
                                           {'8', "tuv"},
                                           {'9', "wxyz"}};
    std::vector<string> results;
    std::vector<char> result;
};
{% endraw %}
{% endhighlight %}
