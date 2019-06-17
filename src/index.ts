import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import requireg from 'requireg';
import { Menu } from 'rofix';
import { getPlugins } from './scanner';
import { handleValueType, getActiveWindowId } from './utils';
import { copyPaste } from './clipboard';

interface plugin {
    name: string;
    description: string;
    version: string;
    packageName: string[];
}

let pluginListFilePath = path.join(
    os.homedir(),
    '.config/rofiking/plugins.json'
);

let pluginTextFilePath = path.join(
    os.homedir(),
    '.config/rofiking/plugins.txt'
);

function initConfigFiles() {
    let configFolderPath = path.join(os.homedir(), '.config/rofiking');
    return fs.ensureDir(configFolderPath);
}

export class RofiJS {
    originalWindowId?: any;
    plugins: plugin[] = [];

    scanPlugins(cb: Function) {
        getPlugins((err: any, plugins: plugin[]) => {
            this.plugins = plugins.sort();

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

    async loadPlugin(name: any){
        let windowId = this.originalWindowId;
        if (name && name.packageName) {
            try {
                let plugin = requireg(name.packageName);

                plugin.register(async (list: any[], settings: any) => {

                    let actions = list.map(script => script.name);
                    let action_menu = new Menu(actions, Object.assign({}, {
                        matching: 'normal'
                    }, settings));
    
                    let script = JSON.parse(await action_menu.open());
                    let action = list.find(a => a.name.trim() === script.stdout.trim());
    
                    if(action && action.run) {
                        handleValueType(action.run, function(value: string | number | boolean) {
                            console.log('done')
                            copyPaste(value, windowId);
                        });
                    }
                });
            } catch (err) {
                console.error(err);
            }
        }
    }

    async open(plugin?: string){
        let pl: plugin[] = JSON.parse(fs.readFileSync(pluginListFilePath, 'utf-8'));
        let rofi_settings = { p: ':', matching: 'normal', width: 20 };
        let plugin_list = pl.map(p => p.name);

        this.originalWindowId = await getActiveWindowId();

        try {

            let choice : string;

            if(plugin) {
                choice = plugin;
            } else {
                let menu = new Menu(plugin_list, rofi_settings);
                choice = JSON.parse(await menu.open()).stdout;
            }

            if (choice) {
                let pluginMatch = pl.find(p => p.name === choice);
                await this.loadPlugin(pluginMatch);
            }
        } catch (err) {
            
        }
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

        this.scanPlugins(cb);
    }
}