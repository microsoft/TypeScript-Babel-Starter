import { exec } from 'child_process';
import { promisify } from 'util';
import clipboardy from 'clipboardy';
import { focusWindowById } from './utils';

const cli = promisify(exec);


// copy content to clipboard
export function copy(input:any = ''): void {
    if (typeof input !== 'string') {
        clipboardy.writeSync(JSON.stringify(input));
    } else {
        clipboardy.writeSync(input);
    }
}

// simulate ctrl+v keypress
export async function paste(): Promise<void> {
    try {
        cli('xdotool key ctrl+shift+v');
    } catch (err) {
        console.error(err);
        process.exit(2);
    }
}

// copy and paste content and restore previous clipboard
export async function copyPaste(content: any, windowId?: string | number): Promise<void> {
    let originalClipboard = clipboardy.readSync();

    if(windowId) {
        await focusWindowById(windowId);
    }
    
    copy(content);
    paste();

    // restore original clipboard content
    setTimeout(() => {
        copy(originalClipboard);
    }, 500);
}

export async function getContent(): Promise<string|undefined> {
    try {
        let content = (await cli('xclip -o')).stdout;

        return content;
    } catch (err) {
        console.error(err);

        process.exit(3)
    }
}