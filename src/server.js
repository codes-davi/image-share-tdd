//file to execute server test calls

require('dotenv').config();
const app = require('./main');
const port = process.env.PORT;

app.listen(port, () => console.log(`Running on ${port}`));