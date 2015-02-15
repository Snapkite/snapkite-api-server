# Snapkite API Server

API server for [Snapkite Engine](https://github.com/fedosejev/snapkite-engine).

## Dependencies

* [Snapkite Engine](https://github.com/fedosejev/snapkite-engine).
* MongoDB.

## Install

1. `git clone https://github.com/fedosejev/snapkite-api-server.git`
2. `cd snapkite-api-server`
3. `cp example.config.json config.json`

## Run

`npm start`

Snapkite API server is now listening to the port specified in a config file.

## API

All requests are GET.

#### `/api/1.0/tweets/all`

Returns 10 latest tweets.

#### `/api/1.0/tweets/all/:numberOfTweets`

Returns `:numberOfTweets` latest tweets.

#### `/api/1.0/tweets/all/:numberOfTweets/:offset`

Skips `:offset` and returns `:numberOfTweets` latest tweets.

#### `/api/1.0/tweets/keyword/:keyword`

Returns 10 latest tweets with a keyword `:keyword`.

#### `/api/1.0/tweets/keyword/:keyword/:numberOfTweets`

Returns `:numberOfTweets` latest tweets with a keyword `:keyword`.

#### `/api/1.0/tweets/keyword/:keyword/:numberOfTweets/:offset`

Skips `:offset` and returns `:numberOfTweets` latest tweets with a keyword `:keyword`.

## License

Snapkite API Server is released under the MIT license.

This software comes with NO WARRANTY, expressed or implied.
