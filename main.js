const {app, BrowserWindow} = require('electron');

const path = require("path");
const spawn = require('child_process').spawn;
// let { isPackaged } = require('electron-is-packaged').isPackaged;

let mainWindow;

let rocketLaunched = false;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        darkTheme: true,
        webPreferences: {
            nodeIntegration: false
        }
    })

    mainWindow.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);
    // DevTools. mainWindow.webContents.openDevTools()

    const rootPath = app.getAppPath().replace('app.asar', '')
    const resourcesPath = path.join(rootPath, 'resources');

    if (!rocketLaunched) {
        console.log('rootPath', resourcesPath);
        rocket = spawn(path.join(resourcesPath, 'rocket/rocket'));
        rocket.stdout.on( 'data', data => {
            console.log(`rocket: ${data}`);
        });
        rocket.stderr.on( 'data', data => {
            console.error(`rocket: ${data}`);
        });
        rocketLaunched = true;
    }

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') 
        app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) 
        createWindow()
})

app.on('before-quit', function () {
    if (rocket !== undefined) {
        rocket.kill();
    }
});