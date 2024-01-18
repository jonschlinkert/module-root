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
    it('no main', async () => {
        await fs.outputFile(path.join('node_modules', 'foo', 'package.json'), JSON.stringify({}));
        expect(self('foo')).toEqual(path.resolve('node_modules', 'foo'));
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
        expect(self('foo')).toEqual(path.resolve('node_modules', 'foo'));
    });

    it("sub package.json esm", async () => {
        await outputFiles({
            'node_modules/foo': {
                'package.json': JSON.stringify({
                    type: 'module',
                    exports: './dist/index.js',
                }),
                dist: {
                    'index.js': '',
                    'package.json': '{}',
                },
            },
        });
        expect(self('foo')).toEqual(path.resolve('node_modules', 'foo'));
    });

    it("sub package.json cjs", async () => {
        await outputFiles({
            'node_modules/foo': {
                'package.json': JSON.stringify({
                    main: './dist/index.js',
                }),
                dist: {
                    'index.js': '',
                    'package.json': '{}',
                },
            },
        });
        expect(self('foo')).toEqual(path.resolve('node_modules', 'foo'));
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

    it("package name folder in subpath of package", async () => {
        await outputFiles({
            'node_modules/foo': {
                'package.json': JSON.stringify({
                    main: './foo/index.js',
                }),
                'foo/index.js': '',
            },
        });
        expect(self('foo')).toEqual(path.resolve('node_modules', 'foo'));
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

    it("node_modules package once not found", async () => {
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
