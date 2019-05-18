import path = require('path');

/** Holds information about the user files that where loaded in the app */
export class FileInfo {
    constructor(path: string) {
        this.path = path;
    }

    /**
     * Gets file name from full filepath
     */
    get name(): string {
        return path.basename(this.path);
    }

    /**
     * Full path of the file
     */
    path: string;

    /**
     * Retrieves folder of the current file
     * 
     * @return {string} The folder of the file
     */
    get folder() : string {
        return path.dirname(this.path);
    }
}