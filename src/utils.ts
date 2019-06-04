import commandExists from 'command-exists';

export function commandsExist (commands: string[]) {
    let promises = [];
    
    for(let command of commands) {
        promises.push(commandExists(command))
    }

    return promises;
}