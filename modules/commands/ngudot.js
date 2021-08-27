module.exports.config = {
    name: "ngudot",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "manhIT",
    description: "ngu dot (Tiến bịp)",
    commandCategory: "noprefix",
    usages: "[ngudot/dốt/ngu dốt]",
    cooldowns: 0,
    denpendencies: {
        "fs-extra": "",
        "request": ""
    }
};
module.exports.onLoad = () => {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const dirMaterial = __dirname + `/noprefix/`;
    if (!fs.existsSync(dirMaterial + "noprefix")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "ngudot.mp4")) request("https://raw.githubusercontent.com/manhkhac/mirai-1.2.8/data/mp4/ngudot.mp4").pipe(fs.createWriteStream(dirMaterial + "ngudot.mp4"));
}
module.exports.handleEvent = async({ event, api }) => {
    const fs = global.nodemodule["fs-extra"];

    var { threadID, messageID, body, senderID } = event;
    if (senderID == api.getCurrentUserID()) return;

    function out(data) {
        api.sendMessage(data, threadID, messageID)
    }
    //trả lời
    var msg = {
            body: `Ngu dốt, ngu vcl`,
            attachment: fs.createReadStream(__dirname + `/noprefix/ngudot.mp4`)
        }
        // Gọi bot
    var arr = ["ngu dot","Ngu dot","ngu dốt","Ngu dốt", "ngu ngốc","Ngu ngốc", "dốt","Dốt", "ngudot", "ngu dốt vcl","Ngudot"];
    arr.forEach(i => {
        if (body == i) return out(msg)
    });

};
module.exports.run = async({ event, api }) => {
    return api.sendMessage("Dùng sai cách rồi lêu lêu", event.threadID)
}