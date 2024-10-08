const http = require("http");
const cookieManager = require('cookie-parser');
const path = require('path');
const express = require('express');
// const nedb = require('nedb');
const app = express();
const sockets = require('socket.io');
const fs = require("fs");
const server = http.createServer(app);
const { Databases } = require("esosdb");
const hashLib = require("js-hash-encoding");
// const DataBase = new nedb({ filename: './db/db.json', autoload: true });
// const DBtovs = new nedb({ filename: './db/tovars.json', autoload: true });
  // var doc = [
  //   {
  //     user: "Володя",
  //     tel: "0987643210",
  //     tovars: [
  //       "Мокасини", "берці", "чоботи", "кросівки зимові", "кросівки літні"
  //     ]
  //   },
  //   {
  //     user: "Володя",
  //     tel: "0987643298",
  //     tovars: [
  //       "Мокасини"
  //     ]
  //   }
  // ]
// var doc = [
//   {
//     t: "Кроссівки літні",
//     c: "літо",
//     d: "Міцні",
//     p: "708.50",
//     i: "./public/images/1.png"
//   },
//   {
//     t: "Кроссівки зимові",
//     c: "зима",
//     d: "Міцні",
//     p: "1200.00",
//     i: "./public/images/2.png"
//   },
//   {
//     t: "Кроссівки осінні",
//     c: "осінь",
//     d: "Міцні",
//     p: "1250.00",
//     i: "./public/images/3.png"
//   }
// ]

  //     DBtovs.insert(doc, function (err, newDoc) {   // Callback is optional
  //   // newDoc is the newly inserted document, including its _id
  //   // newDoc has no key called notToBeSaved since its value was undefined
  //     // console.log(newDoc._id)
  //     //   DataBase.find({ user: "Володя" }, function (err, docs) {
  //     //   // docs is an array containing documents Mars, Earth, Jupiter
  //     //   // If no document is found, docs is equal to []
  //     //     console.log(docs);
  //     // });
  // });
