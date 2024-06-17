const express = require('express')
const {getConnection } = require("./db/db-connection-mongo")
const app = express()
const port = 3000

getConnection(); 


app.use(express.json())

app.use("/inventario", require("./router/inventario"));
app.use("/usuario", require("./router/usuario"));
app.use("/marca", require("./router/marca"));
app.use("/tipoEquipo", require("./router/tipoEquipo"));
app.use("/estadoEquipo", require("./router/estadoEquipo"));

app.use("/auth", require("./router/auth"));




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})