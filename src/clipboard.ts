import { exec } from 'child_process';
import { promisify } from 'util';
import clipboardy from 'clipboardy';

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
export function paste(): void {
    exec('xdotool key ctrl+shift+v');
}

// copy and paste content and restore previous clipboard
export function copyPaste(content: any): void {
    let originalClipboard = clipboardy.readSync();

    copy(content);
    paste();

    // restore original clipboard content
    setTimeout(() => {
        copy(originalClipboard);
    }, 500);
}

export async function getContent(): Promise<string> {
    return (await cli('xclip -o')).stdout
}