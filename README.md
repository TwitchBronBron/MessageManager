# MessageManager
[![Build Status](https://travis-ci.org/TwitchBronBron/MessageManager.svg?branch=master)](https://travis-ci.org/TwitchBronBron/MessageManager)

A simple message manager class for javascript that allows the management of many messages at one time, and keeps track of when more messages have been added than removed, and vice versa

# Installation
## Node.js (CommonJs)
Install as an npm module
```bash
npm install message-manager
```
Import it using require
```javascript
var MessageManager = require('message-manager');
```

## ES2015 module

Install using npm
```bash
npm install message-manager
```

Then import it using the es2015 module syntax

```javascript
import {MessageManager} from 'message-manager';
```


## Browser global
Include the script in your html

```html
<script src="MessageManager.js"></script>
```

And then use it anywhere in your javascript

```javascript
//you can prefix with window
var mm1 = new window.MessageManager();
//or not prefix with window, because window is assumed in browser environments
var mm2 = new MessageManager();
```

## RequireJS or AMD module
Include the script in your html

```html
<!--requirejs has already been included-->
<script src="MessageManager.js"></script>
```
And then request it in a require statement

```javascript
require(['MessageManager'], function(MessageManager){
    var mm = new MessageManager();
});
```

# Usage
```javascript
//construct a new instance of message manager
var mm = new MessageManager();

mm.add('loading user data');
//mm.message === 'loading user data'

var remove = mm.add('loading something else');
//mm.message === 'loading something else'

//call the remove function to remove a message
remove();
//mm.message === 'loading user data'

//call the remove method manually to remove a message
mm.remove('loading user data');
//mm.message === undefined
```
