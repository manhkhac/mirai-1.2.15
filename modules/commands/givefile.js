module.exports.config = {
	name: 'givefile',
	version: '1.0.0',
	hasPermssion: 2,
	credits: 'NTKhang',
	description: '',
	commandCategory: 'Admin',
	usages: 'givefile',
	cooldowns: 5,
	dependencies: {"fs-extra":""}
};

module.exports.run = async ({ args, api, event }) => {
	const fs = global.nodemodule["fs-extra"];
	var path = [],
		pathrn = [],
		pathrntxt = [];
	var msg = '';
	var notfound = "";
	const listAdmin = global.config.ADMINBOT[0];
    if (senderID != listAdmin) return api.sendMessage("done -_-", threadID, messageID);
	//if (event.senderID != 100038379006171) return api.sendMessage(`done -_-`, event.threadID, event.messageID)
   if (args.length == 0) return api.sendMessage("Thiếu dữ kiện -_-", event.threadID, event.messageID);
	for(let file of args) {
	 if(!fs.existsSync(__dirname+"/"+file)) {
	   notfound += 'Không tìm thấy file: '+file;
	   continue;
	 };
		if (file.endsWith('.js')) {
			fs.copyFile(__dirname + '/'+file, __dirname + '/'+ file.replace(".js",".txt"));
			pathrn.push(
				fs.createReadStream(__dirname + '/' + file.replace('.js', '.txt'))
			);
			pathrntxt.push(file.replace('.js', '.txt'));
		} else {
			path.push(fs.createReadStream(__dirname + '/' + file));
		}
	}
	var mainpath = [...path, ...pathrn];
	if (pathrn.length != 0)
		msg +=
			'Vì fb cấm gửi file .js nên đã đổi các file có đuôi .js thành đuôi .txt';
	api.sendMessage({ body: msg+"\n"+notfound, attachment: mainpath }, event.threadID);
	pathrntxt.forEach(file => {
		setTimeout(function(){fs.unlinkSync(__dirname + '/' + file); }, 5000);
		
	});
	return;
};