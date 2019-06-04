import globalDirectories from 'global-dirs';
import fg from 'fast-glob';
import fs from 'fs-extra';
import requireg from 'requireg';

interface plugin {
    name: string;
    description: string;
    version: string;
    packageName: string[];
}

export const findPlugins = (cb: Function): void => {
    fg(globalDirectories.npm.packages + '/**/package.json', {
        deep: 1
    })
        .then(entries => {
            let plugins: plugin[] = [];

            for (let entry of entries) {
                const packageObj = fs.readJsonSync(String(entry));
                if (packageObj.rofiking) {
                    try {
                        let mod = requireg(packageObj.name);

                        plugins.push(Object.assign({}, mod.register.attributes, {
                            packageName: packageObj.name
                        }));
                    } catch (err) {
                        console.error(err);
                    }
                } 
            }

            cb(null, plugins);
        })
        .catch(err => {
            console.log(err)
            cb(err, []);
        });
};
