import test from 'ava';
import path from 'path';
import fs from 'fs';
const {JSDOM} = require('jsdom');

import {generate} from './HtmlGenerator';
import * as utils from './utils';

const templateString = `
<html>
  <head>
    <title><%= params.title %></title>
  </head>
</html>`;

test.beforeEach (async t => {
  t.context = {...t.context,
    testTemplatePath: await utils.writeFileContents(
      path.resolve('temp', `${utils.generateRandomString()}.ejs`),
      templateString
    ),
    testOutFilePath: path.resolve('temp', `${utils.generateRandomString()}.html`)
  };
});

test.afterEach.always(async t => {
  const {testOutFilePath, testTemplatePath} = t.context as any;
  try {
    fs.unlinkSync(testOutFilePath);
    fs.unlinkSync(testTemplatePath);
  }catch(e){
    t.log(e);
  }
});

test('should generate html file', async t => {
  const {testOutFilePath, testTemplatePath} = t.context as any;
  await generate(testTemplatePath, testOutFilePath)
  t.is(await utils.fileExists(testOutFilePath), true);
});

test('should apply template parameters', async t => {
  const {testOutFilePath, testTemplatePath} = t.context as any;
  const title = 'TEST TITLE';
  const params = {title};
  await generate(testTemplatePath, testOutFilePath, params)
  const generatedHtmlString = await utils.readFileContents(testOutFilePath);
  t.not(generatedHtmlString, templateString);
  const window = new JSDOM(generatedHtmlString).window;
  t.is(window.document.title, title);
});
