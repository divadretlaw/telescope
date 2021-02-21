const {app, BrowserWindow} = require('electron');

const path = require("path");

// let { isPackaged } = require('electron-is-packaged').isPackaged;

let mainWindow;

let {PythonShell} = require('python-shell');
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
    // mainWindow.loadURL(url.format({   pathname: path.join(__dirname,
    // 'dist/index.html'),   protocol: 'file:',   slashes: true })); Open the
    // DevTools. mainWindow.webContents.openDevTools()

    const rootPath = app
        .getAppPath()
        .replace('app.asar', 'app.asar.unpacked')

    if (!rocketLaunched) {
        PythonShell.run('rocket.py', {
            scriptPath: path.join(rootPath, 'astrograph')
        }, function (error) {
            if (error) {
                console.error(error);
            }
            console.log('rocket.py landed.');
            rocketLaunched = false;
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