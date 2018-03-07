# TypeScript-Babel-Starter

**Note**: This quick start repository uses a pre-release version of Babel. While you should be aware that some of the dependencies here are in flux, feel free to try it out!

# What is this?

This is a small sample repository that uses Babel to transform TypeScript to plain JavaScript, and uses TypeScript for type-checking.
This README will also explain step-by-step how you can set up this repository so you can understand how each component fits together.

For simplicity, we've used `babel-cli` with a bare-bones TypeScript setup, but we'll also demonstrate integration with JSX/React, as well as adding Webpack into the mix.

# How do I use it?

## Building the repo

```sh
npm run build
```

## Type-checking the repo

```sh
npm run type-check
```

And to run in `--watch` mode:

```sh
npm run type-check -- --watch
```

# How would I set this up myself?

## Install your dependencies

Either run the following:

```sh
npm install --save-dev typescript@2.6.2
npm install --save-dev @babel/core@7.0.0-beta.32
npm install --save-dev @babel/cli@7.0.0-beta.32
npm install --save-dev @babel/plugin-proposal-class-properties@7.0.0-beta.32
npm install --save-dev @babel/plugin-proposal-object-rest-spread@7.0.0-beta.32
npm install --save-dev @babel/preset-env@7.0.0-beta.32
npm install --save-dev @babel/preset-typescript@7.0.0-beta.32
```

or make sure that you add the appropriate `"devDependencies"` entries to your `package.json` and run `npm install`:

```json
"devDependencies": {
    "@babel/cli": "^7.0.0-beta.32",
    "@babel/core": "^7.0.0-beta.32",
    "@babel/plugin-proposal-class-properties": "^7.0.0-beta.32",
    "@babel/plugin-proposal-object-rest-spread": "^7.0.0-beta.32",
    "@babel/preset-env": "^7.0.0-beta.32",
    "@babel/preset-typescript": "^7.0.0-beta.32",
    "typescript": "^2.6.2"
}
```

## Create your `tsconfig.json`

Then run

```sh
tsc --init --noEmit --allowJs --allowSyntheticDefaultImports --target esnext
```

## Create your `.babelrc`

Then copy the `.babelrc` in this repo, or the below:

```json
{
    "presets": [
        "@babel/env",
        "@babel/typescript"
    ],
    "plugins": [
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread"
    ]
}
```

## Set up your build tasks

Add the following to the `"scripts"` section of your `package.json`

```json
"scripts": {
    "build": "babel src --out-dir lib --extensions \".ts,.tsx\"",
    "type-check": "tsc"
}
```

# How do I change it?

## Using JSX (and React)

### Install your dependencies

Install the [@babel/preset-react](https://www.npmjs.com/package/@babel/preset-react) package as well as React, ReactDOM, and their respective type declarations

```sh
npm install --save react react-dom @types/react @types/react-dom
npm install --save-dev @babel/preset-react@7.0.0-beta.32
```

### Update `.babelrc`

Then add `"@babel/react"` as one of the presets in your `.babelrc`.

### Update `tsconfig.json`

Update your `tsconfig.json` to set `"jsx"` to `"react"`.

### Use a `.tsx` file

Make sure that any files that contain JSX use the `.tsx` extension.
To get going quickly, just rename `src/index.ts` to `src/index.tsx`, and add the following lines to the bottom:

```ts
import React from 'react';
export let z = <div>Hello world!</div>;
```

## Using Webpack

### Install your dependencies

```sh
npm install --save-dev webpack babel-loader@8.0.0-beta.0
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
