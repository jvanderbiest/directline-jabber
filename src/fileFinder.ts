var path = require('path');
var fs = require('fs');

export function findFile(base: string, ext: Array<string>, includeSubfolders: boolean, files?: Array<string>, result?: Array<string>) {
    if (fs.existsSync(base)) {
    files = files || fs.readdirSync(base);
    result = result || [];

    files.forEach(
        function (file) {
            var newbase = path.join(base, file);
            if (includeSubfolders && fs.statSync(newbase).isDirectory()) {
                result = findFile(newbase, ext, includeSubfolders, fs.readdirSync(newbase), result);
            }
            else {
                var fileExtension = path.extname(file);
                if (ext.find(x => fileExtension == x)) {
                    result.push(newbase);
                }
            }
        });
    }
    return result;
}