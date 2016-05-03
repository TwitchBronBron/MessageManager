/**
 * @license MessageManager v1.0.0
 * (c) 2016 Bronley Plumb
 * License: MIT
 */
class MessageManager {
    private messageStack: IMessageContainer[] = [];
    public message: string;

    /**
     * Adds a new message to the manager, or increments the given message if it already exists
     * @param {string} message - the message
     * @return {Function} - A function that, when called, will remove the message. 
     *                      Alternatively, you can call MessageManager::remove(message) with the same message text. 
     */
    public add(message: string): Function {
        this.set(message, true);
        return () => {
            this.remove(message);
        };
    }

    private _calculateMessage(): void {
        if (this.messageStack.length === 0) {
            this.message = undefined;
            return;
        }

        // find the most recent message
        var messageContainer = this.messageStack[this.messageStack.length - 1];
        this.message = messageContainer.message;
        var something: string = 'hello';
        var someOtherThing = something;
    }

    /**
     * Clears all messages
     */
    public clear(): void {
        this.messageStack = [];
        this.message = undefined;
    }

    /**
     * Get the list of messages that have not yet been resolved
     */
    public getOutstandingMessages(): { [key: string]: number } {
        var messages: { [key: string]: number } = {};
        for (var i = 0; i < this.messageStack.length; i++) {
            var messageContainer = this.messageStack[i];
            messages[messageContainer.message] = 0;
            var addend = messageContainer.direction === '+' ? 1 : -1;
            messages[messageContainer.message] += addend;
        }
        return messages;
    }

    /**
     * Removes a message from the manager, or decrements the message if it already exists
     * @param {string} message - the message 
     */
    public remove(message: string): void {
        this.set(message, false);
    }

    /**
     * Adds or removes a message from the manager. 
     * @param {string} message - the message
     * @param {boolean} [isAdd=true] - if true, a message is added or incremented. If false, a message is removed or decrimented
     */
    public set(message: string, isAdd: boolean): void {
        var direction = isAdd === false ? '-' : '+';
        // find an opposite messages to this one. 
        for (var i = this.messageStack.length - 1; i >= 0; i--) {
            var loopMessageContainer = this.messageStack[i];
            if (loopMessageContainer.message === message) {
                if (loopMessageContainer.direction !== direction) {
                    // remove 
                    this.messageStack.splice(i, 1);
                    this._calculateMessage();
                    return;
                }
            }
        }
        // we did not return, so that means this is a new message. add it to the list
        var messageContainer = { direction: direction, message: message };
        this.messageStack.push(messageContainer);
        this._calculateMessage();
    }

}
interface IMessageContainer {
    direction: string;
    message: string;
}