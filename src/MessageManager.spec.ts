declare var
    describe: any,
    it: any,
    expect: any,
    beforeEach: any,
    MessageManager: any;
/* tslint:disable:typedef */
describe('MessageManager', function () {
    var mm: any;
    beforeEach(function () {
        mm = new MessageManager();
    });

    function loadAsGlobal() {
        return new Promise((resolve) => {
            (window as any).define = undefined;

            var script = document.createElement('script');
            script.onload = function () {
                resolve();
            };
            script.src = 'base/dist/MessageManager.js';
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }

    it('exists', function (done) {
        loadAsGlobal().then(() => {
            expect((window as any).MessageManager).not.toBe(undefined);
        }).then(done);
    });

    it('constructs', function () {
        expect(function () {
            mm = new MessageManager();
        }).not.toThrow();
    });

    describe('add', function () {
        it('adds an item', function () {
            mm.add('some message');
            expect(mm.getOutstandingMessages()['some message']).toEqual(1);

            mm.add('some other message');
            expect(mm.getOutstandingMessages()['some message']).toEqual(1);
            expect(mm.getOutstandingMessages()['some other message']).toEqual(1);
        });

        it('returns a remove function, and it works', function () {
            var remove = mm.add('some message');
            expect(typeof remove).toEqual('function');
            expect(mm.message).toEqual('some message');
            remove();
            expect(mm.message).toBe(undefined);
        });
    });

    describe('clear', function () {
        it('handles clearing when nothing is there to clear', function () {
            expect(mm.message).toBe(undefined);
            expect(function () {
                mm.clear();
            }).not.toThrow();
        });

        it('clears all messages', function () {
            mm.add('msg1');
            expect(mm.message).toEqual('msg1');
            mm.add('msg2');
            expect(mm.message).toEqual('msg2');
            mm.clear();
            expect(mm.message).toEqual(undefined);
            expect(mm.getOutstandingMessages()).toEqual({});
        });
    });

    describe('getOutstandingMessages', function () {
        it('handles when a message goes to zero and back', function () {
            expect(mm.getOutstandingMessages()).toEqual({});
            var remove = mm.add('msg');
            expect(mm.getOutstandingMessages()).toEqual({ 'msg': 1 });
            remove();
            expect(mm.getOutstandingMessages()).toEqual({});
        });

        it('handles when a message goes negative', function () {
            mm.remove('msg');
            expect(mm.getOutstandingMessages()).toEqual({ 'msg': -1 });
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
            expect(mm.message).toBe(undefined);
        });
    });

    it('works with requirejs', function (done) {
        var req: any = require;
        req(['MessageManager'], function (MM) {
            try {
                var m = new MM();
                expect(true).toBe(true);
                done();
            } catch (e) {
                expect(true).toBe(false);
                done();
            }
        });
    });
});