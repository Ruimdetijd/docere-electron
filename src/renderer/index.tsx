import { ipcRenderer } from 'electron';
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { wrapAsFileExplorer } from 'docere'
import FileExplorer from './file-explorer'
import ElectronApp from './electron-app'
import restoreState from './restore-state'

document.addEventListener('DOMContentLoaded', async function() {
	let state = await restoreState()
	ipcRenderer.send('init')
	ReactDOM.render(
		<ElectronApp
			configData={state.configData}
			entryId={null}
			pageId={null}
			EntrySelector={wrapAsFileExplorer(FileExplorer)}
		/>,
		document.getElementById('container')
	)
})
