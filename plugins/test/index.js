const actions = require('./actions')

let Plugin = {};

let settings = {
    columns: 3,
    p: 'Pick & Choose:'
}

Plugin.register = (done) => {
    done(actions, settings);
}

Plugin.register.attributes = {
    name: "Test plugin",
    description: "An example/test plugin for RofiKing",
    version: "0.0.1"
}

module.exports = Plugin;