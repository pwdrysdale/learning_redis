// express server boilerplate
const express = require("express")
const redis = require("redis")

const app = express()

// start a redis server
const client = redis.createClient()

app.get("/", async (req, res) => {
  try {
    await client.connect()
    await client.set("name", "John")
    const response = await client.get("name")
    console.log(response)
    await client.quit()

    res.json({ message: "Hello World!", objective: "Learn redis" })
  } catch (err) {
    console.log(err)
  }
})

app.get("/new-route", async (req, res) => {
  try {
    await client.connect()
    const response = await client.get("name")
    // note that response is null if there is no value for the key
    // or the key does not exist
    await client.quit()
    res.json({ status: "success", message: response })
  } catch (err) {
    res.json({ status: "error", message: err })
  }
})

app.get("/keys", async (req, res) => {
  try {
    await client.connect()
    const keys = await client.keys("*")
    await client.quit()
    res.json({ status: "success", message: keys })
  } catch (err) {
    res.json({ status: "error", message: err })
  }
})

app.post("/clear-redis", async (req, res) => {
  try {
    await client.connect()
    // clear the redis cache
    await client.flushAll()
    await client.quit()
    res.json({ status: "success", message: "redis cleared" })
  } catch (err) {
    console.log(err)
    res.json({ status: "error", message: err })
  }
})

// a redis acl (access control list) is used to restrict access to a redis key
// the acl is set with the SETACL command
// the acl is retrieved with the GETACL command
// the acl is removed with the DELACL command

app.get("/setacl", async (req, res) => {
  try {
    await client.connect()
    await client.setACL("name", "read", "user:joe")
    await client.quit()
    res.json({ status: "success", message: "acl set" })
  } catch (err) {
    res.json({ status: "error", message: err })
  }
})

app.get("/getacl", async (req, res) => {
  try {
    await client.connect()
    const acl = await client.getACL("name")
    await client.quit()
    res.json({ status: "success", message: acl })
  } catch (err) {
    res.json({ status: "error", message: err })
  }
})

app.get("/delacl", async (req, res) => {
  try {
    await client.connect()
    await client.delACL("name")
    await client.quit()
    res.json({ status: "success", message: "acl deleted" })
  } catch (err) {
    res.json({ status: "error", message: err })
  }
})

// test the acl with the GET command
app.get("/get", async (req, res) => {
  try {
    await client.connect()
    const response = await client.get("name")
    await client.quit()
    res.json({ status: "success", message: response })
  } catch (err) {
    res.json({ status: "error", message: err })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log("App started on port " + PORT)
})
