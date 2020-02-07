# ioos-us
The homepage for http://ioos.us/

## Building the project

### Local Build

0. Download and install nodejs (which comes with npm) using your package manager
0. Install `yarn` using your package manager. Instructions can be found [here](https://legacy.yarnpkg.com/en/docs/install/).

0. Use `npm` to install `grunt`

```
$ npm install -g grunt
```

0. Use `yarn` to install the package and its dependencies:

```
$ yarn
```

0. Following a successful installation, use `grunt` to compile static elements.

```
$ grunt
```

0. To run the project:

```
$ DEBUG=ioos-us:*
$ node bin/www
```

### Docker build

The Docker build is far simpler:

```
$ docker build -t <tag> -f Dockerfile .
```

__NOTE__: ensure that `public/lib` is removed *before* building. If it exists,
`yarn` will attempt to use the existing one in the Docker build, breaking the symlink
in the container and lead to ugly CSS.
