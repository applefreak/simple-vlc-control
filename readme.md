# simple-vlc-control

> Controls VLC with a twist

## Install

```bash
npm install simple-vlc-control
```

## Usage

```js
const vlc = require('simple-vlc-control')

const instance = vlc({ password: '1234' }) // Creates control instance

instance.togglePlay() // Toggles "Play"

// The seek value are send straight to VLC's API, see below for value format
instance.seek('1000') // seek to the 1000th second
instance.seek('+1H:2M') // seek 1 hour and 2 minutes forward
instance.seek('-10%') // seek 10% back

const event = instance.startPoll(); // Start polling for state

// watches state change, newState will be "playing" or "paused"
event.on('STATE_CHANGE', newState => console.log(newState))
```

## API

### `vlc(options)`

Type: `Object`

Creates a new control instance

#### `options.host`

Type: `String`

The address VLC API is running.

Default: `localhost`

#### `options.port`

Type: `String`

The port VLC API is running.

Default: `8080`

#### `options.password`

Type: `String`

The password for VLC auth.

This setting is in `Interface -> LUA HTTP -> Password`.

Default: `pass`

#### `options.pollInterval`

Type: `Number`

The interval in milliseconds that `startPoll` will try to poll.

Default: `250`

### `instance.togglePlay(callback)`

Toggles between playing and pause.

#### `callback`

Type: `Function`

Called with `(err, status)`, where `status` is an `object` returned from VLC API.

### `instance.seek(time, callback)`

Seek to time or seek time forward or backward.

#### `time`

Type: `String`

Time format as following, quoted from VLC doc:

```
  Allowed values are of the form:
    [+ or -][<int><H or h>:][<int><M or m or '>:][<int><nothing or S or s or ">]
    or [+ or -]<int>%
    (value between [ ] are optional, value between < > are mandatory)
  examples:
    1000 -> seek to the 1000th second
    +1H:2M -> seek 1 hour and 2 minutes forward
    -10% -> seek 10% back
```

#### `callback`

Type: `Function`

Called with `(err, status)`, where `status` is an `object` returned from VLC API.

## Events

You can recieve events when the state of the player changes (`playing` or `paused`).

To start watching this event, you need to call `instance.startPoll()`.

### `instance.startPoll()`

Returns: `EventEmitter`

#### `STATE_CHANGE` event

Fired upon player's state change. `newState` is being passed in, will either be `playing` or `paused.

```js
const event = instance.startPoll(); // Start polling for state
event.on('STATE_CHANGE', newState => console.log(newState))
```

## License

[MIT](https://poyu.mit-license.org)
