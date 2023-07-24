module.exports.VidCallSockets = function (socketServer, config) {
    let io = require("socket.io")(socketServer,config);

    io.on("connection", function (socket) {
        socket.emit('me',socket.id);
        
  
      socket.on("disconnect", function () {
        socket.broadcast.emit("call disconnected");
      });
  
      socket.on("calluser", ({toUser,data,from,name}) => {
        io.to(toUser).emit("callUser",{data: data, from: from, name: name});
      });

      socket.on("answercall", (data) =>{
        io.to(data.to).emit("callaccepted",data.data);
      });

    });
  };