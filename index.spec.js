import withLocalTmpDir from 'with-local-tmp-dir';
import fs from 'fs-extra';
import path from 'path';
import { expect } from 'expect';
import outputFiles from 'output-files';

import self from './index.js';

beforeEach(async function () {
    this.resetWithLocalTmpDir = await withLocalTmpDir()
})

afterEach(async function () {
    await this.resetWithLocalTmpDir()
})

describe('index', () => {
    it('no main', async () => {
        await fs.outputFile(path.join('node_modules', 'foo', 'package.json'), JSON.stringify({}));
        expect(self('foo')).toEqual(path.join(process.cwd(), 'node_modules', 'foo'));
    });

    it("doesn't export package.json", async () => {
        await outputFiles({
            'node_modules/foo': {
                'package.json': JSON.stringify({
                    type: 'module',
                    exports: './index.js',
                }),
                'index.js': '',
            },
        });
        expect(self('foo')).toEqual(path.join(process.cwd(), 'node_modules', 'foo'));
    });

    it('no arguments', async () => {
        await fs.outputFile('package.json', JSON.stringify({}));
        expect(self()).toEqual(process.cwd());
    });

    it('cwd', async () => {
        await fs.outputFile(path.join('sub', 'node_modules', 'foo', 'package.json'), JSON.stringify({}));
        expect(self('foo', { cwd: 'sub' })).toEqual(path.join(process.cwd(), 'sub', 'node_modules', 'foo'));
    });
});
