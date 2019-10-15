import * as chokidar from 'chokidar'
import { BrowserWindow } from 'electron';
import mainController from './controller';

class Watcher {
	watchers: Map<string, chokidar.FSWatcher> = new Map()
	win: BrowserWindow

	createWatcher(path: string) {
		if (this.watchers.has(path)) this.watchers.get(path).close()
		const watcher = chokidar.watch(path, { awaitWriteFinish: true })
		this.watchers.set(path, watcher)
		return watcher
	}

	watchComponents(path: string) {
		const watcher = this.createWatcher(path)
		watcher.on('change', this.handleComponentChange)
		watcher.on('unlink', this.handleComponentChange)
	}

	watchConfig(path: string) {
		const watcher = this.createWatcher(path)
		watcher.on('change', this.handleConfigChange)
		watcher.on('unlink', this.handleConfigChange)
	}

	watchFile(path: string) {
		const watcher = this.createWatcher(path)
		watcher.on('change', this.handleFileChange)
		watcher.on('unlink', this.handleFileChange)

	}

	private handleFileChange = () => {
		this.win.webContents.send('update:entry')
	}

	private handleComponentChange = async (path: string) => {
		await mainController.copyComponent(path)
		this.win.webContents.send('update:config', path)
	}

	private handleConfigChange = async (path: string) => {
		const fileName = await mainController.copyConfig(path)
		this.win.webContents.send('update:config', fileName)
	}
}

export default new Watcher()
