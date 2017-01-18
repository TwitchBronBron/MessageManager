var MessageManager = require('./dist/message-manager.js');
var mm = new MessageManager();
mm.add('hello');
console.log(mm.message);