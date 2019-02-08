import { MessageManager } from './MessageManager';
import { expect } from 'chai';

describe('MessageManager', function () {
    var mm: any;
    beforeEach(function () {
        mm = new MessageManager();
    });

    it('constructs', function () {
        expect(function () {
            mm = new MessageManager();
        }).not.to.throw;
    });

    describe('add', function () {
        it('adds an item', function () {
            mm.add('some message');
            expect(mm.getOutstandingMessages()['some message']).to.equal(1);

            mm.add('some other message');
            expect(mm.getOutstandingMessages()['some message']).to.equal(1);
            expect(mm.getOutstandingMessages()['some other message']).to.equal(1);
        });

        it('returns a remove function, and it works', function () {
            var remove = mm.add('some message');
            expect(typeof remove).to.equal('function');
            expect(mm.message).to.equal('some message');
            remove();
            expect(mm.message).to.be.undefined;
        });
    });

    describe('clear', function () {
        it('handles clearing when nothing is there to clear', function () {
            expect(mm.message).to.be.undefined;
            expect(function () {
                mm.clear();
            }).not.to.throw;
        });

        it('clears all messages', function () {
            mm.add('msg1');
            expect(mm.message).to.equal('msg1');
            mm.add('msg2');
            expect(mm.message).to.equal('msg2');
            mm.clear();
            expect(mm.message).to.equal(undefined);
            expect(mm.getOutstandingMessages()).to.be.empty;
        });
    });

    describe('getOutstandingMessages', function () {
        it('handles when a message goes to zero and back', function () {
            expect(mm.getOutstandingMessages()).to.be.empty;
            var remove = mm.add('msg');
            expect(mm.getOutstandingMessages()).to.eql({ 'msg': 1 });
            remove();
            expect(mm.getOutstandingMessages()).to.be.empty;
        });

        it('handles when a message goes negative', function () {
            mm.remove('msg');
            expect(mm.getOutstandingMessages()).to.eql({ 'msg': -1 });
        });
    });

    describe('set', function () {
        it('handles filtering its internal data structure when receiving items from two different directions', function () {
            mm.add('msg');
            mm.add('msg');
            mm.remove('msg');
            mm.remove('msg');
            mm.remove('msg');
            mm.add('msg');
            expect(mm.message).to.be.undefined;
        });
    });
});