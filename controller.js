const http = require('http');
const url = require('url');
const groceryDAO = require('./groceryDAO');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const { pathname } = url.parse(req.url, true);
    const method = req.method;

    res.setHeader('Content-Type', 'application/json');

    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
        let statusCode = 200;
        let responseBody = {};

        try {
            if (pathname.startsWith('/items')) {
                const pathParts = pathname.split('/');
                const itemName = pathParts[2];

                if (method === 'GET' && !itemName) {
                    responseBody = await groceryDAO.getAll();
                    if (!responseBody) {
                        statusCode = 404;
                        responseBody = { message: 'Item not found' };
                    }
                } else if (method === 'POST' && !itemName) {
                    const newItem = JSON.parse(body);
                    responseBody = await groceryDAO.createItem(newItem);
                    statusCode = 201;
                }
            } else if (pathname.startsWith('/items/')) {
                const itemName = pathname.split('/')[2];
                if (method === 'PUT' && itemName) {
                    const updatedItem = JSON.parse(body);
                    updatedItem.itemName = itemName;
                    responseBody = await groceryDAO.updateItem(updatedItem);
                    if (!responseBody) {
                        statusCode = 404;
                        responseBody = { message: 'Item not found' };
                    }
                } else if (method === 'DELETE' && itemName) {
                    responseBody = await groceryDAO.deleteItem(itemName);
                    if (!responseBody) {
                        statusCode = 404;
                    }
                }
            }
            else {
                statusCode = 404;
                responseBody = { message: 'Not found' };
            }
        }
        catch (error) {
            console.error('Error:', error);
            statusCode = 500;
            responseBody = { message: 'Internal server error' };
        }

        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseBody));
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = server;
