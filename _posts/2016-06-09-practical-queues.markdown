---
layout: post
title:  "Practical Queues"
date:   2016-06-09 20:47:00
tags: queue datastructure practical
---

Queue is one of the simplest data structures around. Understanding queues is very simple if you just use a primitive data type like say integer. In fact, most tutorials leave you with just that implementation. Here,  I am going to start with that implementation but will eventually expand it to work with any datatype you want. 

### Basics of Queue

Queue = FIFO, Stack = LIFO is probably something you have heard before. If you have not, in a queue, the first element that came in is the first element that goes out. It is all about fairness. Bare-minimum we only have two operations in a Queue - Enqueue and Dequeue. Enqueue adds a new element to the Queue. Dequeue removes an element from the Queue (in FIFO order). For completeness sake, we will also implement two more operations: `empty()` and `size()`. A Queue can be implemented with an array but it is more flexible if implemented as a linked list. To implement it as a linkedlist, we need an additional class called *Node*. Here is the API:

{% highlight c %}
class Node {
  public:
    Node(int d) : data(d), next(NULL){}
    int data;
    Node *next;
};

class Queue {
  public:
    Queue();
    void enqueue(int data);
    int  dequeue();
    int  size();
    bool empty();
  private:
    Node *head;
    Node *tail;
    int  s;
};
{% endhighlight %}

### Enqueue

We have two options to add a new element to a Queue. We could add the new element to the head of the Queue or we could add it to the tail of the Queue. Let us see which is better. If we add the new element to the head of the Queue (assuming that we are using a singly linked list), we will need to traverse the entire list when we want to remove an element from the Queue. So, it is saner to add the element to the tail of the Queue. That way, we can quickly perform the Dequeue operation. But, won't we still have to traverse the entire list before adding a new element? Not if we are smart enough to maintain a pointer to the last element of the Queue (tail). Here is the enqueue implementation:

{% highlight c %}
Queue::Queue() {
  head = NULL;
  tail = NULL;
  s = 0;
}

Queue::enqueue(int d) {
  Node *newNode = new Node(d);
  s++;
  if(tail == NULL) {
    head = newNode;
    tail = newNode;
  } else {
    tail->next = newNode;
    tail = newNode;
  }
}

{% endhighlight %}

### Dequeue

It is always safer to check if the Queue is empty before performing the Dequeue operation. We can leave that responsibility to the Client but it is not a large overhead to be cautious. For simplicity sake, we are just returning a -1 if the Queue is empty and when some bonehead tries to dequeue. You may want to print an error message or throw an exception in real-life.

{% highlight c %}
int Queue::dequeue() {
  if(head == NULL) return -1;
  int temp = head->data;
  Node *tempNode = head;
  head = head->next;
  free(tempNode);
  s--;
  return temp;
}
{% endhighlight %}

### Extending the Queue

When the data you want to store in your Queue is not a primitive datatype, you will want to create a Queue of Pointers. We are going to look at an example of a struct as your Queue element. In such a case, it is customary to leave the memory allocation and deallocation to the client. For example, say you have a structure with two integer fields. Here is how the Queue code can be made generic. For the methods, just go ahead and replace all *ints* with *Ts*.

{% highlight c %}
template<class T>
class Queue {
  public:
    Queue();
    void enqueue(T d);
    T dequeue();
    int size();
    bool empty();
  private:
    int s;
    Node *head;
    Node *tail;
};
{% endhighlight %}

That's all. Let us look at the client side code:

{% highlight c%}
typedef struct {
  int queueValue1;
  int queueValue2;
}QueueElement;

int main(int argc, char *argv[])
{
  if(argc == 2)
  {
    Queue<QueueElement *> q;
    srand(time(NULL));
    /* Enqueuing n elements in the Queue */
    for(int i = 0; i < atoi(argv[1]); i++)
    {
      /** Allocate memory in heap for the QueueElement */
      QueueElement *temp = (QueueElement *) calloc(1, sizeof(QueueElement));
      temp->queueValue1 = rand()%100; 
      temp->queueValue2 = rand()%100; 
      q.enqueue(temp);
      cout << "Enqueuing " << temp->queueValue1 << ' ' << temp->queueValue2 << endl;
    }

    while(!q.isEmpty())
    {
      QueueElement *temp = q.dequeue();
      cout << "Dequeuing " << temp->queueValue1 << ' ' << temp->queueValue2 << endl;
      /** Free the QueueElement after dequeuing */
      free(temp);
    }
  }
  else
  {
    cout << "Usage: ./a.out n" << endl << "enqueues and dequeues n+1 elements into the queue" << endl;
  }
  return 0;
}
{% endhighlight %}

This client code takes as an input the number of elements you want inserted into the Queue and creates as many structures using the `calloc` system call and dynamically allocates memory. And after dequeuing, we free the memory. Of course, in your case, you may want to free the memory after you are done using the dequeued element. To look at the complete implementation of this Queue, have a look at my [Github repository](https://github.com/MahadevanSrinivasan/cprograms/blob/master/queue.cpp). It also contains an extra method to insert an element at the head of the Queue.

### Running time

All the operations in the Queue are `O(1)` since we never have to traverse the list fully to insert or delete an element. Storage-wise everything is allocated dynamically from heap. Next time, we will look at an alternative implementation where we can statically allocate memory for your Queue elements. It will be useful for scenarios where you know your Queue will only grow to a certain size. Stay tuned.
