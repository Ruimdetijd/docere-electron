import * as fs from 'fs-extra'

export function readDir(path: string): fs.Dirent[] {
	let dirents: fs.Dirent[] = []

	try {
		dirents = fs.readdirSync(path, { withFileTypes: true })
	} catch (err) {
		console.warn('Dir not found! ', path)	
	}

	return dirents
}
