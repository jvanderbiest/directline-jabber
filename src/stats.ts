import * as chalk from 'chalk';
import { FileInfo } from './domain/fileInfo';

/** Collects test statistics */
export class Stats {
    totalTests: number;
    passes: number;
    failures: number;
    hrstart: [number, number];
    totalRuntime: [number, number] = [0, 0];

    constructor(totalTests: number) {
        this.passes = 0;
        this.failures = 0;
        this.totalTests = totalTests;

        console.log('\n');
        console.log('  ', chalk.default.yellow(`running ${this.totalTests} test(s) `));
    }

    beginTest() {
        this.hrstart = process.hrtime();
    }

    endTest(fileInfo: FileInfo, stackTrace: string) {
        if (!this.hrstart) {
            throw Error("There is no running test timer.");
        }

        var runTime = process.hrtime(this.hrstart);
        this.totalRuntime = this.hrtimeAdd(this.totalRuntime, runTime);

        if (stackTrace) {
            this.failures++;
        }
        else {
            this.passes++;
        }

        this.testToString(fileInfo, stackTrace, runTime);

        if (this.totalTests == this.failures+this.passes) {
            this.suiteToString(this.totalRuntime);
        }
    }

    _lastFilePath: string;

    private testToString(fileInfo: FileInfo, stackTrace: string, runTime: [number, number]): void {
        if (fileInfo.folder != this._lastFilePath) {
            console.log('    ', chalk.default.gray(`${fileInfo.folder}`));
        }
        this._lastFilePath = fileInfo.folder;

        if (stackTrace) {
            console.log('       ', chalk.default.red('✖ ') + chalk.default.gray(`${fileInfo.name} (${this.format(runTime)})`));
        }
        else {
            console.log('       ', chalk.default.green('√ ') + chalk.default.gray(`${fileInfo.name} (${this.format(runTime)})`));
        }
    }

    private suiteToString(totalRuntime: [number, number]): void {
        var timeOutput = chalk.default.gray(`(${this.format(totalRuntime)})`);
        var failureOutput = '';

        if (this.failures > 0) {
            failureOutput = chalk.default.red(`${this.failures} failing  `)
        }

        console.log('\n');
        console.log('  ', failureOutput + chalk.default.green(`${this.passes} passing `) + timeOutput);
        console.log('\n');
    }

    private format(hr: [number, number]) {
        var milliseconds = Math.ceil(hr[1] / 1000000);
        return `${hr[0]}.${milliseconds}s`;
    }

    /*
 * Add two hrtime readings A and B, overwriting A with the result of the
 * addition.  This function is useful for accumulating several hrtime intervals
 * into a counter.  Returns A.
 */
    hrtimeAccum(a: [number, number], b: [number, number]) {

        /*
       * Accumulate the nanosecond component.
       */
        a[1] += b[1];
        if (a[1] >= 1e9) {
            /*
             * The nanosecond component overflowed, so carry to the seconds
             * field.
             */
            a[0]++;
            a[1] -= 1e9;
        }

        /*
       * Accumulate the seconds component.
       */
        a[0] += b[0];

        return (a);
    }

    /*
    * Add two hrtime readings A and B, returning the result as a new hrtime array.
    * Does not modify either input argument.
    */
    hrtimeAdd(a: [number, number], b: [number, number]) {
        var rv: [number, number] = [a[0], a[1]];

        return (this.hrtimeAccum(rv, b));
    }
}