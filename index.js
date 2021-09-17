const express = require('express')
const app = express()

const port = 3000;


app.use(express.urlencoded({ extended: false }))



app.get('/', function (req, res) {
    res.send('Hello World')
})





app.listen(port, () => console.log(`Server starting at port :${port}`))