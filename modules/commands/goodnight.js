module.exports.config = {
  name: "goodnight",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "manhIT",
  description: "Chuc ngu ngon",
  commandCategory: "noprefix",
  usages: "",
  cooldowns: 0,
  denpendencies: {
    "fs-extra": "",
    "request": ""
  }
};
module.exports.onLoad = () => {
  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];
  const dirMaterial = __dirname + `/Noprefix/`;
  if (!fs.existsSync(dirMaterial + "noprefix")) fs.mkdirSync(dirMaterial, { recursive: true });
  if (!fs.existsSync(dirMaterial + "goodnight.gif")) request("https://genk.mediacdn.vn/2018/9/5/original-1536118979702307632507.gif").pipe(fs.createWriteStream(dirMaterial + "goodnight.gif"));
}
module.exports.handleEvent = async ({ event, api, Users }) => {
  const fs = global.nodemodule["fs-extra"];
  let name = await Users.getNameUser(event.senderID);

  var { threadID, messageID, body, senderID } = event;
  if (senderID == api.getCurrentUserID()) return;
  function out(data) {
    api.sendMessage(data, threadID, messageID)
  }
  //trả lời
  var msg = {
    body: `${name}, cậu ngủ ngon đi nhé.
      I miss you so much!
      Hẹn gặp lại cậu vào sáng mai nha ❤`,
    attachment: fs.createReadStream(__dirname + `/Noprefix/goodnight.gif`)
  }
  // Gọi bot
  var arr = ["ngủ", "ngủ đi ae", "ngủ thôi", "bye", "good night","nn","nngon"];
  arr.forEach(i => {
    if (body === i.toUpperCase() | body === i) return out(msg)
  });

};
module.exports.run = async({ event, api }) => {
  return api.sendMessage("( \\_/)                                                                            ( •_•)                                                                            // >🧠                                                            Đưa não cho bạn lắp vào đầu nè.\nCó biết là lệnh Noprefix hay không?", event.threadID)
}