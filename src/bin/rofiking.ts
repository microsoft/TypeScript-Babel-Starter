#!/usr/bin/env node

import { RofiJS } from '../index';
import { Menu } from 'rofix';
import requireg from 'requireg';
import { copyPaste, getContent } from '../clipboard';
import { isFunction, isString, isNumber } from 'util';

const argv = require('minimist')(process.argv.slice(2));

// scan for plugins and save for file for faster startup
if(argv.scan) {

}

// run a plugin directly
if(argv.plugin) {
    // run plugin entry directly
    if(argv.entry) {

    }  else {
        // show plugin menu
    }
}

// how to use this
const rofijs = new RofiJS();

rofijs.init(async function() {
    let rofi_settings = { p: ':', matching: 'normal' };
    let plugin_list = rofijs.plugins.map(p => p.name);

    try {
        let menu = new Menu(plugin_list, rofi_settings);
        let choice = argv.plugin || JSON.parse(await menu.open()).stdout;

        if (choice) {
            let plugin = rofijs.plugins.find(p => p.name === choice);
            let mod =
                plugin && plugin.packageName ? requireg(plugin.packageName) : false;
            if (mod) {
                mod.register(async (list: any[], settings: any) => {
                    let actions = list.map(script => script.name);
                    let action_menu = new Menu(actions, Object.assign({}, {
                        matching: 'normal'
                    }, settings));
                    let script = JSON.parse(await action_menu.open());

                    let action = list.find(a => a.name === script.stdout);
                    let func = action.run;

                    handleValueType(func);
                });
            }
        }
    } catch (err) {
        
    }
});

async function handleValueType(value: any) {
    let x = await getContent();

    if(typeof value === 'undefined') {
        return
    }

    if (isString(value) || isNumber(value)) {
        copyPaste(value);
        return;
    }

    if (isFunction(value)) {
        let result = value(x, (err: any, data: any) => {
            handleValueType(data);
        });

        handleValueType(result);
        return;
    }

    if (value instanceof Promise) {
        handleValueType(await value);
        return;
    }

    if (Array.isArray(value)) {
        copyPaste(JSON.stringify(value));
        return;
    }

    if (
        !isFunction(value) &&
        !isString(value) &&
        !isNumber(value) &&
        !(value instanceof Promise) &&
        !Array.isArray(value)
    ) {
        try {
            if(typeof value === 'object') {
                handleValueType(JSON.stringify(value).trim());
            } else {
                handleValueType(String(value).trim());
            }
        } catch (err) {}

        return;
    }
}
