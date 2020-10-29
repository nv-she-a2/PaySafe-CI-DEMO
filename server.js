const express = require('express');
const cors = require('cors');
const router = require('./router');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

router(app);

app.listen(port, (err) => {
    if(err)
        console.log(err);
    console.log('Listening to port '+ port);
});
