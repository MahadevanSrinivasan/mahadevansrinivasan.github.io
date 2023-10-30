---
layout: "post"
title:  "Add two numbers represented as linked lists"
date:   2023-10-30 10:20:00
tags: Leetcode linkedlist 
---

Today, I want to tackle a simpler problem of [adding two numbers represented as linked lists](https://leetcode.com/problems/add-two-numbers/). Each node contains a digit between 0 and 9. This problem will use some of the techniques we used in the [merging of k sorted lists]({% post_url 2023-10-28-merge-k-sorted-lists %}). Even though this problem is quite simple to solve, it helps build intuition on solving linked list problems.

# Approach

The only main gotcha in this problem is we need to keep track of `carry` from each sum till we reach the end of the lists and add the left over `carry` to the result list. Otherwise, things are pretty straightforward. Notice how we keep track of previous node and head node exactly like the merging of the k sorted lists problem.

{% highlight c++ %}
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        int carry = 0;
        ListNode* prev = nullptr;
        ListNode* head = nullptr;

        while (l1 || l2) {
            int sum = carry + (l1 ? l1->val : 0) + (l2 ? l2->val : 0);
            carry = sum / 10;
            ListNode* node = new ListNode(sum % 10);

            if (head == nullptr) head = node;
            if (prev != nullptr) prev->next = node;
            prev = node;

            l1 = (l1 ? l1->next : nullptr);
            l2 = (l2 ? l2->next : nullptr);
        }

        if (carry) {
            prev->next = new ListNode(carry);
        }
        return head;
    }
    
};
 {% endhighlight %}

# Alternate approach

I have another approach which is extremely similar to `merge` operation in mergesort. This approach is slightly more readable but in no means more efficient.

{% highlight c++ %}
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        int carry = 0;
        ListNode* prev = nullptr;
        ListNode* head = nullptr;

        for (; l1 && l2; l1 = l1->next, l2 = l2->next) {
            int sum = carry + l1->val + l2->val;
            carry = sum / 10;
            ListNode* node = new ListNode(sum % 10);

            if (head == nullptr) head = node;
            if (prev != nullptr) prev->next = node;
            prev = node;
        }

        for (; l1; l1 = l1->next) {
            int sum = carry + l1->val;
            carry = sum / 10;
            ListNode* node = new ListNode(sum % 10);

            if (head == nullptr) head = node;
            if (prev != nullptr) prev->next = node;
            prev = node;
        }

        for (; l2; l2 = l2->next) {
            int sum = carry + l2->val;
            carry = sum / 10;
            ListNode* node = new ListNode(sum % 10);

            if (head == nullptr) head = node;
            if (prev != nullptr) prev->next = node;
            prev = node;
        }

        if (carry) {
            prev->next = new ListNode(carry);
        }
        return head;
    }
    
};
{% endhighlight %}
