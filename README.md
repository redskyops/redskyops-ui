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

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
