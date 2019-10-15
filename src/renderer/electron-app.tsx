import { App } from "docere"
import { remote, ipcRenderer } from 'electron'
import restoreState from './restore-state';
const mainProcess = remote.require('../main')

export default class ElectronApp extends App {
	constructor(props: any) {
		super(props)
		ipcRenderer.on('update:entry', async () => {
			this.setEntry(this.state.entry.id)
		})
		ipcRenderer.on('update:config', async (_event, configFilename) => {
			const nextState = await restoreState(configFilename)
			this.setState(nextState)
		})
	}

	protected async getEntryDoc(id: string) {
		const domParser = new DOMParser()
		const xml = mainProcess.mainController.readFileContents(id)
		return domParser.parseFromString(xml, 'application/xml')
	}

	protected async getPageDoc(page: Page) {
		const domParser = new DOMParser()
		const xml = mainProcess.mainController.readPage(page.path)
		return domParser.parseFromString(xml, 'application/xml')
	}
}
