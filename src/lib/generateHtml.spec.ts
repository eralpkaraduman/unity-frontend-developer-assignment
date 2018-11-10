import test from 'ava';
const {JSDOM} = require('jsdom');
import {generateHtml} from './generateHtml';

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
