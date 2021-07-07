import PreloadRegistry from './util/PreloadRegistry';
// reassign require to avoid browserify trying to include node electron
// we need to use the native require call here
const r = require;
const { ipcRenderer } = r('electron');

const preloadRegistry = PreloadRegistry.getInstance();
preloadRegistry.register('ipcRenderer', ipcRenderer);
