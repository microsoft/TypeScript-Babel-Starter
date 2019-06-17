import commandExists from 'command-exists';
import kindOf from 'kind-of';
import { copyPaste, getContent } from './clipboard';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createBrotliCompress } from 'zlib';
import { doesNotReject } from 'assert';

const cli = promisify(exec);

async function getActiveWindowId(): Promise<number | string> {
    try {
        let { stdout } = await cli('xdotool getactivewindow');

        return stdout.trim();
    } catch (err) {
        console.error(err.message);
        return '';
    } 
}

async function focusWindowById(id: string | number): Promise<void> {
    try {
        // TODO: make safe
        await cli(`xdotool windowactivate ${id}`);
    } catch (err) {
        console.error(err.message);
    } 
}

function commandsExist (commands: string[]) {
    let promises = [];
    
    for(let command of commands) {
        promises.push(commandExists(command))
    }

    return promises;
}

async function handleValueType(value: any, done: (value: any) => Promise<any>) {
    let kind = kindOf(value);

    let x = await getContent();

    // paste only strings, numbers and booleans
    if (~['string', 'number', 'boolean'].indexOf(kind)) {
        return done(value);
    }

    if(kind === 'undefined') {
        return ''
    }

    if(kind === 'map') {
        handleValueType(value.entries(), handleValueType);
        return;
    }

    if(kind === 'mapiterator') {
        handleValueType(Array.from(value), handleValueType);
        return;
    }

    if (value instanceof Promise) {
        handleValueType(await value, handleValueType);
        return;
    }

    if (kind === 'function') {
        let result = value(x, (err: any, data: any) => {
            handleValueType(data, handleValueType);
        });

        handleValueType(result, handleValueType);
        return;
    }

    if (kind === 'array') {
        copyPaste(JSON.stringify(value));
        return;
    }

    if(kind === 'error') {
        // handle error
        // TODO: add entry in config to handle this;
    }

    if(kind === 'object') {
        handleValueType(JSON.stringify(value).trim(), handleValueType);
        return
    }

    // otherwise turn to string
    handleValueType(String(value).trim(), handleValueType);
}

export {
    getActiveWindowId,
    focusWindowById,
    commandsExist,
    handleValueType
}