# Legiscape visualization

## Features

* [react](https://facebook.github.io/react) - as main library for building interfaces
* [redux](http://redux.js.org) - predictable state container for JavaScript apps
* [react-router](https://github.com/ReactTraining/react-router) - routing library for [React](https://facebook.github.io/react/)
* [axios](https://github.com/mzabriskie/axios) - promise based HTTP client
* [css-modules](https://github.com/css-modules/css-modules) - mudular styles with class names scoped locally
* [sass](http://sass-lang.com/) - grade CSS extension language
* [autoprefixer](https://github.com/postcss/autoprefixer) - use the data based on current browser popularity and property support to apply prefixes
* [classnames](https://github.com/JedWatson/classnames) - utility for conditionally joining classNames together

## Installation

```
git clone https://bitbucket.org/loomweaver/legiscape_visualization
cd legiscape_visualization
npm i
```

## Scripts

* `npm run dev` - start development process
* `npm run prod` - build production end files
* `npm run lint` - check all `.js` files for errors

## Development process

`npm run dev`

Running local development server on 3000 port.

#### Packages:

* [webpack](https://webpack.github.io) - application compiler with modules support
* [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) - development server based on [webpack](https://webpack.github.io)

#### Plugins:

* [babel-loader](https://babeljs.io) - JavaScript compiler(with [preset-react](https://babeljs.io/docs/plugins/preset-react) for JSX and [stage-0](https://babeljs.io/docs/plugins/preset-stage-0/) for ES next features)
* [eslint-loader](https://github.com/MoOx/eslint-loader) - JavaScript code pre-checker in webpack compilation process
* [react-hot-loader](https://www.npmjs.com/package/react-hot-loader) - tweak React components in real time

## Production

`npm run prod`

Compile end files to `dist` folder.

#### Packages:

* [webpack](https://webpack.github.io) - application compiler with modules support

#### Plugins:

* [uglify](https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin) - minimize all JavaScript output

## ESLint

`npm run lint`

Check project `.js` code.

#### Packages:

* [eslint](http://eslint.org) - JavaScript code checker

Also is supported in code editors. Check for specific code editor plugin.
