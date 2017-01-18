# MessageManager
[![Build Status](https://travis-ci.org/TwitchBronBron/MessageManager.svg?branch=master)](https://travis-ci.org/TwitchBronBron/MessageManager)

A simple message manager class for javascript that allows the management of many messages at one time, and keeps track of when more messages have been added than removed, and vice versa

# Installation
## npm
    npm install message-manager

Then import it into your node script
    
```javascript
var MessageManager = require('message-manager');
```

## browser
Include the script on your page

```html
<script src="MessageManager.js"></script>
```

Then consume it in one of the following ways:
### As a global

```javascript
var mm = new MessageManager();
```

### As a RequireJS or AMD module

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
mm.message === 'loading user data'

var remove = mm.add('loading something else');
mm.message === 'loading something else'

//call the remove function to remove a message
remove();
mm.message === 'loading user data'

//call the remove method manually to remove a message
mm.remove('loading user data');
//mm.message === undefined
```
