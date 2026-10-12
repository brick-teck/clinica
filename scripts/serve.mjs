import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');const name=decodeURIComponent(url.pathname);const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  try{const content=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(content);}
  catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')));}
 }catch{res.writeHead(400);res.end('Bad request');}
}).listen(port,'127.0.0.1',()=>console.log(`Clínica Essentia: http://127.0.0.1:${port}`));
