const express = require("express")

const app = express()

app.get('/', (req, res) => {
    res.send("<h1>Yeah, it is working!</h1>")
});

app.listen(process.env.PORT || 5000, () => console.log("Server ready and Listen on " + (process.env.PORT || 5000)))
