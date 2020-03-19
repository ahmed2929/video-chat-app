var express=require('express')
var app=express()
var  http=require('http').createServer(app)
var io=require('socket.io')(http)
var path=require('path');
var activeSockets=[];
app.use(express.static(path.join(__dirname,'front')))

app.get('/',(req,res)=>{
    res.render('index')
})


io.on("connection", socket => {
  console.log("new clint connected")
    const existingSocket = activeSockets.find(
      existingSocket => existingSocket === socket.id
    );

    if (!existingSocket) {
      activeSockets.push(socket.id);

      socket.emit("update-user-list", {
        users: activeSockets.filter(
          existingSocket => existingSocket !== socket.id
        )
      });

      socket.broadcast.emit("update-user-list", {
        users: [socket.id]
      });
    }


    socket.on("call-user", (data) => {
      socket.to(data.to).emit("call-made", {
        offer: data.offer,
        socket: socket.id
      });
    });
  
    socket.on("make-answer", data => {
      socket.to(data.to).emit("answer-made", {
        socket: socket.id,
        answer: data.answer
      });
    });

    socket.on("reject-call", data => {
      socket.to(data.from).emit("call-rejected", {
        socket: socket.id
      });
    });

    socket.on("reject-call", data => {
      socket.to(data.from).emit("call-rejected", {
        socket: socket.id
      });
    });


  })

  

http.listen(process.env.PORT,()=>{
    console.log("server up ")
})

