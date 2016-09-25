---
layout: post
title:  "Logistic Regression Theory"
date:   2016-08-29 14:09:00
tags: logistic regression machine learning
---

Several years ago, I took multiple Machine Learning related courses on Coursera. And I did a quite a few projects on those courses. I don't really have the results or the code documented anywhere. So, I am starting a small Machine Learning series to help me also recollect all those projects. One of the first projects we did on the Coursera ML course is Digit Recognition. There is a well known digit dataset called MNIST. For the course though, we used a small subset of the dataset. We have a set of scanned images which contain numbers and we have to design a model to correctly classify them. Before we look into the full classification, it makes sense to start with something simpler. How about just classifying the 0s and the 1s?

### Theory

Logistic Regression for classification works on a very simple principle. Let us say, we have 10 features and 2 classes. We want to create a model that can take in an input of 10 features and output which class it belongs to. Going back to our digit classification example, if given the image of a 0, the model should output "Class 1" and for the image of a 1, it should output "Class 2". What are the features of an image? Easiest one is pixels. So, if we have a 20x20 image, then we have 400 features.

For convenience, we represent the image as one long vector. In our example, it is just a vector of 400 values. Going back to the model, imagine another vector of size 400. Let us call it \\( \\theta \\). We want to select values of \\( \\theta \\) that when multiplied with the pixels of a "0" image outputs a value of 0 and when multiplied with the pixels of a "1" image outputs a value of 1. Simple enough. How do we mathematically formulate this?

We know that the pixels (assuming a gray scale image) have values between 0 and 255. Let us say \\( \\theta \\) can take any real value. How do we restrict the product of these two vectors to have just two values 0 and 1?

#### Sigmoid function

That is where we need a sigmoid function. A sigmoid function takes in a real value and outputs a value between 0 and 1. So, if we were to send the product of \\( \\theta \\) and the Image pixels through a sigmoid function, we can create a real number output between 0 and 1. Now, we could simply choose "Class 1" if the value is below 0.5 and "Class 2" if the value is above 0.5 breaking ties for 0.5 however you want.

$$
g =  \frac{1.0}{(1.0 + e^{-z})}
$$

### Octave code

{% highlight matlab %}
num_labels = 2;

load('ex3data1_01.mat'); % training data stored in arrays X, y

lambda = 0.1;
% Some useful variables
m = size(X, 1);
n = size(X, 2);

all_theta = zeros(num_labels, n + 1);

% Add ones to the X data matrix
X = [ones(m, 1) X];

initial_theta = zeros(n + 1, 1);

options = optimset('GradObj', 'on', 'MaxIter', 50);

for c = 1:num_labels
    all_theta(c,:) = fmincg (@(t)(lrCostFunction(t, X, (y == c), lambda)), initial_theta, options);
end
% Prediction
[~, pred] = max(all_theta * X', [], 1);
pred = pred(:);

fprintf('\nTraining Set Accuracy: %f\n', mean(double(pred == y)) * 100);

{% endhighlight %}

First, we load the input data. Here I have taken the input data provided by Dr. Andrew Ng and reduced it to a smaller set with images for just 0 and 1. Next, we add a bias term to the input. So, the input array X will have 401 columns after this step. If the number of samples is `m`. Then X is an `m x 401` matrix. We start with an initial value of all zeroes for the feature vector \\( \\theta \\). It's size is `401 x 1`. Now, all we have to do is run an unconstrained optimization function which optimizes \\( \\theta \\) to give the smallest cost function. Let us look at the cost function next.

### Cost Function

I recommend watching Dr. Ng's lecture on how we came up with the cost function. I will give a quick intuition. Here is the equation:

$$
J(\theta) = \frac{1}{m} \sum_{i=1}^m [-y^{(i)} log(h_{\theta}(x^{(i)}) - (1-y^{(i)} log(1 - h_{\theta}(x^{(i)}))]
$$
where
$$
h_{\theta}(x^{(i)}) = g(\Theta^{T}x^{(i)})
$$

We have `m` training samples. `y` is the actual label for the image. If the current \\( \\theta \\) predicts the `y` value correctly, then it should add nothing or a very small value to the cost function. But, if it predicts it wrongly it should add a large value to the cost function. Take for example an image with a zero. If \\( h_{\\theta}(x^{(i)}) \\) turns out to be zero. Then it is a match. First term becomes zero because \\( y^{(i)} \\) is zero and the second term becomes zero because `log(1 - 0)` is zero. Similar reasoning holds good when we classify a 1 correctly. But, if we were to classify something wrong, we will end up increasing the cost function. We will also need to come up with a gradient function to be used with the unconstrained optimization function.


{% highlight matlab %}
function [J, grad] = lrCostFunction(theta, X, y, lambda)
%LRCOSTFUNCTION Compute cost and gradient for logistic regression with
%regularization
%   J = LRCOSTFUNCTION(theta, X, y, lambda) computes the cost of using
%   theta as the parameter for regularized logistic regression and the
%   gradient of the cost w.r.t. to the parameters.

% Initialize some useful values
m = length(y); % number of training examples

J = 0;
grad = zeros(size(theta));

J = ( (1 / m) * (-y'*log(sigmoid(X*theta)) - (1-y)'*log( 1 - sigmoid(X*theta))) ) + (lambda/(2*m))*(theta(2:end)'*theta(2:end)) ;
htheta = sigmoid(X*theta) - y;
grad = (1 / m) * (X' * htheta);
grad(2:end) = grad(2:end) + (lambda / m) * theta(2:end);
grad = grad(:);

end

{% endhighlight %}

### Final Thoughts

When we try to just classify 0s and 1s, we can easily get to 100% accuracy on the training set. But, in real life we will need to run the test on a different (previously unpresented) dataset to measure the accuracy of our classifier. In the next post, we will look at how to extend this to a multi-class classification problem and some results.
