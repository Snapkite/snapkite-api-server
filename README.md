# Snapkite API Server

API server for [Snapkite](https://github.com/fedosejev/snapkite).

## Dependencies

* MongoDB

## Install

1. `git clone https://github.com/fedosejev/snapkite-api-server.git`
2. `cd snapkite-api-server`
3. `cp example.config.json config.json`

## Run

`npm start`

This should return you 10 latest tweets:

`http://localhost:7001/api/tweets/all/10`

This should return you 10 latest tweets with a keyword `hello`:

`http://localhost:7001/api/tweets/keyword/hello/10`

## License

Released under the MIT license.
