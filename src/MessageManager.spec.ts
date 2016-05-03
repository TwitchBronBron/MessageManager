declare var describe: any, it: any, expect: any;
/* tslint:disable:typedef */
describe('MessageManager', function () {
    it('exists', function () {
        expect((window as any).MessageManager).not.toBe(undefined);
    });
});