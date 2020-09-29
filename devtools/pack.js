const path = require('path')
const childProcess = require('child_process')
const { execSync } = childProcess

// cli({
//   mode: 'dev',
//   entry: '@mini',
//   output: path.join(__dirname, './__dev__'),
//   zip: false,
// })

console.log(path.join(__dirname, './__dev__'));
const a = execSync(`ma-cli -m build -e @mini -o ${path.join(__dirname, './__dev__')} --no-zip`, { encoding: 'utf-8' })
// const a = execSync(`ma-cli -V`, { encoding: 'utf-8' })
console.log(a);
