/**
 * @license MessageManager v1.0.0
 * (c) 2016 Bronley Plumb
 * License: MIT
 * https://github.com/TwitchBronBron/MessageManager
 */
declare class MessageManager {
    private messageStack;
    message: string;
    /**
     * Adds a new message to the manager, or increments the given message if it already exists
     * @param {string} message - the message
     * @return {Function} - A function that, when called, will remove the message.
     *                      Alternatively, you can call MessageManager::remove(message) with the same message text.
     */
    add(message: string): Function;
    private _calculateMessage();
    /**
     * Clears all messages
     */
    clear(): void;
    /**
     * Get the list of messages that have not yet been resolved
     */
    getOutstandingMessages(): {
        [key: string]: number;
    };
    /**
     * Removes a message from the manager, or decrements the message if it already exists
     * @param {string} message - the message
     */
    remove(message: string): void;
    /**
     * Adds or removes a message from the manager.
     * @param {string} message - the message
     * @param {boolean} [isAdd=true] - if true, a message is added or incremented. If false, a message is removed or decrimented
     */
    set(message: string, isAdd: boolean): void;
}
interface IMessageContainer {
    direction: string;
    message: string;
}
