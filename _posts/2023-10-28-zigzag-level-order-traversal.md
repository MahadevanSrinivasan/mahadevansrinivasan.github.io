---
layout: "post"
title:  "Zigzag Level Order Traversal of Binary Tree"
date:   2023-10-28 14:45:00
tags: Leetcode tree level-order binary traversal
---

In this post, I'm going to tackle a medium difficulty problem called [Binary Tree Zigzag Level Order Traversal](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/description/). I believe this is an important technique to learn while doing a breadth first traversal of a tree. This approach is generic enough to be used with many other leetcode problems. 

# Breadth first search

Breadth first search (BFS) relies on a queue to keep track of the elements. So elements are processed in the order they were added (FIFO). In general, BFS algorithm uses the following approach:

{% highlight c++ %}
std::queue<TreeNode*> q;
q.push(root);
while (!q.empty()) {
  TreeNode* front = q.front();
  q.pop();
  // Process the front node
  if (front->left) q.push_back(front->left);
  if (front->right) q.push_back(front->right);
}
{% endhighlight %}

# Level order traversal

If we want to process a tree level-by-level, we need to slightly modify the algorithm as follows:

{% highlight c++ %}
std::queue<TreeNode*> q;
q.push(root);
while (!q.empty()) {
  int N = q.size();
  for (int i = 0; i < N; i++) {
    TreeNode* front = q.front();
    q.pop();
    // Process the front node
    if (front->left) q.push_back(front->left);
    if (front->right) q.push_back(front->right);
  }
}
{% endhighlight %}

Here we are intentional about how many elements we process at a time. We process nodes that were already in the queue when the for loop started executing. This ensures we process elements level by level.

# Zig zag level order traversal
Finally to process levels in zig-zag fashion, we process elements left to right for one level and right to left for the next level and so on. But this can be easily achieved by processing all levels left to right and simply reversing the elements before placing the vector in the results. We use a boolean flag to decide when to reverse and we keep toggling it after each level. 

{% highlight c++ %}
class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        vector<vector<int>> results;
        if (!root) return results;
        std::queue<TreeNode*> q;
        q.push(root);
        bool reverse = false;
        while (!q.empty()) {
            int N = q.size();
            vector<int> level;
            for (int i = 0; i < N; i++) {
                TreeNode* front = q.front(); q.pop();
                level.push_back(front->val);
                if (front->left) q.push(front->left);
                if (front->right) q.push(front->right);
            }
            if (reverse) std::reverse(level.begin(), level.end());
            reverse = !reverse;
            results.push_back(level);
        }
        return results;        
    }
};
{% endhighlight %}
