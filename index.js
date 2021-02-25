const http = require('http');
const url = require('url');
const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');

const overviewTemplt = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const productTemplt = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const cardTemplt = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //OverView Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const productCard = dataObj.map((el) => replaceTemplate(cardTemplt, el)).join('');
    const output = overviewTemplt.replace(/{%Product_Cards%}/g, productCard);

    res.end(output);

    //Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(productTemplt, product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //Not Found
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-head': 'Hello world!',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(3000, () => {
  console.log('listening port on 3000');
});
