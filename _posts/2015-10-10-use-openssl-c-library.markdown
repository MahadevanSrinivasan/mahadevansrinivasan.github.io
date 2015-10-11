---
layout: post
title:  "HOWTO: Using Openssl C library"
date:   2015-10-10 23:07:00
tags: Openssl C HOWTO
---

For one of the [Matasano crypto challenges](http://cryptopals.com/sets/1/challenges/7/), I had to decrypt the text 
which was encrypted using AES in ECB mode. Everything about AES is actually documented by the 
[National Institute of Standards and Technology](http://csrc.nist.gov/publications/fips/fips197/fips-197.pdf). 
You can get all the algorithms behind AES encryption. It is probably not a good idea to implement it from scratch.
Openssl has a well tested and widely used library which works.

This [Openssl library page](https://www.openssl.org/docs/manmaster/crypto/EVP_EncryptInit.html) gives a complete example 
of how to use Openssl libraries. There are a few preparatory steps before you can use the instructions though. These 
instructions are for Ubunutu like Linux distributions. These worked well on my Raspberry Pi too.

### Installing Openssl library

Following command installs all the C libraries needed to use Openssl with your C code.

{% highlight bash %}
sudo apt-get install libssl-dev
{% endhighlight %}

For example, you will want to include the following header files:

{% highlight c %}
#include <openssl/evp.h>
#include <openssl/ssl.h>
#include <openssl/rsa.h>
#include <openssl/x509.h>
{% endhighlight %}

### Compiling your C program with the Openssl library

Next, you can follow the instructions from the 
[Openssl crypto library page](https://www.openssl.org/docs/manmaster/crypto/EVP_EncryptInit.html) to create 
your C program. I have an example program in my [Crytopals](https://github.com/MahadevanSrinivasan/cryptopals/blob/master/s1c7.c)
Github repository. While compiling the program you need to provide the ssl and crypto libraries. 
Following command should do it:

{% highlight bash %}
gcc yourprogram.c -lssl -lcrypto
{% endhighlight %}

### A few pointers on the `do_crypt` function

- If you are going to use the `do_crypt` function for decrypting a text encrypted using electronic code book (ECB) mode, you should remove the following assert line since there is no Initialization Vector for ECB.

{% highlight c %}
OPENSSL_assert(EVP_CIPHER_CTX_iv_length(&ctx) == 16);
{% endhighlight %}

- The example code operates on the raw data. So, if you are trying to decrypt the data which is base64 encoded, your first step should be to convert it into raw data.
