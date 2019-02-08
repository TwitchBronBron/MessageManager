declare var module: any, define: any, System: any;

//register with CommonJS
if (typeof module === 'object' && module.exports) {
    module.exports = (window as any).MessageManager;
}
//register with AMD
if (typeof define === 'function' && define.amd) {
    define('MessageManager', function () {
        return (window as any).MessageManager;
    });
}