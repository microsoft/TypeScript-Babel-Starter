# TypeScript-Babel-Starter

# What is this?

This is a small sample repository that uses Babel to transform TypeScript to plain JavaScript, and uses TypeScript for type-checking.
This README will also explain step-by-step how you can set up this repository so you can understand how each component fits together.

For simplicity, we've used `babel-cli` with a bare-bones TypeScript setup, but we'll also demonstrate integration with JSX/React, as well as adding bundlers into the mix.
Specifically, we'll show off integration with Webpack for if you're deploying an application, and Rollup for if you're producing a library.

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
npm run type-check:watch
```

# How would I set this up myself?

## Install your dependencies

Either run the following:

```sh
npm install --save-dev typescript @babel/core @babel/cli @babel/plugin-proposal-class-properties @babel/preset-env @babel/preset-typescript
```

or make sure that you add the appropriate `"devDependencies"` entries to your `package.json` and run `npm install`:

```json
"devDependencies": {
    "@babel/cli": "^7.8.3",
    "@babel/core": "^7.8.3",
    "@babel/plugin-proposal-class-properties": "^7.8.3",
    "@babel/preset-env": "^7.8.3",
    "@babel/preset-typescript": "^7.8.3",
    "typescript": "^3.7.5"
}
```

## Create your `tsconfig.json`

Then run

```sh
tsc --init --declaration --allowSyntheticDefaultImports --target esnext --outDir lib
```

**Note:** TypeScript also provides a `--declarationDir` option which specifies an output directory for generated declaration files (`.d.ts` files).
For our uses where `--emitDeclarationOnly` is turned on, `--outDir` works equivalently.

## Create your `.babelrc`

Then copy the `.babelrc` in this repo, or the below:

```json
{
    "presets": [
      "@babel/preset-env",
      "@babel/preset-typescript"
    ],
    "plugins": [
      "@babel/plugin-proposal-class-properties"
    ]
}
```

## Set up your build tasks

Add the following to the `"scripts"` section of your `package.json`

```json
"scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "npm run type-check -- --watch",
    "build": "npm run build:types && npm run build:js",
    "build:types": "tsc --emitDeclarationOnly",
    "build:js": "babel src --out-dir lib --extensions \".ts,.tsx\" --source-maps inline"
}
```

# How do I change it?

## Using JSX (and React)
> Full example available [**here**](https://github.com/a-tarasyuk/react-webpack-typescript-babel)

### Install your dependencies

Install the [@babel/preset-react](https://www.npmjs.com/package/@babel/preset-react) package as well as React, ReactDOM, and their respective type declarations

```sh
npm install --save react react-dom @types/react @types/react-dom
npm install --save-dev @babel/preset-react
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

> Full example available [**here**](https://github.com/a-tarasyuk/webpack-typescript-babel)

### Install your dependencies

```sh
npm install --save-dev webpack webpack-cli babel-loader
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
            // Include ts, tsx, js, and jsx files.
            test: /\.(ts|js)x?$/,
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

```sh
npm run bundle
```

## Using Rollup

> Full example available [**here**](https://github.com/a-tarasyuk/rollup-typescript-babel)

### Install your dependencies

```sh
npm install --save-dev rollup @rollup/plugin-babel @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

### Create a `rollup.config.js`

Create a `rollup.config.js` at the root of this project with the following contents:

```js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const name = 'RollupTypeScriptBabel';

export default {
  input: './src/index.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({ extensions, include: ['src/**/*'] }),
  ],

  output: [{
    file: pkg.main,
    format: 'cjs',
  }, {
    file: pkg.module,
    format: 'es',
  }, {
    file: pkg.browser,
    format: 'iife',
    name,

    // https://rollupjs.org/guide/en#output-globals-g-globals
    globals: {},
  }],
};

```

### Create a build task

Add

```json
"bundle": "rollup -c"
```

to the `scripts` section in your `package.json`.

### Run the build task

```sh
npm run bundle
```

## Using NodeJS

> Full example available [**here**](https://github.com/it-efrem/NodeJS-TypeScript-Babel)

### Install your dependencies

```sh
npm install --save-dev @babel/core @babel/node @babel/plugin-proposal-class-properties @babel/preset-env @babel/preset-typescript typescript
```

### Create a start task

Add

```json
"start": "babel-node -x \".ts\" src/index.ts"
```

to the `scripts` section in your `package.json`.

### Run the start task

```sh
npm run start
```


### Pull changes from this starter kit into your project

If you are starting a new project:
```
git clone git@github.com:microsoft/TypeScript-Babel-Starter.git my-app
cd my-app
git remote rename origin TypeScript-Babel-Starter
git remote add origin git@github.com:your-company/your-project.git
git pull TypeScript-Babel-Starter master
```

If you have an existing project, you'll need for force merge unrelated histories. (untested)
```
git remote add TypeScript-Babel-Starter git@github.com:microsoft/TypeScript-Babel-Starter.git
git fetch TypeScript-Babel-Starter
git checkout -b TypeScript-Babel-Starter TypeScript-Babel-Starter/master
git merge TypeScript-Babel-Starter --allow-unrelated-histories
```
