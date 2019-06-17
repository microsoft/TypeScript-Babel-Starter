const to = require('to-case');

let Plugin = {};
let actions = [];

let settings = {
    columns: 3,
    width: 20,
    lines: 5,
    p: ':'
}

for(let func of Object.keys(to)) {
    actions.push({ name: func, run: to[func] });
}

Plugin.register = (done) => {
    done(actions, settings);
}

Plugin.register.attributes = {
    name: "Case",
    description: "Change case of text",
    version: "0.0.1"
}

module.exports = Plugin;

