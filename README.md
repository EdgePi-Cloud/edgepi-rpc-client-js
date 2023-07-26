# edgepi-rpc-client-js
JavaScript RPC Client for EdgePi RPC Server

## Installing as an NPM module

There is currently an issue regularly installing zeromq as a dependency. The culprit is the following error:
```
symbol lookup error: /**/node_modules/zeromq/build/Release/zeromq.node: undefined symbol: sodium_init
```
To get around this issue, you must first install the zeromq library (libzmq)
```
sudo apt update
sudo apt install libzmq3-dev
```
You will then need to npm install the zeromq dependency specifying that you want to build with with installed
library from the previous step. First ensure you have necessary build dependancies
```
sudo apt-get update && sudo apt-get install -y build-essential cmake
```
Then npm install zeromq with the shared library.
```
npm install zeromq@6.0.0-beta.17 --zmq-shared
```
Now you can simply install edgepi-rpc with the organization's scope from npm
```
npm install @edgepi-cloud/edgepi-rpc
```
If you run into any issues with zeromq after installing the edgepi-rpc package, try reinstalling zeromq
ensuring that it was built against the shared library. For further help installing zeromq, checkout their [github](https://github.com/zeromq/zeromq.js/).
