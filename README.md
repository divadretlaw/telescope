# Telescope

![telescope](https://user-images.githubusercontent.com/6899256/109791714-07ae0500-7c13-11eb-88c8-bcfe21a238e1.png)

## Requirements

- Python 3.9
- [Node.js](https://nodejs.org)
- Angular/CLI: `npm install -g @angular/cli `

## Install

- Run `npm install`
- Run `pip3 install -r astrograph/requirements.txt`

## Run

### Electron app

Run `npm run electron` to launch the app as Electron app

### Debug

1. Run `npm run start:rocket` to launch the Python backend
2. Run `npm run start:telescope` to launch the Angular frontend

### Build

`Pyinstaller` is used to package the Python backend into the Electron Wrapper.

Run `npm run build:rocket` to build the Python binary.

- `npm run electron:mac` to build the Electron Mac App
- `npm run electron:windows` to build the Electron Windows App
- `npm run electron:linux` to build the Electron Linux App
