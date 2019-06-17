#!/usr/bin/env node
import { RofiJS } from '../index';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

// scan for plugins and save to file
if(argv.scan) {
    const rofijs = new RofiJS();
    rofijs.scanPlugins(() => {
        console.log('### Done scanning... found # plugins');
    });
}

// open root menu
if(argv.open) {
    const rofijs = new RofiJS();
    rofijs.open();
}


// run a plugin directly
if(argv.plugin) {
    const rofijs = new RofiJS();

    rofijs.open(argv.plugin);
}