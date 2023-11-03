---
layout: post
title:  "Lowest common ancestor of two nodes in a binary search tree"
date:   2023-10-30 12:27:00
tags: lca tree lowest common ancestor bst
---

In this post, I'm going to go over the problem of finding the [lowest common ancestor of two nodes in a binary search tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/submissions/1064547250/). There is a recursive way to solve this problem without using extra space. I want to solve it using some extra space to get a better handle on the problem. This implementation I believe is easy to understand and in fact was acceptable in one my interviews. 

# Approach

The key insight for this problem is we could solve it by finding that paths to nodes p and q from the root node. If we have those paths, then it is a matter of figuring out where the paths diverge (if they diverge). With this idea, we can split the problem into two steps.

## Step 1: Find paths from the root to a tree node

This should be a fairly easy problem to solve by now (with so many tree problems we have covered so far). But just to recap, we plan to solve this using DFS. And we need to use a `std::vector<TreeNode*>` to keep track of the nodes along the path. The only slight difference is we're on the wrong track, we need to remove the node we added and continue our search. In that sense, we are doing backtracking. I will cover more problems using backtracking really soon to cement this concept. Here is the implementation of the find path function:

{% highlight c %}
bool findPath(TreeNode* root, TreeNode* f, std::vector<TreeNode*>& path) {
    if (!root) return false;
    if (root == f) {
        path.push_back(root);
        return true;
    }
    path.push_back(root);
    if (findPath(root->left, f, path) || findPath(root->right, f, path)) return true;
    path.pop_back();
    return false;
}
{% endhighlight %}

Notice, how we keep traversing left and right till we find the node. If we find it, we stop searching. If not, we backtrack (pop_back()) and continue. Also, not how we add the final matching node to the path vector before returning true in the happy path.

{% highlight c %}

class Solution {
public:
    bool findPath(TreeNode* root, TreeNode* f, std::vector<TreeNode*>& path) {
        if (!root) return false;
        if (root == f) {
            path.push_back(root);
            return true;
        }
        path.push_back(root);
        if (findPath(root->left, f, path) || findPath(root->right, f, path)) return true;
        path.pop_back();
        return false;
    }
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        std::vector<TreeNode*> plist, qlist;
        bool p_found = findPath(root, p, plist);
        bool q_found = findPath(root, q, qlist);
        TreeNode* ancestor = root;
        for (int i = 1, j = 1; i < plist.size() && j < qlist.size(); i++, j++) {
            if (plist[i] == qlist[j]) {
                ancestor = plist[i];
            } else {
                break;
            }
        }
        return ancestor;
     }
};

{% endhighlight %}
