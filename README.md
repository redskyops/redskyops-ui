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

## Building the frontend assets to run inside subfolder

if the app need to be hosted in subfolder like http://some-domain.com/sub-folder you need to set this environment variable when running ```npum run build``` to make React app aware of that

```
REACT_APP_BASE_FOLDER='/sub-folder'
```
**Please take note of the forward slash at the beginning**

## Simulate a production run of frontend assets using Docker and NginX

As front assets will be served from sub folder in production server you can simulate the production setup by following steps

1. you need a to define an environment variable REDSKY_UI_SUBFOLDER to set the folder name that will server the frontend from<br>
**Please take note of the forward slash at the beginning, this is important to keep when defining folder name**<br>
```
REDSKY_UI_SUBFOLDER='/sub-folder'
```
you can define this in .env file, also important to keep the other Redsky api keys environment variables in .env

2. Run the following commands to source the environments vars<br>
```
set -a
source ./.env
```

3. Boot up Docker containers<br>

```
docker-compose build
docker-compose up
```
For the first time these commands will take time to finish<br>
NginX will bind to port 8080<br>

4. You can access the frontend app on http://localhost:8080/sub-folder

5. if you wan to change the folder you need to run the septs 2 and 3 again after you update the environment variable in .env

### Releasing

1. Run a clean build to ensure the latest code is in the build directory
2. Generate the `assets_vfsdata.go` file and commit to Git
3. Tag the repository and push

