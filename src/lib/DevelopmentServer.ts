import ejs from 'ejs';
import http from 'http';
import path from 'path';
import * as utils from './utils';

async function renderAssetListHtml(assetNames: ReadonlyArray<string>): Promise<string> {
    const template = await utils.readFileContents(path.resolve('src', 'templates', '404.ejs'));
    return ejs.render(template, { params: { assetNames } });
}

function start(
    assetNames: ReadonlyArray<string>,
    onAssetRequested: (assetName: string) => Promise<string>,
    port = 4000,
    host = '0.0.0.0'): void {
    http.createServer(async (req, res) => {
        const reqUrl = req.url || '';
        if (assetNames.includes(reqUrl)) {
            const assetContent = await onAssetRequested(reqUrl);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(assetContent, 'utf-8');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(await renderAssetListHtml(assetNames), 'utf-8');
        }
    }).listen(port, host, () => {
        // tslint:disable-next-line:no-console
        console.log(`Development server listening on port:${port}`); 
        // tslint:disable-next-line:no-console
        console.log(`http://${host}:${port}`);
    });
}

export default {start};
