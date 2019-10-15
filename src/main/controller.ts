import { dialog, BrowserWindow } from 'electron'
import * as fs from 'fs-extra'
import * as path from 'path'
import { readDir } from './utils';
import watcher from './watcher'

// TODO add typings (ProjectFiles in types.d.ts)
class MainController {
	_baseDir: string
	get baseDir() { return this._baseDir }
	set baseDir(path: string) { this._baseDir = path }

	get pagesDir() { return path.resolve(this._baseDir, 'pages')}

	win: BrowserWindow

	async getProjectFiles(baseDir?: string) {
		if (baseDir == null) {
			const result = await dialog.showOpenDialog(this.win, {
				properties: ['openDirectory']
			})
			if (!result.filePaths.length) return
			baseDir = result.filePaths[0]
		}
		this.baseDir = baseDir

		const configDataDir = path.resolve(this.baseDir, 'build')
		const componentsDir = path.resolve(configDataDir, 'components')
		const entriesDir = path.resolve(this.baseDir, 'xml')
		// const pagesDir = path.resolve(this.baseDir, 'pages')

		const configDataDirents = readDir(configDataDir)
		const componentsDirents = readDir(componentsDir)
		const entriesDirents = readDir(entriesDir)
		const pagesDirents = readDir(this.pagesDir)

		// Make sure ./project and ./project/components exists and is empty
		await fs.emptyDir(this.getComponentsDir())

		// Prepare copy of config files
		const jsCopies = configDataDirents
			.filter(dirent => dirent.name.slice(-3) === '.js')
			.map(async (dirent) => await this.copyConfig(path.resolve(configDataDir, dirent.name)))

		// Prepare copy of component files
		const jsCopies2 = componentsDirents
			.filter(dirent => dirent.name.slice(-3) === '.js')
			.map(async (dirent) => await this.copyComponent(path.resolve(componentsDir, dirent.name)))

		watcher.watchConfig(`${configDataDir}/*.js`)
		watcher.watchComponents(`${componentsDir}/*.js`)

		// Handle copy
		await Promise.all(jsCopies.concat(jsCopies2))

		return {
			baseDir: this.baseDir,
			pages: pagesDirents.map(dirent => dirent.name),
			entries: entriesDirents.map(dirent => dirent.name),
			configFiles: configDataDirents
				.filter(dirent => dirent.isFile())
				.map(dirent => dirent.name)
				.filter(filename => filename.slice(-3) === '.js')
		}
	}

	private getProjectDir() {
		return path.resolve(process.cwd(), 'project')
	}

	private getComponentsDir() {
		return path.resolve(this.getProjectDir(), 'components')
	}

	/**
	 * Copy component js file from source to local components dir
	 */
	async copyComponent(sourcePath: string) {
		await fs.copy(sourcePath, path.resolve(this.getComponentsDir(), path.basename(sourcePath)))
	}

	/**
	 * Copy config js file from source to local project dir
	 */
	async copyConfig(sourcePath: string) {
		await fs.copy(sourcePath, path.resolve(this.getProjectDir(), path.basename(sourcePath)))
	}

	readFileContents(entryId: string) {
		const filePath = path.resolve(this.baseDir, 'xml', `${entryId}.xml`)
		watcher.watchFile(filePath)
		return fs.readFileSync(filePath, 'utf8')
	}

	readPage(relativeFilePath: string) {
		const filePath = path.resolve(this.pagesDir, relativeFilePath)
		console.log(this.pagesDir, relativeFilePath, filePath)
		watcher.watchFile(filePath)
		return fs.readFileSync(filePath, 'utf8')
	}
}

export default new MainController()
