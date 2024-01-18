import withLocalTmpDir from 'with-local-tmp-dir';
import fs from 'fs-extra';
import path from 'path';
import { expect } from 'expect';
import outputFiles from 'output-files';
import chdir from 'chdir';

import self from './index.js';

beforeEach(async function () {
    this.resetWithLocalTmpDir = await withLocalTmpDir()
})

afterEach(async function () {
    await this.resetWithLocalTmpDir()
})

describe('index', () => {

    it("simple", async () => {
        await fs.ensureDir(path.join('node_modules', 'foo'));
        expect(self('foo')).toEqual(path.resolve('node_modules', 'foo'));
    });

    it("scoped package", async () => {
        await fs.ensureDir(path.join('node_modules', '@foo', 'bar'));
        expect(self('@foo/bar')).toEqual(path.resolve('node_modules', '@foo', 'bar'));
    });

    it("package name in path multiple times", async () => {
        await outputFiles({
            'foo/node_modules/foo': {
                'package.json': JSON.stringify({
                    main: './dist/index.js',
                }),
                dist: {
                    'index.js': '',
                    'package.json': '{}',
                },
            },
        });
        await chdir('foo', () => expect(self('foo')).toEqual(path.resolve('node_modules', 'foo')));
    });

    it("package name file in subpath of package", async () => {
        await outputFiles({
            'node_modules/foo': {
                'package.json': JSON.stringify({
                    main: './foo.js',
                }),
                'foo.js': '',
            },
        });
        expect(self('foo')).toEqual(path.resolve('node_modules', 'foo'));
    });

    it("multiple node_modules paths", async () => {
        await outputFiles({
            foo: {
                'node_modules/baz': {},
                'bar/node_modules': {},
            },
        });
        const cwd = process.cwd()
        await chdir(path.join('foo', 'bar'), () => expect(self('baz')).toEqual(path.resolve(cwd, 'foo', 'node_modules', 'baz')));
    });

    it('no arguments', async () => {
        await fs.outputFile('package.json', JSON.stringify({}));
        expect(self()).toEqual(process.cwd());
    });

    it('cwd', async () => {
        await fs.outputFile(path.join('sub', 'node_modules', 'foo', 'package.json'), JSON.stringify({}));
        expect(self('foo', { cwd: 'sub' })).toEqual(path.resolve('sub', 'node_modules', 'foo'));
    });
});
