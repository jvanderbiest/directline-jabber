var path = require('path');
var fs = require('fs');

export class FileSearcher {
    static recursive(folderPath: string, ext: Array<string>, includeSubfolders: boolean, files?: Array<string>, result?: Array<string>): Array<string> {
        result = result || new Array<string>();

        if (folderPath && fs.existsSync(folderPath)) {
            files = files || fs.readdirSync(folderPath);
            for (var i = 0; i < files.length; i++) {
                var newFolderPath = path.join(folderPath, files[i]);
                if (includeSubfolders && fs.statSync(newFolderPath).isDirectory()) {
                    result = this.recursive(newFolderPath, ext, includeSubfolders, fs.readdirSync(newFolderPath), result);
                }
                else {
                    var fileExtension = path.extname(files[i]);
                    if (ext && Array.isArray(ext) && ext.length > 0 && ext.find(x => fileExtension == x)) {
                        result.push(newFolderPath);
                    }
                }
            }
        }
        
        return result;
    }
}