module.exports.VidCallSockets = function (socketServer, config) {
    let io = require("socket.io")(socketServer,config);

    io.on("connection", function (socket) {
        socket.emit('me',socket.id);
        
  
      socket.on("disconnect", function () {
        socket.broadcast.emit("call disconnected");
      });
  
      socket.on("calluser", function (toUser,data,from,name) {
        io.to(toUser).emit("calluser",{data: data, from, name});
      });

      socket.on("answercall", function(data){
        io.to(data.to).emit("callaccepted",data.data);
      });

    });
  };