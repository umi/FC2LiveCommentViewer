const fs = require('fs')
const path = require('path')

exports.default = async function (context) {
	if (context.electronPlatformName !== 'linux') {
		return
	}

	const appOutDir = context.appOutDir
	const productName = context.packager.appInfo.productFilename || context.packager.appInfo.name || 'fc2live-comment'
	const originalBinary = path.join(appOutDir, productName)
	const renamedBinary = path.join(appOutDir, `${productName}.bin`)

	if (fs.existsSync(originalBinary)) {
		// Rename the original binary to .bin
		fs.renameSync(originalBinary, renamedBinary)

		// Create the wrapper shell script that passes --no-sandbox
		const wrapperScriptContent = `#!/bin/bash
exec "\$(dirname "\$0")/${productName}.bin" --no-sandbox "\$@"
`
		fs.writeFileSync(originalBinary, wrapperScriptContent, {
			encoding: 'utf8',
			mode: 0o755 // Make it executable (rwxr-xr-x)
		})

		console.log(`[afterPack] Successfully created shell wrapper for ${productName} to force --no-sandbox on Linux.`)
	}
}
