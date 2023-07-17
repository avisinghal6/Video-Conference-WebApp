const express = require("express");
const app = express();
const env = require("./config/environment");
const VidCallServer = require("http").Server(app);
//cors will be used as a middleware
const cors = require("cors");
const VidCallSockets = require("./config/socket").VidCallSockets(VidCallServer,{
    cors: {
        origin: "*", //allow all origins
        methods: ["GET","POST"]
    }
});


const port=env.port;

app.use(cors());

app.use("/", require("./routes"));

VidCallServer.listen(port);
console.log(`chat server is listening on port ${port}`);
