import ejs from 'ejs';

export function generateHtml(ejsTemplate: string, params: Object = {}): string {
  const result = ejs.render(ejsTemplate, {params});
  return result;
}