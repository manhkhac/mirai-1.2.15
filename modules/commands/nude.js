const request = require("request");
const fs = require("fs");
module.exports.config = {
  name: "nude",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Thanh Dz",
  description: "Ảnh Gái 18+ Hot nhất ",
  commandCategory: "random-img",
  usages: "sex",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) => {
  var link = [
    "https://i.imgur.com/B5ZyErb.jpg",
    "https://i.imgur.com/CrwrKlk.jpg",
    "https://i.imgur.com/tV61WsV.jpg",
    "https://i.imgur.com/66O6j1T.jpg",
    "https://i.imgur.com/R8KKRoN.jpg",
    "https://i.imgur.com/3EkVNe8.jpg",
    "https://i.imgur.com/k0jwRfs.jpg",
    "https://i.imgur.com/we4jvDp.jpg",
    "https://i.imgur.com/mISVkFC.jpg",
    "https://i.imgur.com/fQ5EHVZ.jpg",
    "https://i.imgur.com/GjbA4Ze.jpg",
    "https://i.imgur.com/dIzxU8Q.jpg",
    "https://i.imgur.com/a9o8A1a.jpg",
    "https://i.imgur.com/VwL7Nul.jpg",
    "https://i.imgur.com/tJF0xSU.jpg",
    "https://i.imgur.com/JiRhi00.jpg",
    "https://i.imgur.com/sWqCkwd.jpg",
    "https://i.imgur.com/r2usTzU.jpg",
    "https://i.imgur.com/OxhZsje.jpg",
    "https://i.imgur.com/vIBxhrD.jpg",
    "https://i.imgur.com/BJ0so5w.jpg",
    "https://i.imgur.com/vFANQJv.jpg",
    "https://i.imgur.com/9oU7z8g.jpg",
    "https://i.imgur.com/udTH3a1.jpg",
    "https://i.imgur.com/GV3WdKM.jpg",
    "https://i.imgur.com/1oYHF8W.jpg",
    "https://i.imgur.com/IjvL7BI.jpg",
    "https://i.imgur.com/gVhh9N2.jpg",
    "https://i.imgur.com/RH2zjOe.jpg",
    "https://i.imgur.com/hztZuAX.jpg",
    "https://i.imgur.com/GeVMt9o.jpg",
    "https://i.imgur.com/Q5hNjZX.jpg",
    "https://i.imgur.com/jFCU35N.jpg",
    "https://i.imgur.com/qpeaxY5.jpg",
    "https://i.imgur.com/R1g44xU.jpg",
    "https://i.imgur.com/xfxHrXL.jpg",
    "https://i.imgur.com/ph2qlIf.jpg",
    "https://i.imgur.com/eSf63Uf.jpg",
    "https://i.imgur.com/bTTq9LJ.jpg",
    "https://i.imgur.com/X0RK5T8.jpg",
    "https://i.imgur.com/LDHHAhu.jpg",
    "https://i.imgur.com/W71RsYu.jpg",
    "https://i.imgur.com/TGmFRW6.jpg",
    "https://i.imgur.com/ZyxAOIu.jpg",
    "https://i.imgur.com/Ej2b8aT.jpg",
    "https://i.imgur.com/2Vbu7Gp.jpg",
    "https://i.imgur.com/8XN7mb5.jpg",
    "https://i.imgur.com/wPb4HPU.jpg",
    "https://i.imgur.com/z6dlAn3.jpg",
    "https://i.imgur.com/hITbCDe.jpg",
    "https://i.imgur.com/EGrcRYS.jpg",
    "https://i.imgur.com/poCvruJ.jpg",
    "https://i.imgur.com/ntOZOPe.jpg",
    "https://i.imgur.com/NBqRXsf.jpg",
    "https://i.imgur.com/codSlYk.jpg",
    "https://i.imgur.com/dTsmNI6.jpg",
    "https://imgur.com/qT3Go1T.jpg",
    "https://imgur.com/VeyyPj0.jpg",
    "https://imgur.com/X2erU0l.jpg",
    "https://imgur.com/rfvX9mv.jpg",
    "https://imgur.com/Y2qyBYg.jpg",
    "https://imgur.com/32UL8kW.jpg",
    "https://imgur.com/tXfe11m.jpg",
    "https://imgur.com/Ti4ZXJl.jpg",
    "https://imgur.com/eeP8Nh2.jpg",
    "https://imgur.com/dvoy7AB.jpg",
    "https://imgur.com/TtkGTLc.jpg",
    "https://imgur.com/H6LQ3vQ.jpg",
    "https://imgur.com/prPTqc8.jpg",
    "https://imgur.com/e8mmRzB.jpg",
    "https://imgur.com/uq37TrQ.jpg",
    "https://imgur.com/KXELrjm.jpg",
    "https://imgur.com/BQtnvld.jpg",
    "https://imgur.com/SapoJze.jpg",
    "https://imgur.com/wrMt5HQ.jpg",
    "https://imgur.com/isOdbGY.jpg",
    "https://imgur.com/5VP6gUL.jpg",
    "https://imgur.com/n6nKBOc.jpg",
    "https://imgur.com/q4Shn73.jpg",
    "https://imgur.com/69kCOnM.jpg",
    "https://imgur.com/DitiZ5x.jpg",
    "https://imgur.com/gIL0She.jpg",
    "https://imgur.com/7BvzyJs.jpg",
    "https://imgur.com/7niQPPi.jpg",
    "https://imgur.com/CZhzHrP.jpg",
    "https://imgur.com/L5PV5bQ.jpg",
    "https://imgur.com/4WoEvwn.jpg",
    "https://imgur.com/71bOE56.jpg",
    "https://imgur.com/oHYW1Eo.jpg",
    "https://imgur.com/hcIFVHC.jpg",
    "https://imgur.com/VjHpegE.jpg",
    "https://imgur.com/oaRjTBh.jpg",
    "https://imgur.com/rk2Vqxa.jpg",
    "https://imgur.com/ZccsSQB.jpg",
    "https://imgur.com/Bf7UDQy.jpg",
    "https://i.imgur.com/dTsmNI6.jpg",
  ];
  var max = Math.floor(Math.random() * 6);
  var min = Math.floor(Math.random() * 2);
  var data = await Currencies.getData(event.senderID);
  //var exp = data.exp;
  var money = data.money
  if (money < 5000) api.sendMessage("Bạn cần 5000 đô để xem ảnh ?", event.threadID, event.messageID)
  else {
    Currencies.setData(event.senderID, options = { money: money - 5000 })
    var callback = () => api.sendMessage({ body: `Ảnh NUDE !!!!\nSố Ảnh: ${link.length}\n-5000 đô !`, attachment: fs.createReadStream(__dirname + "/cache/1.jpg") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"), event.messageID);
    return request(encodeURI(link[Math.floor(Math.random() * link.length)] + (max - min))).pipe(fs.createWriteStream(__dirname + "/cache/1.jpg")).on("close", () => callback());
  }
};