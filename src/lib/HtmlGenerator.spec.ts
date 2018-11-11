import test from 'ava';
import path from 'path';
import fs from 'fs';
const {JSDOM} = require('jsdom');

import {generate} from './HtmlGenerator';
import * as utils from './utils';

const testTemplateName = 'test';
const testTemplatePath = path.resolve('src', 'templates', `${testTemplateName}.ejs`);

test('testing template should exist', async t => {
  t.truthy(await utils.fileExists(testTemplatePath));
});

test.beforeEach (async t => {
  t.context = {...t.context,
    testOutFilePath: path.resolve('temp', `${utils.generateRandomString()}.html`),
    templateAsString: await utils.readFileContents(testTemplatePath)
  };
});

test.afterEach.always(async t => {
  const {testOutFilePath} = t.context as any;
  try {
    fs.unlinkSync(testOutFilePath);
  } catch(e) {
    t.log(e);
  }
});

test('should generate html file', async t => {
  const {testOutFilePath} = t.context as any;
  await generate(testTemplateName, testOutFilePath)
  t.is(await utils.fileExists(testOutFilePath), true);
});

test('should apply template parameters', async t => {
  const {testOutFilePath, templateAsString} = t.context as any;
  const title = 'TEST TITLE';
  const params = {title};
  await generate(testTemplateName, testOutFilePath, params)
  const generatedHtmlString = await utils.readFileContents(testOutFilePath);
  t.not(generatedHtmlString, templateAsString);
  const window = new JSDOM(generatedHtmlString).window;
  t.is(window.document.title, title);
});

