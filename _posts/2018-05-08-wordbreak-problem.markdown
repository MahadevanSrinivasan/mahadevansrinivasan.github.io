---
layout: post
title:  "Word Break"
date:   2018-05-08 19:11:00
tags: algorithm word break codekata leetcode dynamic programming 
---

I recently ran into this interesting problem called "Word Break" - quite a popular interview question. If you want to practice solving this problem, head over to [leetcode](https://leetcode.com/problems/word-break/). First variant of this problem is quite simple. Given a string, check if it can be split into words to form a full sentence. You are also given a dictionary to check if the word is valid or not. For example, given a string "thisisatest" and a dictionary (list of words) - "this", "is", "a", "test", your function should return true. For the same dictionary, "thisisnotatest" should return false. 

I wanted to solve this problem multiple ways to understand this problem better. I currently have two approaches. I will update this post when I have more.

### Approach 1 - Dynamic Programming

This approach is quite straightforward using dynamic programming.

{% highlight c++ %}
bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordmap(wordDict.begin(), wordDict.end());
        vector<bool> dp(s.size()+1, false);
        dp[0] = true;
        for(int end = 1; end <= s.size(); end++)
        {
            for(int split = 1; split <= end; split++)
            {
                if(dp[split-1] == true && wordmap.find(s.substr(split-1, end-split+1)) != wordmap.end())
                {
                    dp[end] = true;
                    break;
                }
            }
        }
        return dp[s.size()];
}
{% endhighlight %}

### Approach 2 - Backtracking with memoization

This is a brute force approach.

{% highlight c++ %}
    enum class States {UNKNOWN, WORD, NOTAWORD};
    bool split_to_words(string A, int i, unordered_set<string> &B, vector<vector<States> > &words) 
    {
        if(i >= A.size()) return true;
        string word;
        int start = i;
        while(i < A.size())
        {
            word = word + A[i];
            if(words[start][i] == States::UNKNOWN) 
            {
                if(B.find(word) != B.end())
                {
                    words[start][i] = States::WORD;
                    if(split_to_words(A, i+1, B, words)) return true;
                }
                else
                {
                    words[start][i] = States::NOTAWORD;
                }
            }
            else
            {
                if(words[start][i] == States::WORD) return split_to_words(A, i+1, B, words);
            }
            i++;
        }
        return false;
    }
    bool wordBreak(string s, vector<string>& wordDict) 
    {
        unordered_set<string> m(wordDict.begin(), wordDict.end());
        vector<vector<States> > words(s.size(), vector<States>(s.size(), States::UNKNOWN));
        return split_to_words(s, 0, m, words);
    }
{% endhighlight %}
