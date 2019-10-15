import * as React from 'react'
import { remote } from 'electron'
const mainProcess = remote.require('../main')
import styled from '@emotion/styled'

const Wrapper = styled.div`
	display: grid;
	display: grid;
	grid-template-columns: auto 640px auto;
	grid-template-rows: 1fr 3fr 3fr 3fr;
	height: 100vh;

	& > button {
		grid-column: 2;
	}

	& > div {
		display: grid;
		grid-column: 2;
		grid-template-rows: 32px auto;
		min-height: 10%;

		& > h2 {
			margin: 0;
		}

		& > ul {
			overflow-y: auto;
			margin: 0;
		}
	}
`

export default class FileExplorer extends React.PureComponent<FileExplorerProps, ProjectFiles> {
	async componentDidMount() {
		this.restoreState()
	}

	state: ProjectFiles = {
		baseDir: null,
		configFiles: [],
		entries: [],
		pages: [],
	}

	render() {
		return (
			<Wrapper>
				<button onClick={this.handleButtonClick}>Open project dir</button>
				<div>
					<h2>Entries</h2>
					<ul>
						{
							this.state.entries.map(entry =>
								<li
									key={entry}
									onClick={() => this.handleEntryClick(entry)}
								>
									{entry}
								</li>)
						}
					</ul>
				</div>
				<div>
					<h2>Pages</h2>
					<ul>
						{
							this.state.pages.map(page => <li key={page}>{page}</li>)
						}
					</ul>
				</div>

				<div>
					<h2>Config files</h2>
					<ul>
						{
							this.state.configFiles.map(file => <li key={file}>{file}</li>)
						}
					</ul>
				</div>
			</Wrapper>
		)
	}

	private handleButtonClick = async () => {
		const projectFiles: ProjectFiles = await mainProcess.mainController.getProjectFiles()
		this.updateState(projectFiles)
	}

	private handleEntryClick(filename: string) {
		this.props.setEntry(filename.slice(0, -4))
	}

	private updateState(nextState: any) {
		this.setState(nextState, () => {
			localStorage.setItem('docere:electron:explorer:state', JSON.stringify(this.state))
		})
	}

	private async restoreState() {
		const storedState = localStorage.getItem('docere:electron:explorer:state')
		if (storedState) {
			const nextState = JSON.parse(storedState)
			this.setState(nextState)
			mainProcess.mainController.getProjectFiles(nextState.baseDir)
		}
	}
}
