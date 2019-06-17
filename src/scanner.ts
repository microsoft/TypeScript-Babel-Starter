import globalDirectories from 'global-dirs';
import fg from 'fast-glob';
import fs from 'fs-extra';
import requireg from 'requireg';
import colors from 'colors';

interface plugin {
    name: string;
    description: string;
    version: string;
    packageName: string[];
}

const unique = (value: any, index: number, self: any) => {
    return self.indexOf(value) === index;
};

async function findPlugins(entries: string[]): Promise<plugin[]> {
    let plugins: plugin[] = [];

    for (let entry of entries) {
        const packageObj = fs.readJsonSync(String(entry));
        if (packageObj.rofiking) {
            try {
                console.log(`${packageObj.name}@${colors.green(packageObj.version)}`);
                let mod = requireg(packageObj.name);

                plugins.push(
                    Object.assign({}, mod.register.attributes, {
                        packageName: packageObj.name
                    })
                );
            } catch (err) {
                console.log(colors.red('Error loading: ' + packageObj.name));
            }
        }
    }

    return plugins;
}

async function getInstalledPlugins() {
    let npmPlugins = await findPlugins(await getNpmEntries());
    let yarnPlugins = await findPlugins(await getYarnEntires());

    return npmPlugins.concat(yarnPlugins).filter(unique);
}

async function getNpmEntries() {
    let glob = globalDirectories.npm.packages + '/**/package.json';
    let entries: string[] = await fg(glob, { deep: 1 });

    return entries;
}

async function getYarnEntires() {
    let glob = globalDirectories.yarn.packages + '/**/package.json';
    let entries: string[] = await fg(glob, { deep: 1 });

    return entries;
}

export const getPlugins = async (cb: Function): Promise<void> => {
    let plugins = await getInstalledPlugins();
    cb(null, plugins);
};
