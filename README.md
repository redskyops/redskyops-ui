# Red Sky Ops - User Interface

The User Interface project (redskyops-ui) is a web application for visualizing experiment results from a remote Red Sky API server. Generally the web application is not deployed, but instead accessed locally on your workstation via `redskyctl`.


## Building

### Prerequisites

To build the application you must have a recent version of npm. To install the required Node.js modules run:

```sh
npm install
```

To generate the Go code (only required for releases) you must have a recent version of Go (1.12+) and the latest version of `vfsgendev`:

```sh
go get -u github.com/shurcooL/vfsgen/cmd/vfsgendev
```


### Building

This project is based on "Create React App", to generate an optimized production build in the `/build` directory run:

```sh
REACT_APP_BASE_FOLDER=/ui REDSKY_UI_SUBFOLDER=/ui npm run build
```


### Generating Go Code

This project uses [vfsgen](https://github.com/shurcooL/vfsgen) to generate Go code representing the contents of the `/build` directory. The `/ui/assets_vfsdata.go` file can be re-generated using:

```
go generate ./ui
```


## Development

### Start Development Server

#### Set required environment variables in the `.env` file

You need below environment variables to connect to Redsky backend server

```sh
REDSKY_ADDRESS={url-to-backend-server}
REDSKY_OAUTH2_CLIENT_ID={API-Key}
REDSKY_OAUTH2_CLIENT_SECRET={API-Secret}
```

You can make a copy of `.env.example` and rename it to `.env` and define these variables there.

In addition to the development server, you must run a local proxy to access the Red Sky Server:

```sh
node src/proxy.js
npm start
```

The application will then be available at: http://localhost:3000

## Building the frontend assets to run inside subfolder

If the app need to be hosted in subfolder like `http://some-domain.com/sub-folder` you need to set this environment variable when running `npm run build` to make the React app aware of that:

```sh
REACT_APP_BASE_FOLDER='/sub-folder'
```
**Please take note of the forward slash at the beginning**

## Simulate a production run of frontend assets using Docker and NGINX

As frontend assets will be served from sub folder in production server you can simulate the production setup by following steps:

1. You need a to define an environment variable `REDSKY_UI_SUBFOLDER` to set the folder name that will server the frontend from
   **Please take note of the forward slash at the beginning, this is important to keep when defining folder name**

   ```sh
   REDSKY_UI_SUBFOLDER='/sub-folder'
   ```

   You can define this in the `.env` file, also important to keep the other Red Sky API keys environment variables in `.env`

2. Run the following commands to source the environments vars

   ```sh
   set -a
   source ./.env
   ```

3. Boot up Docker containers

   ```sh
   docker-compose build
   docker-compose up
   ```

   For the first time these commands will take time to finish
   NGINX will bind to port 8080

4. You can access the frontend app on http://localhost:8080/sub-folder

5. If you want to change the folder you need to run the steps 2 and 3 again after you update the environment variable in `.env`

### Releasing

1. Run a clean build to ensure the latest code is in the build directory
2. Generate the `assets_vfsdata.go` file and commit to Git
3. Tag the repository and push

