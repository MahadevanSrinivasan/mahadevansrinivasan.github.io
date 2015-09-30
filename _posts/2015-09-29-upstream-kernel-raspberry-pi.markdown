---
layout: post
title:  "Upstream linux kernel on a Raspberry Pi"
date:   2015-09-29 20:55:07
tags: linux raspberry pi eudyptula
---

Recently, I signed up for the [Eudyptula Challenge](http://eudyptula-challenge.org/). If you have not heard of it, it is a series of programming exercises designed to train you with Linux Kernel Development process.
One of the tasks is to install the latest linux kernel on your machine. You have an option of doing it in a Virtual box setting. Hey, but where is the fun in doing that? I had a Raspberry Pi handy and found a couple of good Wiki pages on how to compile your own kernel for Raspberry Pi ([here](http://elinux.org/RPi_Upstream_Kernel_Compilation) and [here](http://elinux.org/RPi_Kernel_Compilation)). These two pages have the all the info needed but it is kind of scattered.
Fastest way to compile the kernel is to do in in Ubuntu (You could technically do it on a MAC, but it is slightly more involved). I tried on my MAC first but ended up installing Ubuntu through Virtualbox to do the compilation. Here are the steps:

- Install Virtualbox on your MAC (skip if you already have a Ubuntu setup)
  - Make sure you allocate atleast 16 GB for your Ubuntu partition.
- Create a new directory in your home directory and call it whatever you want (I called it linux).
- Install git using the following command:

{% highlight bash %}
sudo apt-get install git
{% endhighlight %}

- Change your current directory to the new  one you just created.
- Run this command to get the compiler:

{% highlight bash %}
sudo apt-get install gcc-arm-linux-gnueabi make ncurses-dev
{% endhighlight %}

- Run this command to get the u-boot (default raspberry pi bootloader won’t work for the upstream kernel)

{% highlight bash %}
git clone https://github.com/swarren/u-boot
{% endhighlight %}

- Get the kernel source from Linus Torvalds

{% highlight bash %}
git clone git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git --depth=1
{% endhighlight %}

- Create the following exports:

{% highlight bash %}
export KERNEL_SRC=/path/to/your/linux
export CCPREFIX=/path/to/your/compiler/binary/prefix-of-binary-
mkdir /path/to/your/modules
export MODULES_TEMP=/path/to/your/modules  
{% endhighlight %}

- Time to create a config file which tells what to compile and what not to.  (`ARCH=arm & CROSS_COMPILE=${CCPREFIX}` very important).

{% highlight bash %}
$ cd linux
$ ARCH=arm CROSS_COMPILE=${CCPREFIX} make bcm2835_defconfig
$ ARCH=arm CROSS_COMPILE=${CCPREFIX} make menuconfig
{% endhighlight %}

- Second command creates a .config file in your current directory and the menuconfig command opens up a new window for selecting different modules to compile. Just enabled the option which says “Modules” and save the configuration.
- Finally to do the actual the compilation and install all the needed modules (in a temporary location):

{% highlight bash %}
$ ARCH=arm CROSS_COMPILE=${CCPREFIX} chrt -i 0 make -j 2
$ ARCH=arm CROSS_COMPILE=${CCPREFIX} INSTALL_MOD_PATH=${MODULES_TEMP} make modules_install
{% endhighlight %}

- Once kernel compiles successfully (which it should if you have followed the steps), time to compile the bootloader. Run the following commands:

{% highlight bash %}
$ cd ../u-boot
$ git checkout -b rpi_dev origin/rpi_dev
$ ARCH=arm CROSS_COMPILE=${CCPREFIX} chrt -i 0 make rpi_config
$ ARCH=arm CROSS_COMPILE=${CCPREFIX} chrt -i 0 make -j 8
{% endhighlight %}

- Once this is done, go inside the tools directory under u-boot directory:

{% highlight bash %}
$ cd tools
{% endhighlight %}

- Create a file by name boot.scr with the following contents (for Raspberry Pi Model B):

{% highlight bash %}
mmc dev 0
setenv fdtfile bcm2835-rpi-b.dtb
setenv bootargs earlyprintk console=tty0 console=ttyAMA0 root=/dev/mmcblk0p2 rootwait
fatload mmc 0:1 ${kernel_addr_r} zImage
fatload mmc 0:1 ${fdt_addr_r} ${fdtfile}
bootz ${kernel_addr_r} - ${fdt_addr_r}
{% endhighlight %}

- Or for Model B+:

{% highlight bash %}
mmc dev 0
setenv fdtfile bcm2835-rpi-b-plus.dtb
setenv bootargs earlyprintk console=tty0 console=ttyAMA0 root=/dev/mmcblk0p2 rootwait
fatload mmc 0:1 ${kernel_addr_r} zImage
fatload mmc 0:1 ${fdt_addr_r} ${fdtfile}
bootz ${kernel_addr_r} - ${fdt_addr_r}
{% endhighlight %}

- And then run the following command (this should generate a boot.scr.img)

{% highlight bash %}
$ ./mkimage -A arm -O linux -T script -C none -n boot.scr -d boot.scr boot.scr.uimg
{% endhighlight %}

- Now, go to your /boot directory on your Raspberry Pi and create a new directory called backup and move everything inside the backup directory. You might have to sudo the last command.

{% highlight bash %}
$ export SD=/boot
$ mkdir $SD/backup
$ mv $SD/* $SD/backup
{% endhighlight %}

- Fetch `start.elf` and `bootcode.bin` from https://github.com/raspberrypi/firmware/tree/master/boot and save it to your `$SD`
- Finally, move all the required files from your Ubuntu machine to your Raspberry Pi using scp. You might have to move it to a temporary location first (in this case I am moving it to the home directory).

{% highlight bash %}
$ scp u-boot/u-boot.bin pi@192.168.1.101:~/kernel.img
$ scp linux/arch/arm/boot/zImage linux/arch/arm/boot/dts/bcm2835-rpi-b.dtb u-boot/tools/boot.scr.uimg pi@192.168.1.101:~/
{% endhighlight %}

- Go to your Raspberry Pi and use sudo mv to move the files from your home directory to the /boot directory as follows:

{% highlight bash %}
$ sudo mv ~/kernel.img ~/zImage ~/bcm2835-rpi-b.dtb ~/boot.scr.uimg /boot/
{% endhighlight %}

- Now your boot directory should have the following files:

{% highlight bash %}
u-boot.bin
kernel.img
zImage
bcm2835-rpi-b.dtb
boot.scr.uimg
start.elf
bootcode.bin
{% endhighlight %}

- For Model B+, you will have `bcm2835-rpi-b-plus.dtb` instead of `bcm2835-rpi-b.dtb`.
- Copy your source code from the Ubuntu machine to your Raspberry Pi:

{% highlight bash %}
$ scp -r /path/to/your/linux/ pi@192.168.1.101:/home/pi/
{% endhighlight %}

- Change the permissions just in case

{% highlight bash %}
$ cd /home/pi
$ sudo chown -R pi:pi linux/
{% endhighlight %}

- Copy the modules next (Move to a temporary folder if you can’t write to /lib/modules directly and then sudo mv it).

{% highlight bash %}
$ sudo scp -r /path/to/your/modules/`uname -r`/ pi@192.168.1.101:/lib/modules/
{% endhighlight %}

- Correct the symbolic links next:

{% highlight bash %}
$ sudo cd /lib/modules/`uname -r`/
$ sudo rm build source
$ ln -s /home/pi/linux build
$ ln -s /home/pi/linux source
{% endhighlight %}

- Finally, we need to fix one more problem: During the cross-compilation build, a couple scripts were compiled for the host. We also need them for the Raspberry Pi. Still on the Pi, this can be checked with e.g.

{% highlight bash %}
$ file /home/pi/linux/scripts/recordmcount (returns something with x86-64)
$ cd /home/pi/linux/
$ make scripts
$ file /home/pi/linux/scripts/recordmcount (now returns something with 32-bit and ARM)
{% endhighlight %}

- Reboot the device and see your new kernel load in all its glory.
