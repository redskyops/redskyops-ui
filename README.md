# Red Sky Ops - User Interface

The User Interface project (redskyops-ui) is a web application for visualizing experiment results from a remote Red Sky API server. Generally the web application is not deployed, but instead accessed locally on your workstation via `redskyctl`.


## Building

### Prerequisites

To build the application you must have a recent version of npm. To install the required Node.js modules run:

```
npm install
```

To generate the Go code (only required for releases) you must have a recent version of Go (1.12+) and the latest version of `vfsgendev`:

```
go get -u github.com/shurcooL/vfsgen/cmd/vfsgendev
```


### Building

This project is based on "Create React App", to generate an optimized production build in the `/build` directory run:

```
npm run build
```


### Generating Go Code

This project uses [vfsgen](https://github.com/shurcooL/vfsgen) to generate Go code representing the contents of the `/build` directory. The `/ui/assets_vfsdata.go` file can be re-generated using:

```
go generate ./ui
```


## Development

### Start Development Server

#### Set required environment variables in .env file

you need below environment variables to connect to Redsky backend server

REDSKY_ADDRESS={url-to-backend-server}

REDSKY_OAUTH2_CLIENT_ID={API-Key}

REDSKY_OAUTH2_CLIENT_SECRET={API-Secret}

you can make a copy of .env.example and rename it to .env and define these variable there

In addition to the development server, you must run a local proxy to access the Red Sky Server:

```
node src/proxy.js
npm start
```

The application will then be available at: http://localhost:3000


### Releasing

1. Run a clean build to ensure the latest code is in the build directory
2. Generate the `assets_vfsdata.go` file and commit to Git
3. Tag the repository and push

