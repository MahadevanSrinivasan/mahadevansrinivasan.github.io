---
layout: post
title:  "Lowest common ancestor of two nodes in a binary search tree"
date:   2023-10-30 12:27:00
tags: lca tree lowest common ancestor bst
---

In this post, I'm going to go over the problem of finding the [lowest common ancestor of two nodes in a binary search tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/submissions/1064547250/). 

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
