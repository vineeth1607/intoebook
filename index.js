const connectToMongo = require("./db");
connectToMongo();
const express = require('express')

const app = express()
// const port = 3000   
// chnaged the port from 3000 to 5000, cause on 3000 react application  will run.

 const port = 5000;

app.use(express.json())
// Avialable Routes (Routes folder)

app.use("/api/authentication", require("./routes/authentication"));
app.use("/api/notes", require("./routes/notes"));

// app.get('/', (req, res) => {
//   res.send('Hello from express server!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})