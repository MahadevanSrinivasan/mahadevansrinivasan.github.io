---
layout: post
title:  "Learn to love the heap"
date:   2016-06-08 22:01:00
tags: heap datastructure median order statistics
---

I have never used the heap datastructure in my life till recently. I didn't think it was that useful. But, after using it to solve this order statistics problem, I am in total love with this datastructure. My first theoretical exposure to heap came when I took the [Algorithms course by Robert Sedgewick](algs4.cs.princeton.edu). This is a great course. You can pretty much find all the videos for the course on [Youtube](https://www.youtube.com/watch?v=YIFWCpquoS8&list=PLUX6FBiUa2g4YWs6HkkCpXL6ru02i7y3Q).

## Understanding the Heap

This heap is not to be confused with the "heap" memory where dynamically allocated memory comes from. There are two kinds of heap - Min Heap and a Max Heap. Let us discuss Max Heap for the rest of the article. Min Heap is just the opposite. You'll understand it soon. You can visualize Max Heap as a binary tree where every node is larger than its children. Why do we need such a data structure? The most obvious application is that of a priority queue. In a system with multiple tasks with multiple priorities, processor chooses which task to run based on the priorities of the ready tasks. The one with the highest priority gets scheduled next. This operation runs so frequently that the system should be able to immediately choose who's next. 

## How can we maintain the heap property?

Two things happen to your "list of elements". Something can get inserted or something can get deleted (usually the highest priority thing). Both these operations may disturb the heap and make it a non-heap. We need to restore the heap property by doing some swappings in your list. Sedgewick calls these operations *sink* and *swim*. Here's [Sedgewick's implementation in Java](http://algs4.cs.princeton.edu/24pq/MaxPQ.java.html). Best part of heap is you don't need to maintain separate pointers to the left and right tree. So, no added storage. All the operations can be easily performed with just a plain old array. 

## How about an example?

I used it recently to solve the problem of finding the kth largest element in an array. The idea is simple: Start with a minheap of the first k-elements. Next iterate over the rest of the elements one by one deciding whether to insert or ignore the elements. If the new element is smaller than the root of the heap (smallest element in the heap), then you can ignore it. If it is larger, then remove the root and insert this element and make the k-element array a heap again. Keep doing this till you run out of elements. Now, you have a heap which holds the k-largest elements in the array. At the root will be the kth largest element. Voila!

You can try solving this problem in [Leetcode](https://leetcode.com/problems/kth-largest-element-in-an-array/). Here's my quick implementation. Notice how we need to only look at the k/2 elements while forming the heap the first time. I leave it as an exercise to understand that part. formHeap function makes the given vector a heap in-place. heapify function takes in a vector and the index of the heap's root and restores the heap property.

For the complete solution with small test driver function, have a look at my [Github repository](https://github.com/MahadevanSrinivasan/cprograms/blob/master/topkusingheap.cpp)

{% highlight c %}

void heapify(vector<int>& v, int i)
{
  while(i < v.size())
  {
    int c;
    if((2*i)+2 < v.size()) {
      c = (v[(2*i)+1] < v[(2*i)+2]) ? ((2*i)+1) : ((2*i)+2);
    } else if(((2*i) + 1)< v.size())
      c = (2*i + 1);
    else break;
    if(v[i] > v[c]) {
      int temp = v[i];
      v[i] = v[c];
      v[c] = temp;
      i = c;
    } else {
      break;
    }
  }
}

void formHeap(vector<int>& v, int k)
{
  for(int i = (k/2); i >= 0; i--) {
    heapify(v, i);
  }
}

int findKthLargest(vector<int>& nums, int k) {
  vector<int> v(nums.begin(), nums.begin()+k);
  formHeap(v, k);
  for(int i = k; i < nums.size(); i++)
  {
    if(v[0] < nums[i])
    {
      v[0] = nums[i];
      heapify(v, 0);
    }
  }
  return v[0];
}

{% endhighlight %}
