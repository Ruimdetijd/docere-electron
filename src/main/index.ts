import { app, BrowserWindow } from 'electron'
import mainController from './controller'
import watcher from './watcher'

let win: BrowserWindow

function createWindow () {
	// Create the browser window.
	win = new BrowserWindow({
		width: 1400,
		// height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	})

	mainController.win = win
	watcher.win = win

	win.webContents.openDevTools()

	// and load the index.html of the app.
	win.loadFile('index.html')
}

app.on('ready', createWindow)

export { mainController }
