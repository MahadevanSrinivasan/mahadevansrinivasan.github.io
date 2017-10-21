---
layout: post
title:  "Optimized Integer Programming Python Module"
date:   2017-10-20 20:18:00
tags: integer programming python gradient descent numpy
---

For one of my side projects, I had to solve an [integer programming](https://en.wikipedia.org/wiki/Integer_programming) problem. I was initially contemplating on using some existing MATLAB/Octave package to the job. But, the only option that was available was the [Genetic Algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm) module in MATLAB. It turns out to be too random and not methodical at all. This is not surprising as genetic algorithm is in essence a random algorithm and does not suit all kinds of problems. It could work for [some problems](). Next option was to look into [Simulated Annealing](https://en.wikipedia.org/wiki/Simulated_annealing). Even for this, there was a package in MATLAB. It worked ok but the convergence was too slow for my needs. So, I ended up writing my own custom gradient descent algorithm to solve this problem using Python. In this article, I am going the detail the algorithm and the design choices. I am still writing it up in a form suitable for an open source release. Feel free to fork.

### Intro to Integer Programming

Conventional defition of Integer Programming might be slightly more generic. But, here is the problem I was trying to solve. I had a system which had several parameters that needed hand-tuning and each of those parameters could only take *integer* values. This means, conventional gradient descent algorithms would not work as they are designed for real-valued parameter space. Enter Integer Programming. Why not do an exhaustive search over all possible parameters, you ask? You could if the parameter space is small. Now, imagine you have 15 different parameters each taking 15 different values. That is 15<sup>15</sup> parameters. If that does not look large, load up google and check - this is equal to ~ 420 Quadrillion (Million Billion). Even if evaluating a single parameter set takes 1 micro-second, it is going to take 420 billion seconds to do the exhaustive search. So, that will take around 13354 years to complete. You get my drift. 

### Defining the parameter space

First thing to do is define the parameter space. This means the lower and upper bound (both inclusive) for your dataset. Here is an example on how to do it with a `numpy` array for a 8 parameter space. Notice, how the last parameter has the same upper and lower bound. This means, we have fixed that parameter space for now. We can change it later if needed. Another key point here is the `dtype = np.int32`. This tells numpy that this array can only contain integer values. We are not planning to change this lower and upper bound arrays. This is just to tell whoever is reading the program that we are going to use integers. Now that we have defined the bounds, we can also define some *known* start points. May be you have optimized a similar problem before and want to use that knowledge for quicker convergence. I am going to define start points as a 2D array as we could have more than one. Here I have only one start point. But feel free to add more if you like.

{% highlight python %}
import numpy as np
lower_bound = np.array([0, 0, 0, 0, 0, 0, 5, 10], dtype=np.int32)
upper_bound = np.array([15, 15, 15, 15, 15, 15, 15, 10], dtype=np.int32)
start_points = np.array([[7, 7, 7, 7, 7, 7, 5, 10]], dtype=np.int32)
{% endhighlight %}

### Defining the fitness function

Some people call this the cost function. Whatever name you choose, this is an absolute must for any optimization problem. This function should take as input a parameter set and should be able to evaluate the `fitness` of that set. Keep in mind, your optimization problem could try to minimize or maximize the fitness function and you need to define the return value of the fitness function accordingly. For simplicity, let us stick to minimizing the cost. Here is a prototype of a fitness function.

{% highlight python %}
def fitness_function(curr_point):
  """ Evaluate the fitness function """
  return cost
{% endhighlight %}

May be you cannot evaluate your fitness function using Python alone. If you have an executable, then you can just make it return the fitness value to your Python program. In any case, write a function that can provide a single number that you want to minimize. 

### Early stopping

Since we are searching a huge parameter space, we should add ways to stop early. I used the following two early-stopping criteria: 

- Fixed number of iterations
- Stop limit

If you know how long you want the optimization routine to run, you can choose the number of iterations based on that. If each iteration takes 0.2 seconds and say you do not want to spend more than an hour, you could choose 18000 iterations. Stop limit is a better early stopping method. May be you do not want the least cost function. As long as the cost function is below a certain limit, you are fine. In that case, if the fitness function goes below the stop limit, you can just stop searching then.

There are other popular techniques as well like: stop if the fitness function has not reduced in X iterations or stop if the fitness function has not reduced by more than some small number epsilon (say 0.001).

### Gradient Descent for Integer Programming

This is the key part of the problem. How do you move from one parameter set to a better parameter set? Let us look to the real-number gradient descent for inspiration. In that case, we calculate the differentiate the cost function with respect to each parameter separately and change the parameter by a small portion of the negative of those gradients. If this sounds too complicated, take a look at this [Coursera video](https://www.coursera.org/learn/machine-learning/lecture/8SpIM/gradient-descent). Main idea behind gradient descent is to change the parameter in the right direction but only by a small amount. Too large a change can cause the algorithm to diverge. Smaller changes are better even though they could take more time to converge. In Gradient Descent problems, this is called the learning rate. I will do another post on regular gradient descent soon. 

For Integer Programming, we extend this idea but with a small twist. Take the current parameter set and compute its **neighbors** by making small changes to the current parameter set. Here is how I did it. A neighbor is a parameter set with just a single parameter incremented or decremented by 1 from the current point while still satisfying the bounds. An example might make it clear. For our initial starting point of `[7, 7, 7, 7, 7, 7, 5, 10]`, a valid neighbor is `[8, 7, 7, 7, 7, 7, 5, 10]`. An invalid neighbor is `[7, 7, 7, 7, 7, 7, 5, 11]` since the last parameter is not within the bounds. Once we calculate all the valid neighbors, next step is to evaluate the cost for all these neighbors and also the current parameter set. Armed with these costs, we can now make a decision of which parameter set to move to from the current parameter set. It is the one that decreases the cost function the most. And this neighbor becomes the current parameter set and we repeat this process till we cannot reduce the cost further (which will happen sooner or later). 

### Peek into a Gradient Descent Iteration

Before we dive into the gradient descent iteration, let us discuss how to make sure we don't evaluate the same parameter set mutliple times. This turns out to be quite simple. We just need to store the evaluated parameter sets/costs in a hash table. In python, we can use a dictionary to do this. Here is the code that runs one iteration of gradient descent starting from a parameter set `curr_point`. Notice how I convert the array to a string to be used as the key to the hash table as you cannot use a list as a key. One last function that we have not talked about is the `mark_neighbors_as_complete` function. The purpose of this function is to not visit the *sub-optimal* neigbors again. That function will iterate over all the parameter sets except the `curr_point` and set their costs to infinity in the hash table. `find_neighbors` function is defined in the previous section and is left as an exercise to the reader. I will provide an implementation in the complete code. 

{% highlight python %}
def gradient_descent_iteration(curr_point):
  param_cost_map = {}
  best_iter_score = np.inf
  best_iter_point = None
  neighbors = curr_point
  iter_num = 0
  
  while neighbors.any():
    curr_point = neighbors[0, :]
    key = str(curr_point)
    if key in param_cost_map:
      curr_score = param_cost_map[key]
    else:
      curr_score = fitness_function(curr_point)
      param_cost_map[key] = curr_score
    
    if curr_score > best_iter_score or abs(curr_score - best_iter_score) < 0.001:
      mark_neighbors_as_complete(neighbors[1:, :])
      neighbors = np.array([])
    else:
      best_iter_score = curr_score
      best_iter_point = curr_point
      neighbors = find_neighbors(best_iter_point)
      
  return best_iter_score, best_iter_point
{% endhighlight %}

### Restarting searches

Above code might end very quickly depending on how good the starting point is. What happens when we are in a rut where the cost function stops decreasing? We need restart the search from a random point and do the iteration again. Here is a simple implementation of a random point generation. Quite self-explanatory.

{% highlight python %}
def generate_random_point(lower_bound, upper_bound):
  new_start_point = np.zeros_like(lower_bound)
  for i in range(len(self.lower_bound)):
    new_start_point[i] = np.random.randint(lower_bound[i], upper_bound[i]+1)
  return new_start_point
{% endhighlight %}


### Running multiple iterations

Putting these all together, the overall optimization function might look something like the following code. 


{% highlight python %}
def optimize(start_points, lower_bound, upper_bound, num_iterations, stop_limit):
  iter_num = 0
  start_point_index = 0
  best_score = np.inf
  best_point = None
  while iter_num < num_iterations:
    if start_point_index > start_points.shape[0]-1:
      curr_point = generate_random_point(lower_bound, upper_bound)
    else:
      curr_point = start_points[start_point_index, :]
      start_point_index += 1
    
    best_iter_score, best_iter_point = gradient_descent_iteration(curr_point)
    
    if best_iter_score < best_score:
      best_score = best_iter_score
      best_point = best_iter_point
     
    if best_score < stop_limit:
      print('Early exit criteria met')
      break
  
  print('Best point ' + str(best_point))
  print('Best score = %.2f' %(best_score))    
{% endhighlight %}

### Conclusion

This algorithm might not yield the most optimal solution. But, it yields the best sub-optimal solution under the given time requirements. A word of caution: do not use this method to solve a problem if you can exhaustively search all the parameter sets in a short time. That is not what this is designed for. I will provide a different implementation that will work for that case. In the complete code, I have used a Python class to encapsulate all the parameters. But the idea is the same. I will upload the full code to my Github soon. Have fun Integer Programming. 

