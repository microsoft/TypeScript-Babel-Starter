const axios = require('axios');

const actions = [
    {
        'name': 'map',
        run: () => new Map([[ 1, 'one' ],[ 2, 'two' ]])
    },
    {
        name: 'symbol',
        run: () => Symbol('str')
    },
    {
        name: 'error',
        run: () => new Error('Something went wrong')
    },
    {
        name: 'regex',
        run: () => new RegExp('foo')
    },
    {
        name: 'text',
        run: 'Return text directly!'
    },
    {
        name: 'boolean',
        run: true
    },
    {
        name: 'number',
        run: 3.14159265359
    },
    {
        name: 'date',
        run: new Date()
    },
    {
        name: 'array',
        run: [1, 2, 3, 4]
    },
    {
        name: 'object',
        run: {
            name: '🙂 Cool Jack'
        }
    },
    {
        name: 'nested functions',
        run: function() {
            return function() {
                return function() {
                    return 'Cool :)';
                };
            };
        }
    },
    {
        name: 'promise',
        run: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({ name: 'John' });
                }, 2000);
            });
        }
    },
    {
        name: 'callback',
        run: (x, cb) => {
            setTimeout(() => {
                cb(null, Date.now());
            }, 1000);
        }
    },
    {
        name: 'modify xclipboard',
        run: x =>
            x
                .split('')
                .reverse()
                .join('')
    },
    {
        name: 'Paste content from HTTP request',
        run: (x, cb) => {
            axios
                .get('http://api.icndb.com/jokes/random')
                .then(({ data }) => {
                    cb(null, data.value.joke);
                })
                .catch(() => {});
        }
    }
];

module.exports = actions;
