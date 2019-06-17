import commandExists from 'command-exists';
import kindOf from 'kind-of';
import { copyPaste, getContent } from './clipboard';
import { exec } from 'child_process';
import { promisify } from 'util';

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

async function handleValueType(value: any, done?: any) {
    let kind = kindOf(value);

    let x = await getContent();

    // paste only strings, numbers and booleans
    if (~['string', 'number', 'boolean'].indexOf(kind)) {
        if(kindOf(done) === 'function') {
            return done(value)
        };
    }

    if(kind === 'undefined') {
        return ''
    }

    if(kind === 'map') {
        handleValueType(value.entries(), done);
        return;
    }

    if(kind === 'mapiterator') {
        handleValueType(Array.from(value), done);
        return;
    }

    if (value instanceof Promise) {
        handleValueType(await value, done);
        return;
    }

    if (kind === 'function') {
        let result = value(x, (err: any, data: any) => {
            handleValueType(data, done);
        });

        handleValueType(result, done);
        return;
    }

    if (kind === 'array') {
        copyPaste(JSON.stringify(value));
        return;
    }

    if(kind === 'object') {
        handleValueType(JSON.stringify(value).trim(), done);
        return
    }

    // otherwise turn to string
    handleValueType(String(value).trim(), done);
}

export {
    getActiveWindowId,
    focusWindowById,
    commandsExist,
    handleValueType
}