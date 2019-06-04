import { findPlugins } from './scanner';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

interface plugin {
    name: string;
    description: string;
    version: string;
    packageName: string[];
}

function initConfigFiles() {
    let configFolderPath = path.join(os.homedir(), '.config/rofiking');
    return fs.ensureDir(configFolderPath);
}

export class RofiJS {
    plugins: plugin[] = [];

    private findPlugins(cb: Function) {
        findPlugins((err: any, plugins: plugin[]) => {
            this.plugins = plugins;
            let pluginListFilePath = path.join(
                os.homedir(),
                '.config/rofiking/plugins.json'
            );
            let pluginTextFilePath = path.join(
                os.homedir(),
                '.config/rofiking/plugins.txt'
            );
            fs.writeFileSync(
                pluginListFilePath,
                JSON.stringify(plugins, null, 2)
            );

            // function txt list
            let list = [];
            for (let plugin of plugins) {
                list.push(
                    `${plugin.name} <span lang="@/${
                        plugin.name
                    }">@/basic</span>`
                );
            }

            fs.writeFileSync(pluginTextFilePath, list.join('\n'));

            cb.bind(this)();
        });
    }

    async init(cb: Function) {
        let userHomeFolder = os.homedir();
        let configFile = path.join(
            userHomeFolder,
            '.config/rofiking/config.js'
        );
        let configFileExists = fs.pathExistsSync(configFile);

        if (!configFileExists) {
            await initConfigFiles();
        }

        this.findPlugins(cb);
    }
}