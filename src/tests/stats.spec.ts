import { expect } from 'chai';
import { Stats } from '../stats';
import { FileInfo } from '../domain/fileInfo';

describe('Stats tests', () => {
	var sut: Stats;

	beforeEach(async () => {
		sut = new Stats(1);
	});

	describe('begin and end', () => {
		it('should throw when you end before begin', async () => {
			expect(sut.endTest.bind(sut, null, null)).to.throw(Error, `There is no running test timer.`);
		});

		it('should increase failures in case of error', async () => {
			sut.beginTest();

			expect(sut.failures).equals(0);

			var fileInfo = new FileInfo("c:\\foo");
			sut.endTest(fileInfo, "a test stack trace: ...");

			expect(sut.failures).equals(1);
		});
	});
});