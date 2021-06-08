# What's RemotePlotter?
RemotePlotter is a study project of a web application with a bit of practicality.
It is a portable data plotter on web browser, meant to provide a handy, consistent way of visualizing data.

## background
In some situations, you want to plot data from your program for debugging purpose or whatever, and you don't have a handy way to do it.
For example when working on C (not even C++!), or getting a stream of data from an embedded system via a USB-serial cable.

RemotePlotter is to serve as a handy, consistent and practical way to plot and investigate into a stream of data.

## Components
RemotePlotter consists of two components;front-end plotter and back-end data transmitter.
Data transmitter receives data at its standard input and transmits them to the front-end via websocket.
On the plotter side, data transferred via websocket by a transmitter are plotted on a web browser's canvas.

