import dotenv from "dotenv"
dotenv.config()

import server from "./app.js"
import state from "./state.js"

const port = process.env.PORT || 8000

server(state).listen(port, () => {
  console.log(`listening on port ${port}`)
})
