import test from 'ava';
const {JSDOM} = require('jsdom');
import {generateHtml, loadTemplate} from './generateHtml';

const testTemplate = `
<html>
  <head>
    <title><%= params.title %></title>
  </head>
</html>`;

test('result is non empty string', async t => {
  t.truthy(generateHtml(testTemplate));
  t.is(typeof generateHtml(testTemplate), 'string');
  t.not(generateHtml(testTemplate).length, 0);
});

test('should have correct title', async t => {
  const title = 'TEST TITLE';
  const html = generateHtml(testTemplate, {title});
  const window = new JSDOM(html).window;
  t.is(window.document.title, title);
});

test('should load templates by name', async t => {
  const templateName = 'test';
  const testTemplate = await loadTemplate(templateName);
  t.not(testTemplate, null);
  t.is(typeof testTemplate, 'string');
  t.truthy(testTemplate.length > 0);
  const title = 'TEST FILE TITLE';
  const html = generateHtml(testTemplate, {title});
  const window = new JSDOM(html).window;
  t.is(window.document.title, title);
});

test('should handle missing template', async t => {
  await t.throwsAsync(
    async () => await loadTemplate('notemplate'),
    'Template Not Found'
  );
});