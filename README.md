# Red Sky Ops - User Interface

The User Interface project (redskyops-ui) is a web application for visualizing experiment results from a remote Red Sky API server. Generally the web application is not deployed, but instead accessed locally on your workstation via `redskyctl`.


## Building

### Prerequisites

To generate the Go code (only required for releases) you must have a recent version of Go (1.12+) and the latest version of `vfsgendev`:

```
go get -u github.com/shurcooL/vfsgen/cmd/vfsgendev
```

### Building Static Assets

Right now running `./build.sh` just copies the contents of the `/public` directory.

### Generating Go Code

This project uses [vfsgen](https://github.com/shurcooL/vfsgen) to generate Go code representing the contents of the `/build` directory. The `/ui/assets_vfsdata.go` file can be re-generated using:

```
go generate ./ui
```


## Releasing

1. Run a clean build to ensure the latest code is in the build directory
2. Generate the `assets_vfsdata.go` file and commit to Git
3. Tag the repository and push


# Red Sky Frontend

the UI application is based on "Create React App". You need to install Node modules before starting the application by running

```
npm install
```

## Starting the application for development

for intergration with Redsky backend you need to run a local proxy before running the dev server

```
node proxy.js
npm start
```
then you can browse the app http://localhost:3000

## Building the UI app assets

```
npm run build
```
