---
layout: post
title:  "Word Break"
date:   2018-05-08 19:11:00
tags: algorithm word break codekata leetcode dynamic programming 
---

I recently ran into this interesting problem called "Word Break" - quite a popular interview question. If you want to practice solving this problem, head over to [leetcode](https://leetcode.com/problems/word-break/). First variant of this problem is quite simple. Given a string, check if it can be split into words to form a full sentence. You are also given a dictionary to check if the word is valid or not. For example, given a string "thisisatest" and a dictionary (list of words) - "this", "is", "a", "test", your function should return true. For the same dictionary, "thisisnotatest" should return false. 

I wanted to solve this problem multiple ways to understand this problem better. I currently have two approaches. I will update this post when I have more.

### Approach 1 - Backtracking with memoization

This is a brute force approach. We check for all possible combinations.

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
### Approach 2 - Dynamic Programming

This approach is quite straightforward and it uses dynamic programming. The main idea behind it is this: if the string ending at index i forms a sentence and the string from i+1 to the last index also forms a sentence, then it is a proper sentence. Let us break this logic down for our example: "thisisatest". For convenience we create a bool vector of size N+1 (N being the length of the string) and initialize the 0th index to be true. Why we do this will become clear soon. 

Now, we start at string ending at index 0. If that is a sentence or not is stored in index 1 of the dp array. 't' is not a word - so it is not a sentence. We proceed so forth and reach 's'. Now, "this" is a word in the dictionary. So, we set index 4 of dp array to true. Notice how we are checking if dp[split-1] is true. Essentially, we are trying to see if the string that ends at index 4 is a word. This could happen if 0 index character itself is a word and index 1 to 4 forms antoher word. Or, 0 to 1 form a word and 2 to 4 form another word. And so on. It does not matter which. As soon as we figure out that at index 4, we have a proper sentence (a single word is also a proper sentence for this problem), we can move on to the next index. That is why the break statement. 

Now in the next iteration, we check if string ending at 5 forms a sentence or not. Same logic as before. "thisi" is not a word. Also, "this" and "i" are not proper words (as per this dictionary). There are only these two cases because dp[...] for all other splits are false. 

Let us do one last iteration: the final one. We have figured out "thisisa" forms a proper sentence. Finally, we check for the last word. These are the combinations we check: 1. "this", "isatest", 2. "thisis", "atest", 3. "thisisa", "test". Clearly we hit jackpot for the 3rd case. Now that we are done iterating over the entire string. We return the last value in the dp array. If the string ending at the last index is a sentence, then it is a valid sentence.

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

