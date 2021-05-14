import express from "express"
import cors from "cors"

import restaurants from "./restaurants.route.js"

export default async (state) => {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.set("state", await state)
  app.use("/api/v1/restaurants", restaurants)
  app.use("*", (req, res) => res.status(404).json({ error: "not found" }))
  app.use((req, res, next, e) => {
    console.log(`api, ${e}`)
    res.status(500).json({ error: e.message })
  })

  return app
}
