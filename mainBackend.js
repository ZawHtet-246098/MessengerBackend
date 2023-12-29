const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const authMiddleware = require("./middleware/AuthMiddleware.js");
const socket = require("socket.io");
require("dotenv").config();

const FacebookStrategy = require("passport-facebook").Strategy;
const cookieSession = require("cookie-session");

const app = express();

const userRoute = require("./routes/userRoute.js");
const protestedRoute = require("./routes/protestedRoute.js");
const resetPasswordRoute = require("./routes/resetPassword.js");
const messageRoute = require("./routes/messageRoute.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

FACEBOOK_APP_ID = "707710300713123";
FACEBOOK_APP_SECRET = "6707944c6777f7f93a3869395cae9410";

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/user/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Your backend journey is started!!",
  });
});

app.get("/:room", (req, res) => {
  res.render('room', { roomId: req.params.room })
})

app.use("/user", userRoute);
app.use("/protestedroute", authMiddleware, protestedRoute);
app.use("/resetPassword", resetPasswordRoute);
app.use("/message", messageRoute);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNNECTION_URL)
  .then(() => {
    const server = app.listen(PORT, () =>
      console.log(`Server is Running on port ${PORT} and db is connected`)
    );

    // const io = socket(server, {
    //   cors: {
    //     origin: "http://localhost:3000",
    //     credentials: true,
    //   },
    // });

    const io = socket(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    global.onlineUsers = new Map();
    io.on("connection", (socket) => {
      global.chatSocket = socket;
      socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log('new user added')
      });
      socket.emit("welcome", socket.id);

      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);

        if (sendUserSocket) {
          console.log(sendUserSocket);
          socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
      });

      socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
      });

      socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        console.log('callUser', { userToCall, signalData, from, name })
        const sendUserSocket = onlineUsers.get(userToCall)
        // console.log(userToCall)
        console.log(sendUserSocket)
        console.log(onlineUsers);
        if (sendUserSocket) {
          io.to(sendUserSocket).emit("callUser", { signal: signalData, from, name });
          io.to(sendUserSocket).emit('testing', { help: 'hel' })
          console.log('helo iam here')
        }
      });

      socket.on("answerCall", (data) => {
        const sendUserSocket = onlineUsers.get(data.to)
        io.to(sendUserSocket).emit("callAccepted", data.signal);
      });


      // socket.on('join-room', (roomId, userId) => {
      //   console.log(roomId, userId);
      //   socket.join(roomId)
      //   socket.to(roomId).broadcast.emit('user-connected', userId)
      // })
    });

    //   socket.on("send-msg", (data) => {
    //     const sendUserSocket = onlineUsers.get(data.to);
    //     if (sendUserSocket) {
    //       console.log(data);
    //       console.log(sendUserSocket);
    //       // socket.emit("hello", { name: "John" });
    //       socket
    //         .to(sendUserSocket)
    //         .emit("msg-recieve", { fromSelf: false, message: data.msg });
    //     }
    // });
    // });
  })
  .catch((error) => console.log(`${error} did not connect`));
