import test from 'ava';
import fs from 'fs';
import {JSDOM} from 'jsdom';
import path from 'path';

import {generate, renderTemplate} from './HtmlGenerator';
import * as utils from './utils';

const templateString = `
<html>
  <head>
    <title><%= locals.title %></title>
  </head>
</html>`;

test.beforeEach (async t => {
  t.context = {...t.context,
    testOutFilePath: path.resolve('temp', `${utils.generateRandomString()}.html`),
    testTemplatePath: await utils.writeFileContents(
      path.resolve('temp', `${utils.generateRandomString()}.ejs`),
      templateString
    )
  };
});

test.afterEach.always(async t => {
  const {testOutFilePath, testTemplatePath} = t.context as any;
  try {
    fs.unlinkSync(testOutFilePath);
    fs.unlinkSync(testTemplatePath);
  }catch(e){ t.log(e); }
});

test('should render template', async t => {
  const {testTemplatePath} = t.context as any;
  const title = 'TEST TITLE';
  const htmlString = await renderTemplate(testTemplatePath, {title});
  const window = new JSDOM(htmlString).window;
  t.is(window.document.title, title);
});

test('should generate html file', async t => {
  const {testOutFilePath, testTemplatePath} = t.context as any;
  await generate(testTemplatePath, testOutFilePath);
  t.is(await utils.fileExists(testOutFilePath), true);
});

test('should apply template parameters', async t => {
  const {testOutFilePath, testTemplatePath} = t.context as any;
  const title = 'TEST TITLE';
  const params = {title};
  await generate(testTemplatePath, testOutFilePath, params);
  const generatedHtmlString = await utils.readFileContents(testOutFilePath);
  t.not(generatedHtmlString, templateString);
  const window = new JSDOM(generatedHtmlString).window;
  t.is(window.document.title, title);
});
