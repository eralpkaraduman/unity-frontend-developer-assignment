import http from 'http';
import path from 'path';
import { renderTemplate } from './HtmlGenerator';

function start(
  assetNames: ReadonlyArray<string>,
  onAssetRequested: (assetName: string) => Promise<string>,
  port = 3000,
  host = '0.0.0.0'
): void {
  http.createServer(async (req, res) => {
    const reqAssetName = (req.url || '').replace(/^\/+/g, '');
    if (assetNames.includes(reqAssetName)) {
      const assetContent = await onAssetRequested(reqAssetName);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(assetContent, 'utf-8');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(
        await renderTemplate(
          path.resolve('src', 'templates', '404.ejs'),
          {assetNames}
        ),
        'utf-8'
      );
    }
  })
  .listen(port, host, () => {
    // tslint:disable-next-line:no-console
    console.log(`[devserver] Development server listening on port:${port}`);
    // tslint:disable-next-line:no-console
    console.log(`[devserver] http://${host}:${port}`);
  });
}

export default { start };
