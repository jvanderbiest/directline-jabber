import { expect } from 'chai';
import * as sinon from 'sinon';

var proxyquire = require('proxyquire');

describe('FileSearcher tests', () => {
	var pathStub: any = {};
	var fsStub: any = {};

	describe('findFile', () => {
		const FileSearcher = proxyquire('../fileSearcher', { 'path': pathStub, 'fs': fsStub }).FileSearcher;

		it('should not find files if path does not exist', async () => {
			fsStub.existsSync = function () {
				return false;
			};

			var fsStubSpy = sinon.spy(fsStub.readdirSync);

			var result = FileSearcher.recursive("foo", null, false);

			expect(fsStubSpy.notCalled);
			expect(result.length == 0).to.be.true;
		});

		it('should not find files if path exists but no files with matching extension', async () => {
			fsStub.existsSync = function () {
				return true;
			};

			fsStub.readdirSync = function () {
				var paths = new Array<string>();
				paths.push("foo.bar");
				return paths;
			}

			var fsStubSpy = sinon.spy(fsStub.readdirSync);
			var extensions = new Array<string>();
			extensions.push('.bla');
			var result = FileSearcher.recursive("foo", extensions, false);

			expect(fsStubSpy.called);
			expect(result.length == 0).to.be.true;
		});

		it('should find files if file matches extension', async () => {
			fsStub.existsSync = function () {
				return true;
			};

			fsStub.readdirSync = function () {
				var paths = new Array<string>();
				paths.push("foo.bar");
				return paths;
			}

			var fsStubSpy = sinon.spy(fsStub.readdirSync);
			var extensions = new Array<string>();
			extensions.push('.bar');
			var result = FileSearcher.recursive("c:/", extensions, false);

			expect(fsStubSpy.called);
			expect(result.length == 1).to.be.true;

			console.log(result[0]);
			var hasmatch = result[0] == "c:\\foo.bar";
			if (!hasmatch) {
				// buildserver
				hasmatch = result[0] == 'c:/foo.bar';
			}
			expect(hasmatch).to.be.true;
		});

		it.only('should find files in subfolder', async () => {
			fsStub.existsSync = function () {
				return true;
			};

			fsStub.statSync = function (newFolderPath: string) {
				var isDirectory = false;
				console.log("newFolderPath " + newFolderPath);
				if (newFolderPath == 'c:\\foo' || newFolderPath == 'c:/foo') {
					isDirectory = true;
				}
				return { isDirectory: function() { return isDirectory; } };
			}

			fsStub.readdirSync = function (folderPath : string) {
				var paths = new Array<string>();

				console.log("folderpath " + folderPath);
				if (folderPath == 'c:\\' || folderPath == 'c:/') {
					paths.push("foo.bar");
					paths.push("foo");
				}
				if (folderPath == 'c:\\foo' || folderPath == 'c:/foo') {
					paths.push("foo2.bar");
				}

				return paths;
			}

			var fsStubSpy = sinon.spy(fsStub.readdirSync);
			var extensions = new Array<string>();
			extensions.push('.bar');
			var result = FileSearcher.recursive("c:/", extensions, true);

			expect(fsStubSpy.called);
			expect(result.length == 2).to.be.true;

			console.log('first result: ' + result[0]);
			var firstMatch = false;
			if (result[0] == "c:\\foo.bar" || result[0] == "c:/foo.bar") { firstMatch = true; }
			expect(firstMatch).to.be.true;

			console.log('second result: ' + result[1])
			var secondMatch = false;
			if (result[1] == "c:\\foo\\foo2.bar" || result[1] == "c:/foo/foo2.bar") { secondMatch = true; }
			expect(secondMatch).to.be.true;
		});
	});
});