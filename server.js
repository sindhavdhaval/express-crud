const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')

app.get('/', (req, res) => {
    res.send('hello world')
})

app.use(express.json());
app.use(cors());
app.use('/users', userRoutes);





app.listen(3000)