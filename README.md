# What is this?

This is a small sample repository that uses Babel to transform TypeScript to plain JavaScript, and uses TypeScript for type-checking.
For simplicity, it uses `babel-cli`.

# How do I use it?

## Building the repo

```sh
npm run build
```

## Type-checking the repo

```sh
npm run type-check
```

# How would I set this up myself?

## Install your dependencies

```sh
npm install --save-dev typescript@2.6.2
npm install --save-dev @babel/core@7.0.0-beta.32
npm install --save-dev @babel/cli@7.0.0-beta.32
npm install --save-dev @babel/plugin-proposal-class-properties@7.0.0-beta.32
npm install --save-dev @babel/plugin-proposal-object-rest-spread@7.0.0-beta.32
npm install --save-dev @babel/preset-env@7.0.0-beta.32
npm install --save-dev @babel/preset-typescript@7.0.0-beta.32
```

## Create your `tsconfig.json`

Then run

```sh
tsc --init --noEmit --target esnext --allowSyntheticDefaultImports
```

## Create your `.babelrc`

Then copy the `.babelrc`.

# How do I change it?

## Using JSX (and React)

### Install your dependencies

Install the [babel-react-preset](https://babeljs.io/docs/plugins/preset-react/) package as well as React, ReactDOM, and their respective type declarations

```sh
npm install --save react react-dom @types/react @types/react-dom
npm install --save-dev @babel/preset-react@7.0.0-beta.32
```

### Update `.babelrc`

Then add `"react"` as one of the presets in your `.babelrc`.

### Update `tsconfig.json`

Update your `tsconfig.json` to set `"jsx"` to `"react"`.

### Use a `.tsx` file

Make sure that any files that contain JSX use the `.tsx` extension.
To get going quickly, just rename `src/index.ts` to `src/index.tsx`, and add the following line to the bottom:

```ts
export let z = <div>Hello world!</div>;
```

## Mixing `.js` and `.ts`

Set the `"allowJs"` compiler option to `true` in `tsconfig.json`.

## Using Webpack

### Install your dependencies

```sh
npm install --save-dev babel-loader
```

### Create a `webpack.config.js`

Create a `webpack.config.js` at the root of this project with the following contents:

```js
var path = require('path');

module.exports = {
    // Change to your "entry-point".
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            // Include ts, tsx, and js files.
            test: /\.(tsx?)|(js)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    }
};
```

### Create a build task

Add

```json
"bundle": "webpack"
```

to the `scripts` section in your `package.json`.

### Run the build task

```
npm run bundle
```