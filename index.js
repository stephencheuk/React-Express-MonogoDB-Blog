const app = require("./index_core.js");

app.listen(process.env.PORT || 5000, () => console.log("Server ready and Listen on " + (process.env.PORT || 5000)))

