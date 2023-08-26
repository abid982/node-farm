const fs = require('fs');
// Import module for networking capabilites such as building an http server
const http = require('http');
const url = require('url');

const address = 'http://localhost:8080/default.html?year=2017&month=february';
const query = url.parse(address, true);
console.log('query', query);

/////////////////////////////////////////
// FILES
// Blocking, synchronous way
// Call function to read data from file and save into a variable
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;
const textOut = `This is what we know about avocado:: ${textIn}. \n Created on ${Date.now()}`;
console.log(textOut);

// // Specify path to the file
// fs.writeFileSync('./txt/output.txt', textOut, 'utf-8');
// console.log('File written!');

fs.writeFileSync('./txt/output.txt', textOut, 'utf-8');
console.log('File is written!');

// const hello = 'Hello World';
// console.log(hello);

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     console.log(data1);
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         // console.log(data1);
//         // console.log(data1);
//         // console.log(data2);
//     });
// });

fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  console.log('Data 1:');
  console.log(data1);
  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log('Data 2:');
    console.log(data2);
  });
});

// console.log('Will read file!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR! 💥');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(`./txt/${data1}.txt`);
//     console.log('./txt/' + data1 + '.txt');
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written');
//       });
//     });
//   });
// });
// console.log('Will read file!');

fs.readFile('./txt/starfdft.txt', 'utf-8', (err, data1) => {
  if (err) return console.log('Error! 💥');
});

/////////////////////////////////////////
// SERVER
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
// const tempCard = fs.readFileSync(
//   `${__dirname}/templates/template-card.html`,
//   'utf-8'
// );

// Read file
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
console.log('Template Card:');
console.log(tempCard);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
// console.log(tempOverview);
// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
console.log('Data:');
console.log(data);
// const dataObj = JSON.parse(data);
const dataObj = JSON.parse(data);
console.log(dataObj);

// In order to build a server we have to do two things
// 1. Create the server
// 2. Start the server so that we can actually listen to incoming requests
// The createServer accepts a callback function which will be fired off each time a new request hits our server
// This callback function gets access to two very important and fundamental variables. It is the request variable and the response variable.

// Save the result of this create server to a new variable
// The callback function hits each time when a new request hits the server
const server = http.createServer((req, res) => {
  // Send back response to client
  console.log('Node Real Server');
  // console.log(req);
  //   /product
  // /favicon.ico
  console.log(req.url);
  // Parse query into an object if we pass true
  console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);
  // const pathName = req.url;

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    // Load the template overview
    // res.end('This is the OVERVIEW');

    res.writeHead(200, {
      'Content-Type': 'text/html',
    });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    console.log('Card HTML:');
    console.log(cardsHtml);

    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

    res.end(output);
    // res.end(tempOverview);
    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    // const product = dataObj.filter()
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    console.log(query.id);
    // res.end('This is the PRODUCT');
    res.end(output);
    // API
  } else if (pathname === '/api') {
    // fs.readFile('./dev-data/data.json');
    // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
    //   const productData = JSON.parse(data);
    //   console.log(productData);
    //   res.writeHead(200, {
    //     'Content-Type': 'application/json',
    //   });
    //   // res.end('API');
    //   res.end(data);
    // });
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
  // res.end('Hello from the server!');
});

// Listen to incoming request from the client
// listen(PORT)
// A port is a sub address on a certain host and host what we specify next
// The local host simply means the current computer so the computer that the program is currently running in.
// Optional argument callback function which will run as soon the server starts listening
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on prt 8000');
});
