---
layout: post
title:  "Binary Tree Traversals"
date:   2023-11-16 22:52:00
tags: algorithm bst tree balanced sorted inorder preorder postorder levelorder
---

For this post, we will take a slightly different approach. Instead of covering a single problem, we will cover a slew of related tree traversal problems. But before we start with the traversal algorithms, let's talk about how we can create a Balanced Binary Search Tree from a sorted array. It's an interesting problem because it combines tree creation with Binary Search.

## Generating the input
Let's start with a simple sorted array with 10 elements. We could use a loop to generate this array but let's do something cool with a standard library function `std::iota`. 

{% highlight c++ %}
std::vector<int> nums(10);
std::iota(nums.begin(), nums.end(), 0);
{% endhighlight %}

## Binary search tree from sorted array
Creating any binary search tree from a sorted array is super easy. If you think about the definition of a binary search tree, the only requirements are the left subtree should contain values smaller than the root and right tree should contain 
values greater than the root. So, we could take the sorted array and place the 1st element at the root, 2nd at 1st's right, 3rd at 2nd's right and so on. 
In other words, it is a tree that leans to the right with one node at each level. We could have also done the opposite with the largest element at the root and next largest to its left and so on - a tree that leans left. We won't go over these algorithms as 
they are not too interesting. Instead let's see how we can make a balanced binary search tree. 

## Balanced binary search tree from sorted array
To make the tree balanced, we need to do something very similar to a [binary search]({%post_url 2017-04-27-binarysearch-codekata}). One way to make a balanced tree is to have roughly the same number of elements in the root's left and right subtrees. We say roughly because
we could have even number of elements - like in our example. With 10 elements, one side has to have 4 and the other side has to have 5 to make it balanced. What's the best candidate for the root element in such case? It's the middle element.
Once we placed the middle element at the root, we need to recursively populate the left and right subtrees using the same logic. The end result is annoyingly simple once we understand it. 

{% highlight c++ %}
struct TreeNode {
    int value;
    TreeNode *left;
    TreeNode *right;

    TreeNode(int val) : value(val) {}
    TreeNode(int val, TreeNode *l, TreeNode *r) : value(val), left(l), right(r) {}
};

TreeNode *helper(std::vector<int> &nums, int lo, int hi) {
    if (lo > hi) return nullptr;
    int mid = (lo + hi) / 2;
    return new TreeNode(nums[mid], helper(nums, lo, mid - 1), helper(nums, mid + 1, hi));
}

TreeNode *SortedArrayToBST(std::vector<int> &nums) {
    return helper(nums, 0, nums.size() - 1);
}
{% endhighlight %}

Now that we have created a nice balanced tree, let's traverse it. We have already covered [vertical order]({%post_url 2023-10-26-vertical-order-traversal-binary-tree}) and [zig-zag]({%post_url 2023-10-28-zigzag-level-order-traversal}) in prior posts. Let's cover some more common traversals. 

## In order traversal
This is an important traversal scheme. Using this traversal on  BST, we can get elements in the sorted order. If we take the tree we created with SortedArrayToBST and fed its root node into this function, we will get the sorted array. Hence the name "In-order". Order of processing is left, root and right. 

{% highlight c++ %}
void InOrderTraversal(TreeNode *root, std::vector<int> &results) {
    if (!root) return;
    InOrderTraversal(root->left, results);
    results.push_back(root->value);
    InOrderTraversal(root->right, results);
}
{% endhighlight %}

```
0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

## Pre order traversal

{% highlight c++ %}
void PreOrderTraversal(TreeNode *root, std::vector<int> &results) {
    if (!root) return;
    results.push_back(root->value);
    PreOrderTraversal(root->left, results);
    PreOrderTraversal(root->right, results);
}
{% endhighlight %}

```
4, 1, 0, 2, 3, 7, 5, 6, 8, 9 
```

## Post order traversal

{% highlight c++ %}
void PostOrderTraversal(TreeNode *root, std::vector<int> &results) {
    if (!root) return;
    PostOrderTraversal(root->left, results);
    PostOrderTraversal(root->right, results);
    results.push_back(root->value);
}
{% endhighlight %}

```
0, 3, 2, 1, 6, 5, 9, 8, 7, 4
```

## Level order traversal

This is a useful traversal scheme that can be used to represent a tree uniquely using a string representation. In fact, [leetcode](https://support.leetcode.com/hc/en-us/articles/360011883654-What-does-1-null-2-3-mean-in-binary-tree-representation-) uses this 
technique to specify their trees for their problems.

{% highlight c++ %}
std::vector<TreeNode*> LevelOrderTraversal(TreeNode* root) {
    std::vector<TreeNode*> results;
    std::queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int N = q.size();
        for (int i = 0; i < N; i++) {
            TreeNode* front = q.front();
            q.pop();
            results.push_back(front);
            if (front) {
                q.push(front->left);
                q.push(front->right);
            }
        }
    }
    return results;
}

void PrintVector(std::vector<TreeNode*> &nums) {
    for (auto num : nums) std::cout << (num ? std::to_string(num->value) : "null") << ", ";
    std::cout << std::endl;
}
{% endhighlight %}

```
4, 1, 7, 0, 2, 5, 8, null, null, null, 3, null, 6, null, 9, null, null, null, null, null, null
```

Here is a [nifty website](https://graph-visualizer-with-ts.netlify.app/) that renders the tree specified in this format. Choose Array Leetcode format to 
view the results for this format. Inputting the above string representation results in the following tree (as expected balanced with 4 elements to the left and 5 to the right of the root).

![](2023-11-08-08-17-27.png)
