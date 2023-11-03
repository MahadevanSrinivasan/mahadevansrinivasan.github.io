---
layout: post
title:  "Lowest common ancestor of two nodes in a binary search tree"
date:   2023-11-03 08:41:00
tags: lca tree lowest common ancestor bst
---

In this post, I'm going to go over the problem of finding the [lowest common ancestor of two nodes in a binary search tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/submissions/1064547250/). There is a recursive way to solve this problem without using extra space. I want to solve it using some extra space to get a better handle on the problem. This implementation I believe is easy to understand and in fact was acceptable in one my interviews. 

# Approach

The key insight for this problem is we could solve it by finding that paths to nodes p and q from the root node. If we have those paths, then it is a matter of figuring out where the paths diverge (if they diverge). With this idea, we can split the problem into two steps.

## Step 1: Find paths from the root to a tree node

This should be a fairly easy problem to solve by now (with so many tree problems we have covered so far). Like most tree problems, we plan to solve this using DFS. And we need to use a `std::vector<TreeNode*>` to keep track of the nodes along the path. Each time we process a node, we add it to the path vector. And we check if the root is the node we're looking for, if not, we look in the left subtree and if not we look in the right subtree. If any of these ends up being true, we can immediately return from the recursive calls. If they all return false, then we need to remove the node we added to path using `pop_back()`. If you have seen problems solved using `backtracking` approach, this should look very familiar. I will cover more problems using backtracking really soon to cement this concept. Here is the implementation of the find path function:

{% highlight c %}
bool pathToNode(TreeNode* root, TreeNode* find, std::vector<TreeNode*>& path) {
    if (!root) return false;
    path.push_back(root);
    if (root == find || pathToNode(root->left, find, path) || pathToNode(root->right, find, path)) return true;
    path.pop_back();
    return false;
}
{% endhighlight %}

## Step 2: Find the LCA from the two paths

In this step, we iterate over the two paths vectors till we find a mismatch. To make sure we don't go over the size of the vectors, I find the smallest of the two vectors first. Then only iterate that much. At any point, we find a mismatch, we break out and return the previous value. We could use either vector to find the last common value. Also, notice this works when both the path vectors are the same (meaning p and q are the same node). Finally, it is guaranteed we will have atleast one matching node between the two vectors for an non-empty tree (root of the tree). So, there is no risk of indexing into the vector with a -1. 

{% highlight c %}
TreeNode* lca(std::vector<TreeNode*>& path_to_p, std::vector<TreeNode*>& path_to_q) {
    int len = static_cast<int>(std::min(path_to_p.size(), path_to_q.size()));
    int i = 0;
    for (; i < len; i++) {
        if (path_to_p[i] != path_to_q[i]) break;
    }
    return path_to_p[i-1];
}
{% endhighlight %}


## Putting it all together

Here is the final solution. As mentioned before, this has both time and space complexity `O(N)`. I will cover the solution without the extra space requirement in another post. 

{% highlight c %}
class Solution {
public:

    bool pathToNode(TreeNode* root, TreeNode* find, std::vector<TreeNode*>& path) {
        if (!root) return false;
        path.push_back(root);
        if (root == find || pathToNode(root->left, find, path) || pathToNode(root->right, find, path)) return true;
        path.pop_back();
        return false;
    }

    TreeNode* lca(std::vector<TreeNode*>& path_to_p, std::vector<TreeNode*>& path_to_q) {
        int len = static_cast<int>(std::min(path_to_p.size(), path_to_q.size()));
        int i = 0;
        for (; i < len; i++) {
            if (path_to_p[i] != path_to_q[i]) break;
        }
        return path_to_p[i-1];
    }

    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        std::vector<TreeNode*> path_to_p, path_to_q;
        if (!pathToNode(root, p, path_to_p)) return nullptr;
        if (!pathToNode(root, q, path_to_q)) return nullptr;
        return lca(path_to_p, path_to_q);
    }
};

{% endhighlight %}
