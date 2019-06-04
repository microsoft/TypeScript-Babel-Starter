const axios = require('axios');

const actions = [{
    name: 'Hello World!',
    run: () => 'Hello World!'
},{
    name: 'Return text',
    run: 'Return text directly!'
},{
    name: 'Return boolean',
    run: true
},
{
    name: 'Return number',
    run: 3.14159265359
},
{
    name: 'Return date',
    run: new Date()
},{
    name: 'Return array',
    run: [1,2,3,4]
},{
    name: 'Return object',
    run: {
        name: '🙂Cool Jack'
    }
},
{
    name: 'Nested functions',
    run: function() {
        return function() {
            return function() {
                return 'Cool :)'
            }
        }
    }
},
{
    name: 'Return a promise',
    run: () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
               resolve({name: 'John'})
            }, 2000)
        })
    }
},
{
    name: 'Use callback',
    run: (x, cb) => {
        setTimeout(() => {
            cb(null, Date.now());
        }, 1000)
    }
},
{
    name: 'Reverse selected text',
    run: (x) => x.split('').reverse().join('')
},{
    name: 'Make HTTP request',
    run: (x, cb) => {
        axios.get('http://api.icndb.com/jokes/random')
            .then(({data}) => {
                cb(null, data.value.joke)
            })
            .catch(() => {})
    }
}]

actions.push({
    name: 'Whoot',
    run: 'Bow!'
})

module.exports = actions;