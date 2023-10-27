---
layout: "post"
title:  "Vertical order traversal of a binary tree"
date:   2023-10-26 18:20:00
tags: Leetcode tree traversal vertical-order
---
I recently got back to Leetcode to keep myself sharp with interview style coding exercises. This time around, I am trying to solve problems that are medium or hard. One such problem is the [vertical order traversal of a binary tree](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/). 

Even though this problem is marked hard, given the detailed problem description, it is quite easy to solve. We just need the right datastructure. 

It is a tree traversal problem and we could either use DFS or BFS to do the traversal. But the important thing to note here is we need to order nodes by their column numbers. And if two nodes have the same column numbers, then we need to order them by their row numbers and if two nodes are in the same row, then we need to order them by their values. This is simply a sorting function with a custom sort function.

In fact, we don't even need to implement the custom sort function if we use `std::tuple` to store the values in the correct order. If we had only two values to sort, we could have stored them in a `std::pair`. We'll use this technique to solve another problem in a later post. 

{% highlight c++ %}

using Node = std::tuple<int, int, int>;
std::vector<Node> nodes = {{1, 0, 5}, {1, 0, 3}, {{1, 0, 2}, {0, 0, 1}};
std::sort(nodes.begin(), nodes.end());

{% endhighlight %}

The above snippet would result in the following sorted values:
```
{0, 0, 1}, {{1, 0, 2}, {1, 0, 3}, {1, 0, 5}
```
which is almost exactly what we want. We need to group values in the same column into a vector.

This is one way to solve this problem. Another way to solve this is to use a [priority queue](https://en.cppreference.com/w/cpp/container/priority_queue) to keep track of the nodes in sorted order when we traverse them. Keep in mind that a priority queue by default is a max queue but we want a min queue and this can be achieved using this data structure by passing the `std::greater<>` comparator.

{% highlight c++ %}

std::priority_queue<Node, std::vector<Node>, std::greater<>> pq;

{% endhighlight %}

With these two ideas, we simply need to rearrange the values in the priority queue in the form the question asks as to (each column values in a vector, within that elements are ordered based on their row followed by values). This ordering happens naturally because of the data structure we have chosen.

Taking a step back, the DFS call to do the traversal looks like this:

{% highlight c++ %}

void dfs(TreeNode* root, int row, int col) {
    pq.push({col, row, root->val}); 
    if (root->left) dfs(root->left, row+1, col-1);
    if (root->right) dfs(root->right, row+1, col+1);
}

{% endhighlight %}

This is pretty straightforward to understand. A root node's left node has a column value that's one less than the root node & row that's one more than the root node. Similarly reasoning applies for the right node. 

The final piece of the puzzle is extracting values from the priority queue into a vector of vectors (one for each column). To do this, we simply remove nodes from the priority queue in order while keeping track of the previous node we processed. If the previous node had a different column, then we start adding elements to a new vector instead of the current. The full solution to this problem looks as follows:

{% highlight c++ %}

class Solution {
public:
    using Node = std::tuple<int, int, int>;
    std::priority_queue<Node, std::vector<Node>, std::greater<>> pq;

    void dfs(TreeNode* root, int row, int col) {
        pq.push({col, row, root->val}); 
        if (root->left) dfs(root->left, row+1, col-1);
        if (root->right) dfs(root->right, row+1, col+1);
    }
    
    std::vector<std::vector<int>> verticalTraversal(TreeNode* root) {
        std::vector<std::vector<int>> results;
        if (!root) return results;
        dfs(root, 0 , 0);

        std::vector<int> nums;
        Node prev;
        while (!pq.empty()) {
            if (nums.empty()) nums.push_back(std::get<2>(pq.top()));
            else {
                if (std::get<0>(pq.top()) != std::get<0>(prev)) {
                    pq.push_back(nums);
                    nums.clear();
                }
                nums.push_back(std::get<2>(pq.top()));
            }
            prev = pq.top();
            pq.pop();
        }
        if (!nums.empty()) {
            results.push_back(nums);
        }
        
        return results;
    }
};

{% endhighlight %}