const io = sockets(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  },
  maxHttpBufferSize: 3e8 // = 300 MB, 500 MB = 5e8 for transmiting files
});
app.disable("x-powered-by");
app.use(express.static('public'));
io.on('connection', (socket) => {
  let count = 32;
  if (count > 99999 && count < 999999) {
    count = `${String(count).slice(0, 3)} тис.`
  } else if (count > 999999 && count < 999999999) {
    count = `${String(count).slice(0, 3)} млн.`
  } else if (count < 99999) {
    count = count;
  } else {
    count = "більше мільйона";
  }
  socket.on("getProds", data => {
    io.to(socket.id).emit("setProds", JSON.parse(fs.readFileSync("./db/tovars.json", "utf-8"))[String(data.id)])
  })
  socket.on("loadUsers", () => {
    io.to(socket.id).emit("content", JSON.parse(fs.readFileSync("./db/db.json", "utf-8")));
  });
  socket.on("newOrder", (data) => {
    console.log(data)
    let DBbuyed = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    DBbuyed.push(data);
    fs.writeFileSync("./db/db.json", JSON.stringify(DBbuyed, null, 2))
    io.to(socket.id).emit("OrderS");
    io.emit("orderSAdmin", data)
  })
  socket.on("getPerms", () => {
    io.to(socket.id).emit("setPerms", fs.readFileSync("./activators.json", "utf8"));
  })
  socket.on("sold", iid => {
    let DBbuyed = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    let activs = JSON.parse(fs.readFileSync("./activators.json", "utf8"));
    DBbuyed.forEach((elem, index) => {
      if (elem.user.usercode == iid) {
        DBbuyed.splice(index, 1);
      }
    })
    activs.buyed = Number(activs.buyed) + 1;
    
    fs.writeFileSync("./db/db.json", JSON.stringify(DBbuyed, null, 2));
    fs.writeFileSync("./activators.json", JSON.stringify(activs, null, 2));
    io.to(socket.id).emit("content", DBbuyed);
  })
  socket.on("changeVisibility", data => {
    let tovs = JSON.parse(fs.readFileSync("./db/tovars.json", "utf-8"));
    tovs[data.sezon][data.category].every(elem => {
      if (elem._id == data.uid) {
        elem.isvisible = !elem.isvisible;
        return false;
      } else {
        return true;
      }
    })
    fs.writeFileSync("./db/tovars.json", JSON.stringify(tovs, null, 2));
    console.log(data.isvisibility == "true"?false:true)
    console.log(data.isvisibility)
    io.to(socket.id).emit("setChanged", {
      iid: data.uid,
      isvisible: data.visibility == "true"?false:true
    })
  })
  socket.on("editProduct", data => {
    let tovs = JSON.parse(fs.readFileSync("./db/tovars.json", "utf-8"))
    tovs[data.sezon][data.category].every(elem => {
      if (elem._id == data.uid) {
        elem.t = data.name;
        elem.d = data.desc;
        elem.sizes = `${data.pairsta} - ${data.pairend}`;
        elem.pars = data.pairs;
        return false;
      } else {
        return true;
      }
    })
    fs.writeFileSync("./db/tovars.json", JSON.stringify(tovs, null, 2));
    io.to(socket.id).emit("setProds", tovs[data.sezon]);
  })
  socket.on("delUser", iid => {
    let DBbuyed = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    DBbuyed.forEach((elem, index) => {
      if (elem.user.usercode == iid) {
        DBbuyed.splice(index, 1);
      }
    })
    fs.writeFileSync("./db/db.json", JSON.stringify(DBbuyed, null, 2));
    io.to(socket.id).emit("content", DBbuyed);
  })
  socket.on("login", data => {
    const realPwd = Number(JSON.parse(fs.readFileSync("pwd.json" , "utf8"))[0]["pass"]);
    const realName = Number(JSON.parse(fs.readFileSync("pwd.json" , "utf8"))[1]["user"]);
    if (hashLib.encode(data.pass) === realPwd && hashLib.encode(data.name) === realName) {
      io.to(socket.id).emit("logged", {
        data: realPwd,
        code: `window.open('${data.protocol}//${data.hosting}/admin','window','width=1000px,height=700px')`
      });
    } else {
      io.to(socket.id).emit("loginError", {
        reason: "PassIncorrect"
      });
    }
  })
  socket.on("change", data => {
    const datas = JSON.parse(fs.readFileSync("pwd.json" , "utf8"));
    let string = "";
    if (data.type === "nick") {
      datas[1]["user"] = hashLib.encode(data.data)
      string = "Нік змінено!"
    } else {
      datas[0]["pass"] = hashLib.encode(data.data)
      string = "Пароль змінено!"
    }
    fs.writeFileSync("pwd.json", JSON.stringify(datas, null, 2));
    io.to(socket.id).emit("Yes", string);
  })
  socket.on("openAdmin", data => {
    io.to(socket.id).emit("open", `window.open('${data.protocol}//${data.hosting}/admin','window','width=1000px,height=700px')`)
  })
  socket.on("delete", data => {
    let tovs = JSON.parse(fs.readFileSync("db/tovars.json", "utf8"));
    tovs[data.sezon][data.category].every((elem, index) => {
      if (elem._id === data.iid) {
        tovs[data.sezon][data.category].splice(index, 1);
        fs.unlinkSync("./public"+elem.i);
        return false;
      }
      return true;
    });
    fs.writeFileSync("db/tovars.json", JSON.stringify(tovs, null, 2));
    io.to(socket.id).emit("deleted", data.iid)
  });
  socket.on("createProd", ({name: t, desc: d, price: p, image: i, id: _id, sezon, type: f, namefile, code, pairs, sizes, category}) => {
    fs.writeFileSync(`./public/images/${namefile}.${f}`, i)
    fs.renameSync(`./public/images/${namefile}.${f}`, `./public/images/${_id}.${f}`)
    namefile = _id;
    let ob = {
      "t": String(t),
      "d": String(d),
      "p": String(p),
      "i": `/images/${_id}.${f}`,
      "discount": {
        "reduced": false,
        "old_price": String(p)
      },
      "_id": String(_id),
      "code": code,
      "pars": pairs,
      "sizes": sizes,
      "isvisible": true
    }
    let obh = JSON.parse(fs.readFileSync("./db/tovars.json", "utf-8"));
    obh[String(sezon)][category].push(ob);
    fs.writeFileSync("./db/tovars.json", JSON.stringify(obh, null, 2))
    setTimeout(() => {
      io.to(socket.id).emit("added");
    })
  });
  socket.on("loadInfo", data => {
    let fg = JSON.parse(fs.readFileSync("./db/tovars.json", "utf8"));
    let h = {
      tovs: fg[data.sezon][data.category]
    };
    h.c = data.sezon;
    h.category = data.category;
    io.to(socket.id).emit("loaded", h);
  })
  socket.on("changePrice", data => {
    let fg = JSON.parse(fs.readFileSync("./db/tovars.json", "utf8"));
    if (data.isSale) {
      if (Number(data.oldprice) > Number(data.price)) {
        fg[data.sezon][data.category].every(elem => {
          if (elem._id === data.id) {
            elem.p = data.price;
            elem.discount.reduced = true;
            return false;
          }
          return true;
        })
        fs.writeFileSync("./db/tovars.json", JSON.stringify(fg, null, 2));
        io.to(socket.id).emit("changedPrice");
      }
    } else {
      fg[data.sezon][data.category].every(elem => {
        if (elem._id === data.id) {
          elem.p = data.price;
          elem.discount.old_price = data.price;
          elem.discount.reduced = false;
          return false;
        }
        return true;
      });
      fs.writeFileSync("./db/tovars.json", JSON.stringify(fg, null, 2));
      io.to(socket.id).emit("changedPrice");
    }
  })
});
server.listen(3000, "0.0.0.0", function() {
  console.log('listening on 3000');
});
//https://codepen.io/sdras/pen/GOBGjg