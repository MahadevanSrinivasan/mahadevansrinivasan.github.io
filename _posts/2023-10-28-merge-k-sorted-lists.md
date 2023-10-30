---
layout: "post"
title:  "Merge k sorted linked lists"
date:   2023-10-28 13:27:00
tags: Leetcode linkedlist merge sorted
---

The next hard problem I want to tackle is [merging of k sorted linked lists](https://leetcode.com/problems/merge-k-sorted-lists/). An obvious way to solve this problem is by copying all the values from the k lists into a vector and sorting the vector. This is extremely inefficient both in terms in time and space complexity. If N1, N2, ..., Nk are the sizes of each list, let's call N = N1 + N2 + ... + Nk. Then space complexity of such an approach would be O(N). Time complexity would be O(NlogN). Here's this simple approach:

# Naive approach

{% highlight c++ %}
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        std::priority_queue<int, vector<int>, std::greater<int>> pq;
        for (ListNode* head : lists) {
            while (head != nullptr) {
                pq.push(head->val);
                head = head->next;
            }
        }
        ListNode* head = nullptr;
        ListNode* prev = nullptr;
        while (!pq.empty()) {
            ListNode* newNode = new ListNode(pq.top());
            pq.pop();
            if (head == nullptr) head = newNode;
            if (prev != nullptr) prev->next = newNode;
            prev = newNode;
        }
        return head;   
    }
};
{% endhighlight %}

How could we do better? The main idea is to keep only one element from each list in a priority queue. After we do that, we can remove the smallest element from the priority queue. At the same time, we add another element from the same list we got the smallest element from if it still has more elements. We keep doing this operation till we exhaust all the elements. In some sense, we are using priority queue to keep k pointers into the k lists. 

How to keep track of which list a list node came from? We create a struct with two fields as follows:

{% highlight c++ %}
    struct Node {
        int index;
        ListNode* list_node;
    };
{% endhighlight %}

Now, we simply add this Node to the priority queue. But to be able to use this custom struct with the priority queue, we need to define a custom operator for <. This can be done as follows:

{% highlight c++ %}
    struct Node {
        int index;
        ListNode* list_node;

        bool operator<(const Node& rhs) const {
            return list_node->val > rhs.list_node->val;
        }
    };
{% endhighlight %}

# A better approach
With these two ideas, we can easily solve this problem as follows:

- Fill up the priority queue with one value from each list
- Iterate till the priority queue is empty
  - Each step, remove the smallest node
  - If we don't have head set, set the node as head
  - If we have a previous node, point the previous node to this node
  - Find out which list this node came from
  - Add the next element from that list (if one exists) to the priority queue
- Return head

{% highlight c++ %}
class Solution {
public:
    ListNode* mergeKLists(std::vector<ListNode*>& lists) {
        ListNode* head = nullptr;
        ListNode* prev = nullptr;

        // Fill the priority_queue for the first iteration
        for (int i = 0; i < lists.size(); i++) {
            if (lists[i] != nullptr) { 
                pq_.push({.index = i, .list_node = lists[i]});
                lists[i] = lists[i]->next;
            }
        }

        while (!pq_.empty()) {
            int index = pq_.top().index;
            ListNode* node = pq_.top().list_node;
            pq_.pop();

            if (head == nullptr) head = node;
            if (prev != nullptr) prev->next = node;
            prev = node;
	    
            // pq_ always has a node from each linked list
            // If the one we just popped has another element, add it to pq.
            if (lists[index]) {
                pq_.push({.index = index, .list_node = lists[index]});
                lists[index] = lists[index]->next;
            }
        }
        return head;   
    }
private:
    // Custom node to use with priority queue. Note the operator <
    // is defined to maintain a min heap based on the value in the 
    // ListNode.
    struct Node {
        int index;
        ListNode* list_node;

        bool operator<(const Node& rhs) const {
            return list_node->val > rhs.list_node->val;
        }
    };
    
    std::priority_queue<Node> pq_;
};
{% endhighlight %}

Note we could have also used a similar approach to the [vertical order traversal problem]({% post_url 2023-10-26-vertical-order-traversal-binary-tree %}) for storing the data using a `std::tuple`. I intentionally used a different approach to showcase the use of a custom node in a priority queue. This approach makes the ordering obvious. 

# Update: 2023/10/30

After writing this post, I realized I don't need to store the index of the list in the priority queue after all. With that realization, I came up with the following more compact implementation:

{% highlight c++ %}
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        ListNode* head = nullptr;
        ListNode* prev = nullptr;
        auto cmp = [](const ListNode* l, const ListNode* r) { return l->val > r->val; };
        std::priority_queue<ListNode*, std::vector<ListNode*>, decltype(cmp)> pq(cmp);

        // Fill the priority_queue for the first iteration
        for (ListNode* node: lists) {
            if (node != nullptr) { 
                pq.push(node);
            }
        }

        while (!pq.empty()) {
            ListNode* node = pq.top();
            pq.pop();

            if (head == nullptr) head = node;

            if (prev != nullptr) prev->next = node;
            prev = node;

            if (node->next) {
                pq.push(node->next);
            }
        }
        return head;   
    }
};
{% endhighlight %}
