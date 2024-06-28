---
layout: post
title:  "Make More Tensorflow Version (part 1)"
date:   2024-06-27 17:40:00
tags: tensorflow keras neural network make more
---

I recently started watching Andrej Karpathy's [make more youtube video series](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ) (I know I'm a year late to the party). In this and the following posts, I plan to reproduce his experiments and models but using tensorflow. 


## Overview of the problem

Andrej operates on this [names dataset](https://github.com/karpathy/makemore/raw/master/names.txt) which he downloaded from some site. And the task is to train a model that creates names that sound like real names (in the dataset) but are not real. And the way he goes about it in the first lecture is by creating a model that is purely statistical. Each name is made of a set of characters. Let's say we learn the distribution of which character is likely to follow which character (bigram model), we can simply sample from that distribution to get the next character given the current character. That's easy enough. How do we know when to stop? That's where the special start and end characters come into play. Take the first name in this dataset *emma*. Let's add a start and end character to it: `.emma.`. Here is some pseudo code on how to generate the names (given we have the distribution):

{% highlight python %}
def generate_name(model):
    prev_token = '.'
    results = []
    while True:
        next_token = model(prev_token)
        if next_token == '.':
            break
        results.append(next_token)
        prev_token = next_token
    return ''.join(results)
{% endhighlight %}

## Creating a vocabulary

This part is pretty easy. In our dataset, we only have lower case english characters (but this can easily be extended to non-english characters as well). Assume our dataset is in a file called `names.txt`, here is how we create the vocabulary. Why do we map characters to numbers? This will be clear in the next step.

{% highlight python %}
words = open('names.txt', 'r').read().splitlines()
chars = sorted(list(set(''.join(words))))
stoi = {s:i+1 for i,s in enumerate(chars)}
stoi['.'] = 0
itos = {i:s for s,i in stoi.items()}
{% endhighlight %}

## How to learn the distribution?

Typically this is done by counting the number of times a character appears after another character. Think of this as a 2D matrix where each row corresponds to a prev_token and each column corresponds to then next_token. Our matrix will have 27 elements (1 extra for the special `.` token). To index into this matrix, it is better to use integers (sure we could have used dicts of dicts but it is not as efficient especially for a small dataset as this).

{% highlight python %}
counts = [[0] * 27 for _ in range(27)]
for w in words:
  chs = ['.'] + list(w) + ['.']
  for ch1, ch2 in zip(chs, chs[1:]):
    ix1 = stoi[ch1]
    ix2 = stoi[ch2]
    counts[ix1][ix2] += 1
{% endhighlight %}

## Visualizing the counts

Andrej had a cool way to visualize this distribution which I'm going to directly copy-paste. It is a cool way to plot this:

{% highlight python %}
plt.figure(figsize=(16,16))
plt.imshow(N, cmap='Blues')
for i in range(27):
  for j in range(27):
    chstr = itos[i] + itos[j]
    plt.text(j, i, chstr, ha='center', va='bottom', color='gray')
    plt.text(j, i, N[i,j].numpy(), ha='center', va='top', color='gray')
plt.axis('off')
{% endhighlight %}

![assets/bigram_model_counts]({{ site.url }}/assets/bigram_model_counts.png)

## Normalizing the counts

To sample based on the distribution, it is better to have probabilities instead of counts. See my earlier post on [random pick weight]({% post_url 2023-10-30-random-pick-weight %}) for some detailed explanation. Here I will use some tensorflow functions to do the same thing.

{% highlight python %}
P = tf.constant(counts, dtype=tf.float32)
P /= tf.math.reduce_sum(P, axis=1, keepdims=True) # 27, 1
{% endhighlight %}

First, we convert the counts into a tensor of floating point numbers. Next, we normalize each row to sum up to 1. This can be done by taking the each value in a row and dividing it by the sum of all the columns in the row but tensorflow can do it with a single call to `tf.math.reduce_sum`. Watch Andrej's lecture to see why we need `keepdims=True` (he does a great job explaining that).

## Writing the 'model' (LOL)

How do we convert this matrix into a model? It *is* the model. We just need to wrap this into a form we can call directly. This can be done by using Python's `__call__` method.

{% highlight python %}
from typing import List

class BigramModel:
    def __init__(self, words : List[str]):
        chars = sorted(list(set(''.join(words))))
        self.counts_ = [[0] * len(chars)+1 for _ in range(len(chars)+1)]
        self.stoi_ = {s:i+1 for i,s in enumerate(chars)}
        self.stoi_['.'] = 0
        self.itos_ = {i:s for s,i in self.stoi_.items()}
        for w in words:
            chs = ['.'] + list(w) + ['.']
            for ch1, ch2 in zip(chs, chs[1:]):
                ix1 = self.stoi_[ch1]
                ix2 = self.stoi_[ch2]
                self.counts_[ix1][ix2] += 1
        self.P_ = tf.constant(self.counts_, dtype=tf.float32)
        self.P_ /= tf.math.reduce_sum(self.P_, axis=1, keepdims=True)
    
    def __call__(self, x: str):
        ix = self.stoi_[x]
        p = self.P_[ix].numpy()
        ix = tf.random.categorical(p.reshape(1, -1), num_samples=1)[0,0].numpy()
        return self.itos_[ix]
{% endhighlight %}

## Putting it all together

{% highlight python %}
tf.random.set_seed(42)

model = BigramModel(words)
for i in range(5):
    print(generate_name(model))
{% endhighlight %}

I set the random seed so you can try reproducing the results that I am getting on your machine. Here are the 5 names I got (even more terrible than the pytorch version that Andrej trained). 

{% highlight python %}
hmyxkqmcp
pibtzwr
podmeyshngaloxdopreqplwyxuz
ochopwrfzbehatszeryzexugwxbrqxhbqomwfewwwmeecpd
tqsavkm
{% endhighlight %}

I haven't figured out a way to set the same random seed on both pytorch and tensorflow to compare the two results. But if you get rid of tensorflow and pytorch sampling code and used the numpy version instead, we can get similar results. So, there is nothing wrong with the code.

{% highlight python %}
ix = np.random.multinomial(1, p).argmax()
{% endhighlight %}

## Next steps

Feel free to play around with the code with different datasets (perhaps some names with non-english characters as well). In the next post, we will implement the same terrible model using a neural network.