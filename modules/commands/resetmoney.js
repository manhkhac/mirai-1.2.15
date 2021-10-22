module.exports.config = {
    name: "resetmoney",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "manhG",
    description: "Reset số tiền của cả nhóm về 0",
    commandCategory: "admin",
    usages: "[cc], [del], [all]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, Currencies }) => {
    const data = event.participantIDs;
    //console.log(data)
    for (const userID of data) {
        var currenciesData = await Currencies.getData(userID)
        if (currenciesData != false) {
            var money = currenciesData.money;
            if (typeof money != "undefined") {
                money -= money;
                await Currencies.setData(userID, { money });
            }
        }
    }
    return api.sendMessage("Số money của thành viên nhóm đã được reset về mức 0 !", event.threadID);
}