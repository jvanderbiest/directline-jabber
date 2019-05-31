import { expect } from 'chai';
import * as sinon from 'sinon';
import { JabberActivity } from '../domain/jabberActivity';
import { FileInfo } from '../domain/fileInfo';
import { Activity } from 'chatdown';

var proxyquire = require('proxyquire');

describe('FileSearcher tests', () => {
	var pathStub: any = {};
	var fsStub: any = {};
	const baseFile = "c:\\folder\\file.chat";
	const baseFolder = "c:\\folder";

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
			var result = FileSearcher.recursive("c:\\", extensions, false);

			expect(fsStubSpy.called);
			expect(result.length == 1).to.be.true;
			expect(result[0]).equals("c:\\foo.bar");
		});

		it('should find files in subfolder', async () => {
			fsStub.existsSync = function () {
				return true;
			};

			fsStub.statSync = function (newFolderPath: string) {
				var isDirectory = false;
				if (newFolderPath == 'c:\\foo') {
					isDirectory = true;
				}
				return { isDirectory: function() { return isDirectory; } };
			}

			fsStub.readdirSync = function (folderPath : string) {
				var paths = new Array<string>();

				if (folderPath == 'c:\\') {
					paths.push("foo.bar");
					paths.push("foo");
				}
				if (folderPath == 'c:\\foo') {
					paths.push("foo2.bar");
				}

				return paths;
			}

			var fsStubSpy = sinon.spy(fsStub.readdirSync);
			var extensions = new Array<string>();
			extensions.push('.bar');
			var result = FileSearcher.recursive("c:\\", extensions, true);

			expect(fsStubSpy.called);
			expect(result.length == 2).to.be.true;
			expect(result[0]).equals("c:\\foo.bar");
			expect(result[1]).equals("c:\\foo\\foo2.bar");
		});
	});
});