# MessageManager
A simple message manager class for javascript that allows the management of many messages at one time, and keeps track of when more messages have been added than removed, and vice versa

#usage
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

