# edgepi-rpc-client-js
JavaScript RPC Client for EdgePi RPC Server

## Installing as an NPM module

There is currently an issue regularly installing zeromq as a dependency.
To get around this issue, you must first install the zeromq library (libzmq)
```
sudo apt update
sudo apt install libzmq3-dev
```

This will allow linking against a local libzmq when npm installs zeromq as a dependency

Now you can simply install edgepi-rpc with the organization's scope from npm
```
npm install @edgepi-cloud/edgepi-rpc
```
