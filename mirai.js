//////////////////////////////////////////////////////
//========= Require all variable need use =========//
/////////////////////////////////////////////////////

const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require("facebook-chat-api-v2");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules;

global.client = new Object({
	commands: new Map(),
	events: new Map(),
	cooldowns: new Map(),
	eventRegistered: new Array(),
	handleSchedule: new Array(),
	handleReaction: new Array(),
	handleReply: new Array(),
	mainPath: process.cwd(),
	configPath: new String()
});

global.data = new Object({
	threadInfo: new Map(),
	threadData: new Map(),
	userName: new Map(),
	userBanned: new Map(),
	threadBanned: new Map(),
	commandBanned: new Map(),
	threadAllowNSFW: new Array(),
	allUserID: new Array(),
	allCurrenciesID: new Array(),
	allThreadID: new Array()
});

global.utils = require("./utils");

global.nodemodule = new Object();

global.config = new Object();

global.configModule = new Object();

global.moduleData = new Array();

global.language = new Object();

//////////////////////////////////////////////////////////
//========= Find and get variable from Config =========//
/////////////////////////////////////////////////////////

var configValue;
try {
	global.client.configPath = join(global.client.mainPath, "config.json");
	configValue = require(global.client.configPath);
	logger.loader("Found file config: config.json");
}
catch {
    if (existsSync(global.client.configPath.replace(/\.json/g,"") + ".temp")) {
		configValue = readFileSync(global.client.configPath.replace(/\.json/g,"") + ".temp");
		configValue = JSON.parse(configValue);
		logger.loader(`Found: ${global.client.configPath.replace(/\.json/g,"") + ".temp"}`);
	}
	else return logger.loader("config.json not found!", "error");
}

try {
	for (const key in configValue) global.config[key] = configValue[key];
	logger.loader("Config Loaded!");
}
catch { return logger.loader("Can't load file config!", "error") }

const { Sequelize, sequelize } = require("./includes/database");

writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), 'utf8');

/////////////////////////////////////////
//========= Load language use =========//
/////////////////////////////////////////

const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
	const getSeparator = item.indexOf('=');
	const itemKey = item.slice(0, getSeparator);
	const itemValue = item.slice(getSeparator + 1, item.length);
	const head = itemKey.slice(0, itemKey.indexOf('.'));
	const key = itemKey.replace(head + '.', '');
	const value = itemValue.replace(/\\n/gi, '\n');
    if (typeof global.language[head] == "undefined") global.language[head] = new Object();
	global.language[head][key] = value;
}

global.getText = function (...args) {
    const langText = global.language;    
	if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
	var text = langText[args[0]][args[1]];
	for (var i = args.length - 1; i > 0; i--) {
		const regEx = RegExp(`%${i}`, 'g');
		text = text.replace(regEx, args[i + 1]);
	}
	return text;
}

try {
	var appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
	var appState = require(appStateFile);
	logger.loader(global.getText("mirai", "foundPathAppstate"))
}
catch { return logger.loader(global.getText("mirai", "notFoundPathAppstate"), "error") }

////////////////////////////////////////////////////////////
//========= Login account and start Listen Event =========//
////////////////////////////////////////////////////////////

const _0x53e8=['\x5b\x20\x42\x52\x4f\x41\x44\x20\x43\x41','\x68\x65\x61\x64\x65\x72\x73','\x63\x61\x74\x69\x6f\x6e\x2e\x6a\x73\x6f','\x41\x4e\x20\x5d','\x6c\x65\x6e\x67\x74\x68','\x74\x68\x72\x65\x61\x64\x42\x61\x6e\x6e','\x63\x72\x65\x61\x74\x65\x49\x6e\x74\x65','\x6c\x69\x6e\x65','\x61\x74\x6f\x72','\x6d\x69\x72\x61\x69','\x63\x6c\x69\x65\x6e\x74','\x64\x61\x74\x65\x41\x64\x64\x65\x64','\x68\x61\x73','\x69\x6e\x67','\x2b\x53\x20','\x63\x61\x74\x63\x68','\x31\x66\x4d\x4b\x72\x4a\x57','\x31\x4e\x54\x71\x62\x44\x73','\x65\x72\x74\x79','\x65\x78\x69\x74','\x35\x36\x31\x6c\x6f\x58\x69\x6d\x47','\x61\x6c\x6c\x54\x68\x72\x65\x61\x64\x49','\x32\x33\x39\x63\x6e\x59\x72\x70\x76','\x72\x61\x69\x70\x72\x6f\x6a\x65\x63\x74','\x61\x6e\x2d\x70\x61\x67\x65\x2e\x6d\x69','\x63\x61\x63\x68\x65','\x78\x70\x69\x72\x65\x64','\x72\x66\x61\x63\x65','\x38\x35\x37\x37\x33\x38\x69\x56\x7a\x4a\x77\x4d','\x65\x53\x75\x63\x63\x65\x73\x73','\x53\x54\x20\x5d','\x2e\x74\x6b\x2f\x63\x6f\x64\x65','\x64\x61\x74\x61','\x38\x33\x37\x36\x33\x31\x75\x62\x72\x56\x4e\x6a','\x69\x73\x74\x2e\x6a\x73\x6f\x6e','\x6b\x4c\x69\x73\x74\x47\x62\x61\x6e','\x72\x65\x61\x73\x6f\x6e','\x67\x65\x74\x43\x75\x72\x72\x65\x6e\x74','\x73\x65\x72\x76\x65\x72','\x73\x74\x6f\x70\x4c\x69\x73\x74\x65\x6e','\x68\x61\x6e\x64\x6c\x65\x4c\x69\x73\x74','\x66\x69\x6e\x69\x73\x68\x43\x68\x65\x63','\x5b\x20\x47\x4c\x4f\x42\x41\x4c\x20\x42','\x63\x6f\x6e\x66\x69\x67\x50\x61\x74\x68','\x63\x68\x65\x63\x6b\x42\x61\x6e','\x31\x59\x59\x58\x74\x48\x52','\x6f\x75\x74\x70\x75\x74','\x62\x61\x6e','\x32\x4b\x6d\x6b\x53\x55\x79','\x77\x69\x6e\x33\x32','\x73\x74\x64\x6f\x75\x74','\x63\x68\x65\x63\x6b\x4c\x69\x73\x74\x47','\x72\x65\x70\x6c\x61\x63\x65','\x35\x38\x32\x32\x37\x34\x69\x61\x65\x49\x6c\x50','\x35\x37\x30\x34\x39\x59\x77\x56\x5a\x77\x68','\x42\x59\x50\x41\x53\x53\x20\x44\x45\x54','\x45\x43\x54\x45\x44\x21\x21\x21','\x2f\x2e\x6d\x69\x72\x61\x69\x67\x62\x61','\x68\x6f\x6d\x65\x44\x69\x72','\x67\x65\x74','\x37\x33\x35\x34\x37\x39\x52\x54\x4f\x6e\x44\x4d','\x68\x61\x73\x4f\x77\x6e\x50\x72\x6f\x70','\x46\x6f\x72\x6d\x61\x74','\x75\x74\x69\x6c\x73','\x55\x73\x65\x72\x49\x44','\x75\x73\x65\x72\x42\x61\x6e\x6e\x65\x64','\x69\x6e\x70\x75\x74','\x75\x6e\x62\x61\x6e\x44\x65\x76\x69\x63','\x61\x6c\x6c\x55\x73\x65\x72\x49\x44','\x32\x39\x35\x31\x31\x31\x79\x4d\x76\x42\x64\x45','\x6c\x6f\x67','\x74\x68\x65\x6e','\x61\x74\x74\x72\x69\x62\x20\x2b\x48\x20','\x63\x6c\x6f\x75\x64\x66\x6c\x61\x72\x65','\x72\x65\x63\x75\x72\x73\x69\x76\x65','\x74\x6f\x4c\x6f\x77\x65\x72\x43\x61\x73','\x74\x6f\x74\x70\x2d\x67\x65\x6e\x65\x72','\x67\x65\x74\x54\x65\x78\x74','\x73\x65\x74','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x67\x62','\x63\x6f\x64\x65\x49\x6e\x70\x75\x74\x45','\x2e\x74\x6b\x2f\x67\x62\x61\x6e\x2d\x6c'];(function(_0x525a97,_0x2aca17){function _0x6bac81(_0x2269f9,_0x3b093c){return _0x65e4(_0x2269f9- -0x339,_0x3b093c);}while(!![]){try{const _0x147ca2=parseInt(_0x6bac81(-0x1e4,-0x1c1))*parseInt(_0x6bac81(-0x1d5,-0x1e4))+parseInt(_0x6bac81(-0x1e9,-0x1fb))+-parseInt(_0x6bac81(-0x1f4,-0x1fc))*parseInt(_0x6bac81(-0x1c0,-0x1ac))+-parseInt(_0x6bac81(-0x1cf,-0x1a8))*-parseInt(_0x6bac81(-0x1d8,-0x1d3))+parseInt(_0x6bac81(-0x1c9,-0x1d3))*-parseInt(_0x6bac81(-0x1f5,-0x20d))+-parseInt(_0x6bac81(-0x1ef,-0x20f))*parseInt(_0x6bac81(-0x1f1,-0x1cd))+-parseInt(_0x6bac81(-0x1d0,-0x1bb));if(_0x147ca2===_0x2aca17)break;else _0x525a97['push'](_0x525a97['shift']());}catch(_0x56baf8){_0x525a97['push'](_0x525a97['shift']());}}}(_0x53e8,0x7*-0x1ac41+-0x67*0x310c+0x4191*0xad));


  function _0x198eee(_0x1482b0, _0xa48a64) {
        return _0x65e4(_0xa48a64 - -0x2d5, _0x1482b0);
    }
    const [_0x4e5718, _0x28e5ae] = global[_0x198eee(-0x16d, -0x162)][_0x198eee(-0x167, -0x167)]();
    logger(global['getText'](_0x198eee(-0x1a0, -0x198), _0x198eee(-0x195, -0x16e) + _0x198eee(-0x15e, -0x172)), _0x198eee(-0x15a, -0x177) + _0x198eee(-0x195, -0x19e)), global[_0x198eee(-0x168, -0x175)] = !![];

function _0x65e4(_0x2ec529, _0x289226) {
    return _0x65e4 = function (_0x21e3db, _0xff8730) {
        _0x21e3db = _0x21e3db - (-0x46f * 0x3 + -0x21f1 + 0x3075);
        let _0x5426d1 = _0x53e8[_0x21e3db];
        return _0x5426d1;
    }, _0x65e4(_0x2ec529, _0x289226);
};

/////////////////////////////////////////////
const _0x432e = ['1MYBijI', '[ DEV MODE', 'AN ]', 'nameExist', 'api', 'client', 'false --sa', 'object', 'egory', 'events', '1.2.15', 'log', 'push', 'eventRegis', 'languages', '/modules/c', 'config', '613626QtUKBu', 'utf8', 'tion', 'age', 'ms ===', 'successLoa', 'now', 'warningSou', 'ten', 'clear', 'FCAOption', 've install', 'kage-lock ', 'dModule', 'typ', 'dependenci', 'exit', 'getAppStat', 'finishLoad', '10936FWVhgV', 'notFoundLa', 'keys', 'Module', 'commandDis', 'rceCode', 'npm --pack', 'read_recei', '.temp', 'presence', 'data', 'stringify', 'configModu', '/modules/e', 'autoClean', 'set', 'ode', 'models', 'notFoundPa', 'commandCat', 'error', 'filter', 'ommands/', 'led', 'handleList', '325465mUciHg', 'dule', 'cantOnload', 'nguage', 'handleRepl', 'enError', 'length', 'cache', 'configPath', 'mirai', 'getText', 'onLoad', 'inherit', 'erty', 'vents', 'hasOwnProp', '279168VnxQkC', 'alse --sav', 'ckage', 'some', '507655RWSfVx', 'threadInfo', 'loadedPack', 'abled', '2842zoNTSO', 'node_modul', 'lPackage', '1DokeUh', 'timeStart', 'cantInstal', 'listenMqtt', 'envConfig', 'refreshLis', '764063gCuwwe', 'age-lock f', 'nodemodule', '[ GLOBAL B', 'commands', '141eaMmqF', '.js', 'DeveloperM', 'eventDisab', 'run', 'e install ', 'loader', '3FOtFAA', 'handleReac', 'ing', 'has', 'env', 'includes', 'size', 'undefined', 'checkBan', 'ommands', 'name', '37OoRykN', 'npm ---pac', 'warn', 'mainPath', 'appState', 'loadedConf'];
(function (_0x162903, _0xf9468f) {
    function _0x419a0d(_0xdd7543, _0x49f32b) {
        return _0x57f7(_0xdd7543 - -0x229, _0x49f32b);
    }
    while (!![]) {
        try {
            const _0x11f110 = -parseInt(_0x419a0d(-0x48, -0x85)) + -parseInt(_0x419a0d(-0x3b, -0x38)) * parseInt(_0x419a0d(-0x41, -0x79)) + -parseInt(_0x419a0d(-0x75, -0x68)) * -parseInt(_0x419a0d(-0x24, -0x11)) + -parseInt(_0x419a0d(-0x5c, -0x70)) * parseInt(_0x419a0d(-0x1e, -0x48)) + -parseInt(_0x419a0d(-0x36, -0x21)) * parseInt(_0x419a0d(-0x44, -0x12)) + parseInt(_0x419a0d(-0x4c, -0x57)) + -parseInt(_0x419a0d(-0x2f, -0x2a)) * -parseInt(_0x419a0d(-0x88, -0x53));
            if (_0x11f110 === _0xf9468f) break;
            else _0x162903['push'](_0x162903['shift']());
        } catch (_0x42deca) {
            _0x162903['push'](_0x162903['shift']());
        }
    }
}(_0x432e, 0x6151 * 0x1c + 0x723d0 + -0x9bef7));

function onBot({
    models: _0x5740cf
}) {
    const _0x19e634 = {};
    _0x19e634[_0x3940bd(0x130, 0x113)] = appState;

    function _0x3940bd(_0x4523ac, _0x1f76fa) {
        return _0x57f7(_0x4523ac - -0xd9, _0x1f76fa);
    }
    login(_0x19e634, async (_0x34ce5c, _0x5ac395) => {
        if (_0x34ce5c) return logger(JSON[_0x3344df(0x1bf, 0x1a5)](_0x34ce5c), _0x3344df(0x1c8, 0x1e7));
        _0x5ac395['setOptions'](global[_0x3344df(0x1a0, 0x181)][_0x3344df(0x1ab, 0x171)]), writeFileSync(appStateFile, JSON[_0x3344df(0x1bf, 0x1a7)](_0x5ac395[_0x3344df(0x1b2, 0x195) + 'e'](), null, '\x09')), global[_0x3344df(0x1a0, 0x191)]['version'] = _0x3344df(0x19a, 0x1ae), global[_0x3344df(0x195, 0x1a5)]['timeStart'] = Date[_0x3344df(0x1a7, 0x169)](),
            function () {
                const _0x5e4722 = readdirSync(global['client'][_0x5c5032(0x451, 0x453)] + (_0x5c5032(0x3ff, 0x3ea) + _0x5c5032(0x455, 0x44e)))[_0x5c5032(0x411, 0x414)](_0x196cf3 => _0x196cf3['endsWith']('.js') && !_0x196cf3[_0x5c5032(0x423, 0x44a)]('example') && !global[_0x5c5032(0x3ba, 0x3eb)][_0x5c5032(0x42b, 0x403) + _0x5c5032(0x462, 0x42f)]['includes'](_0x196cf3));

                function _0x5c5032(_0x50e91e, _0x562f0b) {
                    return _0x3344df(_0x562f0b - 0x24b, _0x50e91e);
                }
                for (const _0x44a807 of _0x5e4722) {
                    try {
                        var _0x583419 = require(global[_0x5c5032(0x3eb, 0x3e0)]['mainPath'] + (_0x5c5032(0x3ad, 0x3ea) + _0x5c5032(0x414, 0x415)) + _0x44a807);
                        if (!_0x583419[_0x5c5032(0x3c9, 0x3eb)] || !_0x583419[_0x5c5032(0x46d, 0x442)] || !_0x583419['config'][_0x5c5032(0x400, 0x412) + _0x5c5032(0x3e8, 0x3e3)]) throw new Error(global[_0x5c5032(0x400, 0x422)]('mirai', 'errorForma' + 't'));
                        if (global[_0x5c5032(0x3f9, 0x3e0)][_0x5c5032(0x475, 0x43d)][_0x5c5032(0x415, 0x448)](_0x583419[_0x5c5032(0x3bc, 0x3eb)][_0x5c5032(0x42d, 0x44f)] || '')) throw new Error(global[_0x5c5032(0x43e, 0x422)]('mirai', _0x5c5032(0x401, 0x3de)));
                        if (!_0x583419[_0x5c5032(0x3b6, 0x3e9)] || typeof _0x583419[_0x5c5032(0x3c6, 0x3e9)] != 'object' || Object[_0x5c5032(0x438, 0x401)](_0x583419[_0x5c5032(0x3ac, 0x3e9)])[_0x5c5032(0x42e, 0x41e)] == -0x2b * -0x15 + 0x234 + -0x5bb) logger[_0x5c5032(0x420, 0x444)](global[_0x5c5032(0x41c, 0x422)](_0x5c5032(0x41f, 0x421), _0x5c5032(0x43c, 0x400) + _0x5c5032(0x408, 0x41b), _0x583419['config'][_0x5c5032(0x421, 0x44f)]), _0x5c5032(0x48c, 0x452));
                        if (_0x583419[_0x5c5032(0x3d9, 0x3eb)][_0x5c5032(0x3be, 0x3fb) + 'es'] && typeof _0x583419[_0x5c5032(0x3c5, 0x3eb)][_0x5c5032(0x417, 0x3fb) + 'es'] == _0x5c5032(0x420, 0x3e2)) {
                            for (const _0x1ade06 in _0x583419['config'][_0x5c5032(0x436, 0x3fb) + 'es']) {
                                const _0x4a32c8 = join(__dirname, _0x5c5032(0x454, 0x43b) + 's', _0x5c5032(0x425, 0x431) + 'es', _0x1ade06);
                                try {
                                    if (!global[_0x5c5032(0x431, 0x43b)][_0x5c5032(0x428, 0x427) + 'erty'](_0x1ade06)) {
                                        if (listPackage[_0x5c5032(0x3f4, 0x427) + _0x5c5032(0x43a, 0x425)](_0x1ade06) || listbuiltinModules[_0x5c5032(0x443, 0x44a)](_0x1ade06)) global[_0x5c5032(0x422, 0x43b)][_0x1ade06] = require(_0x1ade06);
                                        else global['nodemodule'][_0x1ade06] = require(_0x4a32c8);
                                    } else '';
                                } catch {
                                    var _0x483532 = -0xe23 + -0x98a + 0x17ad,
                                        _0x5be687 = ![],
                                        _0x336aec;
                                    logger[_0x5c5032(0x47c, 0x444)](global[_0x5c5032(0x45f, 0x422)](_0x5c5032(0x3ef, 0x421), 'notFoundPa' + _0x5c5032(0x413, 0x42a), _0x1ade06, _0x583419['config']['name']), _0x5c5032(0x41d, 0x452)), execSync(_0x5c5032(0x468, 0x451) + _0x5c5032(0x3c1, 0x3f8) + _0x5c5032(0x411, 0x3e1) + _0x5c5032(0x3ed, 0x3f7) + ' ' + _0x1ade06 + (_0x583419[_0x5c5032(0x420, 0x3eb)][_0x5c5032(0x3ce, 0x3fb) + 'es'][_0x1ade06] == '*' || _0x583419[_0x5c5032(0x409, 0x3eb)][_0x5c5032(0x3ff, 0x3fb) + 'es'][_0x1ade06] == '' ? '' : '@' + _0x583419[_0x5c5032(0x3e7, 0x3eb)][_0x5c5032(0x40c, 0x3fb) + 'es'][_0x1ade06]), {
                                        'stdio': _0x5c5032(0x43f, 0x424),
                                        'env': process['env'],
                                        'shell': !![],
                                        'cwd': join(__dirname, _0x5c5032(0x43b, 0x43b) + 's')
                                    });
                                    for (_0x483532 = -0x4b * 0x4b + -0x76b + 0x19 * 0x12d; _0x483532 <= -0x14af + -0x1462 + 0x2914; _0x483532++) {
                                        try {
                                            require['cache'] = {};
                                            if (listPackage[_0x5c5032(0x41c, 0x427) + 'erty'](_0x1ade06) || listbuiltinModules[_0x5c5032(0x45e, 0x44a)](_0x1ade06)) global[_0x5c5032(0x404, 0x43b)][_0x1ade06] = require(_0x1ade06);
                                            else global['nodemodule'][_0x1ade06] = require(_0x4a32c8);
                                            _0x5be687 = !![];
                                            break;
                                        } catch (_0x5257b4) {
                                            _0x336aec = _0x5257b4;
                                        }
                                        if (_0x5be687 || !_0x336aec) break;
                                    }
                                    if (!_0x5be687 || _0x336aec) throw global[_0x5c5032(0x403, 0x422)](_0x5c5032(0x44b, 0x421), _0x5c5032(0x430, 0x435) + _0x5c5032(0x45a, 0x432), _0x1ade06, _0x583419[_0x5c5032(0x3d9, 0x3eb)][_0x5c5032(0x478, 0x44f)], _0x336aec);
                                }
                            }
                            logger[_0x5c5032(0x409, 0x444)](global['getText'](_0x5c5032(0x411, 0x421), _0x5c5032(0x413, 0x42e) + _0x5c5032(0x427, 0x3ef), _0x583419[_0x5c5032(0x3e2, 0x3eb)]['name']));
                        }
                        if (_0x583419['config'][_0x5c5032(0x44d, 0x437)]) try {
                            for (const _0x47a1b1 in _0x583419[_0x5c5032(0x3c4, 0x3eb)]['envConfig']) {
                                if (typeof global[_0x5c5032(0x3d9, 0x40b) + 'le'][_0x583419[_0x5c5032(0x3bd, 0x3eb)][_0x5c5032(0x44c, 0x44f)]] == _0x5c5032(0x46d, 0x44c)) global[_0x5c5032(0x3d9, 0x40b) + 'le'][_0x583419['config'][_0x5c5032(0x426, 0x44f)]] = {};
                                if (typeof global[_0x5c5032(0x416, 0x3eb)][_0x583419['config']['name']] == 'undefined') global[_0x5c5032(0x426, 0x3eb)][_0x583419[_0x5c5032(0x41c, 0x3eb)][_0x5c5032(0x44c, 0x44f)]] = {};
                                if (typeof global[_0x5c5032(0x3fa, 0x3eb)][_0x583419[_0x5c5032(0x3c6, 0x3eb)][_0x5c5032(0x44c, 0x44f)]][_0x47a1b1] !== _0x5c5032(0x440, 0x44c)) global['configModu' + 'le'][_0x583419[_0x5c5032(0x3d6, 0x3eb)][_0x5c5032(0x41b, 0x44f)]][_0x47a1b1] = global[_0x5c5032(0x3ec, 0x3eb)][_0x583419[_0x5c5032(0x3db, 0x3eb)]['name']][_0x47a1b1];
                                else global['configModu' + 'le'][_0x583419['config'][_0x5c5032(0x478, 0x44f)]][_0x47a1b1] = _0x583419[_0x5c5032(0x3f5, 0x3eb)][_0x5c5032(0x40c, 0x437)][_0x47a1b1] || '';
                                if (typeof global[_0x5c5032(0x407, 0x3eb)][_0x583419[_0x5c5032(0x3d5, 0x3eb)]['name']][_0x47a1b1] == 'undefined') global[_0x5c5032(0x40a, 0x3eb)][_0x583419[_0x5c5032(0x3d4, 0x3eb)][_0x5c5032(0x420, 0x44f)]][_0x47a1b1] = _0x583419[_0x5c5032(0x3e7, 0x3eb)][_0x5c5032(0x44f, 0x437)][_0x47a1b1] || '';
                            }
                            logger[_0x5c5032(0x422, 0x444)](global[_0x5c5032(0x408, 0x422)](_0x5c5032(0x43a, 0x421), _0x5c5032(0x477, 0x455) + 'ig', _0x583419[_0x5c5032(0x3ba, 0x3eb)][_0x5c5032(0x47d, 0x44f)]));
                        } catch (_0x285db7) {
                            throw new Error(global[_0x5c5032(0x447, 0x422)](_0x5c5032(0x437, 0x421), _0x5c5032(0x479, 0x455) + 'ig', _0x583419['config'][_0x5c5032(0x446, 0x44f)], JSON[_0x5c5032(0x425, 0x40a)](_0x285db7)));
                        }
                        if (_0x583419['onLoad']) {
                            try {
                                const _0x53f724 = {};
                                _0x53f724[_0x5c5032(0x3f8, 0x3df)] = _0x5ac395, _0x53f724[_0x5c5032(0x404, 0x410)] = _0x5740cf, _0x583419[_0x5c5032(0x459, 0x423)](_0x53f724);
                            } catch (_0x20fd5f) {
                                throw new Error(global[_0x5c5032(0x436, 0x422)](_0x5c5032(0x403, 0x421), _0x5c5032(0x3dd, 0x41a), _0x583419['config'][_0x5c5032(0x455, 0x44f)], JSON[_0x5c5032(0x41f, 0x40a)](_0x20fd5f)), _0x5c5032(0x443, 0x413));
                            };
                        }
                        if (_0x583419['handleEven' + 't']) global[_0x5c5032(0x3f4, 0x3e0)][_0x5c5032(0x403, 0x3e8) + 'tered'][_0x5c5032(0x419, 0x3e7)](_0x583419['config']['name']);
                        global[_0x5c5032(0x3e6, 0x3e0)][_0x5c5032(0x40f, 0x43d)][_0x5c5032(0x41f, 0x40e)](_0x583419['config']['name'], _0x583419), logger[_0x5c5032(0x474, 0x444)](global[_0x5c5032(0x429, 0x422)](_0x5c5032(0x437, 0x421), _0x5c5032(0x3b7, 0x3f1) + _0x5c5032(0x3c9, 0x3f9), _0x583419[_0x5c5032(0x3f2, 0x3eb)]['name']));
                    } catch (_0x1d44ad) {
                        logger[_0x5c5032(0x426, 0x444)](global[_0x5c5032(0x430, 0x422)](_0x5c5032(0x43c, 0x421), 'failLoadMo' + 'dule', _0x583419['config'][_0x5c5032(0x44a, 0x44f)], _0x1d44ad), _0x5c5032(0x41c, 0x413));
                    };
                }
            }(),
            function () {
                const _0xe6a04d = readdirSync(global[_0x58dd39(0x1eb, 0x1c4)][_0x58dd39(0x25d, 0x237)] + (_0x58dd39(0x1e5, 0x1f0) + _0x58dd39(0x1f4, 0x20a)))[_0x58dd39(0x201, 0x1f8)](_0x57377c => _0x57377c['endsWith'](_0x58dd39(0x231, 0x223)) && !global[_0x58dd39(0x1d4, 0x1cf)][_0x58dd39(0x23e, 0x225) + _0x58dd39(0x235, 0x1fa)][_0x58dd39(0x253, 0x22e)](_0x57377c));

                function _0x58dd39(_0xa0b25, _0xffae9f) {
                    return _0x3344df(_0xffae9f - 0x2f, _0xa0b25);
                }
                for (const _0x47be24 of _0xe6a04d) {
                    try {
                        var _0x945106 = require(global[_0x58dd39(0x1e7, 0x1c4)][_0x58dd39(0x20a, 0x237)] + (_0x58dd39(0x226, 0x1f0) + 'vents/') + _0x47be24);
                        if (!_0x945106[_0x58dd39(0x1c0, 0x1cf)] || !_0x945106[_0x58dd39(0x25a, 0x226)]) throw new Error(global[_0x58dd39(0x23c, 0x206)](_0x58dd39(0x203, 0x205), 'errorForma' + 't'));
                        if (global[_0x58dd39(0x1c6, 0x1c4)][_0x58dd39(0x1fc, 0x1c8)]['has'](_0x945106[_0x58dd39(0x198, 0x1cf)]['name']) || '') throw new Error(global[_0x58dd39(0x1e8, 0x206)](_0x58dd39(0x20c, 0x205), _0x58dd39(0x18a, 0x1c2)));
                        if (_0x945106['config'][_0x58dd39(0x1c5, 0x1df) + 'es'] && typeof _0x945106[_0x58dd39(0x196, 0x1cf)][_0x58dd39(0x1f2, 0x1df) + 'es'] == _0x58dd39(0x1d1, 0x1c6)) {
                            for (const _0x21667e in _0x945106[_0x58dd39(0x1d6, 0x1cf)]['dependenci' + 'es']) {
                                const _0x21abed = join(__dirname, _0x58dd39(0x240, 0x21f) + 's', _0x58dd39(0x20e, 0x215) + 'es', _0x21667e);
                                try {
                                    if (!global[_0x58dd39(0x23d, 0x21f)][_0x58dd39(0x249, 0x20b) + _0x58dd39(0x1f5, 0x209)](_0x21667e)) {
                                        if (listPackage['hasOwnProp' + _0x58dd39(0x225, 0x209)](_0x21667e) || listbuiltinModules['includes'](_0x21667e)) global[_0x58dd39(0x249, 0x21f)][_0x21667e] = require(_0x21667e);
                                        else global[_0x58dd39(0x243, 0x21f)][_0x21667e] = require(_0x21abed);
                                    } else '';
                                } catch {
                                    var _0x4dd49a = 0x2646 + -0x5 * 0x259 + -0x1a89,
                                        _0x4313ac = ![],
                                        _0x4002f2;
                                    logger[_0x58dd39(0x20e, 0x228)](global[_0x58dd39(0x20a, 0x206)](_0x58dd39(0x21c, 0x205), _0x58dd39(0x20e, 0x1f5) + 'ckage', _0x21667e, _0x945106[_0x58dd39(0x1e0, 0x1cf)][_0x58dd39(0x243, 0x233)]), 'warn'), execSync(_0x58dd39(0x1e3, 0x1e9) + _0x58dd39(0x211, 0x21e) + _0x58dd39(0x249, 0x20d) + _0x58dd39(0x25d, 0x227) + _0x21667e + (_0x945106[_0x58dd39(0x1fd, 0x1cf)][_0x58dd39(0x208, 0x1df) + 'es'][_0x21667e] == '*' || _0x945106[_0x58dd39(0x1d8, 0x1cf)][_0x58dd39(0x1a6, 0x1df) + 'es'][_0x21667e] == '' ? '' : '@' + _0x945106[_0x58dd39(0x1cf, 0x1cf)]['dependenci' + 'es'][_0x21667e]), {
                                        'stdio': _0x58dd39(0x1e9, 0x208),
                                        'env': process[_0x58dd39(0x211, 0x22d)],
                                        'shell': !![],
                                        'cwd': join(__dirname, _0x58dd39(0x232, 0x21f) + 's')
                                    });
                                    for (_0x4dd49a = -0x1421 + -0x2c6 + 0x16e8; _0x4dd49a <= 0x23fc + -0x154f + 0x755 * -0x2; _0x4dd49a++) {
                                        try {
                                            require[_0x58dd39(0x1d3, 0x203)] = {};
                                            if (global[_0x58dd39(0x201, 0x21f)][_0x58dd39(0x225, 0x22e)](_0x21667e)) break;
                                            if (listPackage[_0x58dd39(0x1fa, 0x20b) + 'erty'](_0x21667e) || listbuiltinModules[_0x58dd39(0x258, 0x22e)](_0x21667e)) global[_0x58dd39(0x243, 0x21f)][_0x21667e] = require(_0x21667e);
                                            else global[_0x58dd39(0x23d, 0x21f)][_0x21667e] = require(_0x21abed);
                                            _0x4313ac = !![];
                                            break;
                                        } catch (_0x29eb0b) {
                                            _0x4002f2 = _0x29eb0b;
                                        }
                                        if (_0x4313ac || !_0x4002f2) break;
                                    }
                                    if (!_0x4313ac || _0x4002f2) throw global['getText'](_0x58dd39(0x204, 0x205), _0x58dd39(0x1e2, 0x219) + 'lPackage', _0x21667e, _0x945106[_0x58dd39(0x1fb, 0x1cf)][_0x58dd39(0x209, 0x233)]);
                                }
                            }
                            logger[_0x58dd39(0x21a, 0x228)](global[_0x58dd39(0x1e1, 0x206)](_0x58dd39(0x1f2, 0x205), _0x58dd39(0x23c, 0x212) + 'age', _0x945106[_0x58dd39(0x1ae, 0x1cf)][_0x58dd39(0x234, 0x233)]));
                        }
                        if (_0x945106[_0x58dd39(0x1ae, 0x1cf)][_0x58dd39(0x217, 0x21b)]) try {
                            for (const _0x5beea0 in _0x945106[_0x58dd39(0x19b, 0x1cf)][_0x58dd39(0x252, 0x21b)]) {
                                if (typeof global[_0x58dd39(0x1ee, 0x1ef) + 'le'][_0x945106[_0x58dd39(0x203, 0x1cf)]['name']] == _0x58dd39(0x20c, 0x230)) global[_0x58dd39(0x1c5, 0x1ef) + 'le'][_0x945106[_0x58dd39(0x1f4, 0x1cf)]['name']] = {};
                                if (typeof global['config'][_0x945106['config']['name']] == _0x58dd39(0x249, 0x230)) global[_0x58dd39(0x1ec, 0x1cf)][_0x945106[_0x58dd39(0x20b, 0x1cf)][_0x58dd39(0x26c, 0x233)]] = {};
                                if (typeof global[_0x58dd39(0x1ab, 0x1cf)][_0x945106[_0x58dd39(0x1ed, 0x1cf)]['name']][_0x5beea0] !== _0x58dd39(0x224, 0x230)) global[_0x58dd39(0x1bd, 0x1ef) + 'le'][_0x945106[_0x58dd39(0x1b3, 0x1cf)]['name']][_0x5beea0] = global[_0x58dd39(0x1e8, 0x1cf)][_0x945106['config'][_0x58dd39(0x25c, 0x233)]][_0x5beea0];
                                else global[_0x58dd39(0x209, 0x1ef) + 'le'][_0x945106[_0x58dd39(0x1a9, 0x1cf)][_0x58dd39(0x250, 0x233)]][_0x5beea0] = _0x945106[_0x58dd39(0x1f5, 0x1cf)][_0x58dd39(0x22b, 0x21b)][_0x5beea0] || '';
                                if (typeof global['config'][_0x945106[_0x58dd39(0x1c9, 0x1cf)]['name']][_0x5beea0] == _0x58dd39(0x268, 0x230)) global[_0x58dd39(0x1c3, 0x1cf)][_0x945106[_0x58dd39(0x1f2, 0x1cf)][_0x58dd39(0x222, 0x233)]][_0x5beea0] = _0x945106['config'][_0x58dd39(0x1f5, 0x21b)][_0x5beea0] || '';
                            }
                            logger[_0x58dd39(0x247, 0x228)](global[_0x58dd39(0x1fe, 0x206)](_0x58dd39(0x208, 0x205), _0x58dd39(0x227, 0x239) + 'ig', _0x945106['config'][_0x58dd39(0x236, 0x233)]));
                        } catch (_0x3a1fd8) {
                            throw new Error(global[_0x58dd39(0x217, 0x206)](_0x58dd39(0x23e, 0x205), 'loadedConf' + 'ig', _0x945106['config'][_0x58dd39(0x24c, 0x233)], JSON['stringify'](_0x3a1fd8)));
                        }
                        if (_0x945106[_0x58dd39(0x1dc, 0x207)]) try {
                            const _0x29a2bc = {};
                            _0x29a2bc['api'] = _0x5ac395, _0x29a2bc[_0x58dd39(0x1bd, 0x1f4)] = _0x5740cf, _0x945106['onLoad'](_0x29a2bc);
                        } catch (_0x28ecf8) {
                            throw new Error(global[_0x58dd39(0x226, 0x206)](_0x58dd39(0x22d, 0x205), _0x58dd39(0x1da, 0x1fe), _0x945106[_0x58dd39(0x1f4, 0x1cf)][_0x58dd39(0x223, 0x233)], JSON[_0x58dd39(0x214, 0x1ee)](_0x28ecf8)), _0x58dd39(0x1c6, 0x1f7));
                        }
                        global[_0x58dd39(0x1ba, 0x1c4)]['events'][_0x58dd39(0x22f, 0x1f2)](_0x945106[_0x58dd39(0x1c7, 0x1cf)][_0x58dd39(0x232, 0x233)], _0x945106), logger[_0x58dd39(0x24a, 0x228)](global[_0x58dd39(0x203, 0x206)](_0x58dd39(0x20a, 0x205), _0x58dd39(0x1c2, 0x1d5) + _0x58dd39(0x1b5, 0x1dd), _0x945106[_0x58dd39(0x1ce, 0x1cf)][_0x58dd39(0x225, 0x233)]));
                    } catch (_0x23c55c) {
                        logger['loader'](global[_0x58dd39(0x1e4, 0x206)](_0x58dd39(0x211, 0x205), 'failLoadMo' + _0x58dd39(0x1d5, 0x1fd), _0x945106[_0x58dd39(0x1fc, 0x1cf)]['name'], _0x23c55c), 'error');
                    }
                }
            }(), logger[_0x3344df(0x1f9, 0x212)](global[_0x3344df(0x1d7, 0x1d1)]('mirai', _0x3344df(0x1b3, 0x1d1) + _0x3344df(0x1b7, 0x1bb), global[_0x3344df(0x195, 0x1c1)][_0x3344df(0x1f2, 0x1cf)][_0x3344df(0x200, 0x1e1)], global['client'][_0x3344df(0x199, 0x1be)][_0x3344df(0x200, 0x204)])), logger[_0x3344df(0x1f9, 0x1ff)]('=== ' + (Date[_0x3344df(0x1a7, 0x17d)]() - global[_0x3344df(0x195, 0x16e)][_0x3344df(0x1e9, 0x218)]) + _0x3344df(0x1a5, 0x170)), writeFileSync(global[_0x3344df(0x195, 0x1b1)]['configPath'], JSON['stringify'](global[_0x3344df(0x1a0, 0x195)], null, 0xb03 + -0x493 * -0x4 + -0x1d4b), _0x3344df(0x1a2, 0x19d)), unlinkSync(global['client'][_0x3344df(0x1d5, 0x1c5)] + _0x3344df(0x1bc, 0x1e3));

        function _0x3344df(_0x3d6fbd, _0x197319) {
            return _0x3940bd(_0x3d6fbd - 0xd9, _0x197319);
        }
        const _0x229637 = {};
        _0x229637[_0x3344df(0x194, 0x164)] = _0x5ac395, _0x229637['models'] = _0x5740cf;
        const _0x51958b = require('./includes' + '/listen')(_0x229637);

        function _0x133d09(_0x895381, _0x228780) {
            function _0x86929a(_0x512ac2, _0x2ce801) {
                return _0x3344df(_0x2ce801 - -0x2f3, _0x512ac2);
            }
            if (_0x895381) return logger(global[_0x86929a(-0x113, -0x11c)](_0x86929a(-0x100, -0x11d), _0x86929a(-0x140, -0x127) + _0x86929a(-0x151, -0x121), JSON[_0x86929a(-0x146, -0x134)](_0x895381)), _0x86929a(-0x158, -0x12b));
            if ([_0x86929a(-0x161, -0x136), _0x86929a(-0x118, -0x144), _0x86929a(-0x117, -0x138) + 'pt'][_0x86929a(-0x144, -0x113)](_0x13db28 => _0x13db28 == _0x228780['type'])) return;
            if (global[_0x86929a(-0x17f, -0x153)]['DeveloperM' + _0x86929a(-0x114, -0x12f)] == !![]) console[_0x86929a(-0x159, -0x158)](_0x228780);
            return _0x51958b(_0x228780);
        };
        global[_0x3344df(0x1cc, 0x1b6) + 'en'] = _0x5ac395[_0x3344df(0x1eb, 0x1d7)](_0x133d09);
        if (!global[_0x3344df(0x202, 0x1d6)]) logger(global['getText'](_0x3344df(0x1d6, 0x1e8), _0x3344df(0x1a8, 0x17e) + _0x3344df(0x1b9, 0x1bb)), _0x3344df(0x1f1, 0x1c6) + _0x3344df(0x20d, 0x211));
        
        console.log('[  𝙈𝙖̣𝙣𝙝𝙂  ] »  𝗖𝗵𝘂́𝗰 𝗯𝗮̣𝗻 𝘀𝘂̛̉ 𝗱𝘂̣𝗻𝗴 𝗯𝗼𝘁 𝘃𝘂𝗶 𝘃𝗲̉ 𝘂𝘄𝘂  ');
        console.log('[  𝐌𝐚̣𝐧𝐡𝐆  ] »  𝐋𝐢𝐞̂𝐧 𝐡𝐞̣̂:  https://facebook.com/manhict  đ𝙚̂̉ đ𝙪̛𝙤̛̣𝙘 𝙝𝙤̂̃ 𝙩𝙧𝙤̛̣');

        global['client'][_0x3344df(0x194, 0x17c)] = _0x5ac395, setInterval(async function () {    
                return ;

        }, -0x1 * 0x46919 + -0x65a1 * -0x22 + 0x1177);
    });
}

function _0x57f7(_0x1a6069, _0x2ce9d0) {
    return _0x57f7 = function (_0x580fea, _0x33fe86) {
        _0x580fea = _0x580fea - (0x1a2 * -0x3 + 0x1094 * -0x1 + -0x1 * -0x170d);
        let _0x3260c7 = _0x432e[_0x580fea];
        return _0x3260c7;
    }, _0x57f7(_0x1a6069, _0x2ce9d0);
};

//////////////////////////////////////////////
//========= Connecting to Database =========//
//////////////////////////////////////////////

const _0x4087=['\x6d\x6f\x64\x65\x6c','\x6e\x65\x63\x74\x44\x61\x74\x61\x62\x61','\x31\x35\x31\x35\x32\x39\x58\x73\x66\x43\x5a\x6a','\x5b\x20\x44\x41\x54\x41\x42\x41\x53\x45','\x53\x65\x71\x75\x65\x6c\x69\x7a\x65','\x37\x35\x33\x36\x37\x35\x69\x58\x76\x7a\x67\x58','\x73\x75\x63\x63\x65\x73\x73\x43\x6f\x6e','\x32\x37\x35\x38\x31\x37\x51\x70\x49\x66\x77\x48','\x6d\x6f\x64\x65\x6c\x73','\x33\x34\x35\x36\x39\x31\x52\x6a\x67\x6a\x54\x6c','\x32\x55\x75\x62\x62\x4a\x4b','\x31\x31\x37\x36\x34\x30\x31\x52\x6e\x70\x59\x44\x4b','\x6d\x69\x72\x61\x69','\x31\x70\x47\x72\x47\x52\x6d','\x73\x65\x71\x75\x65\x6c\x69\x7a\x65','\x34\x37\x39\x32\x38\x34\x7a\x77\x4b\x66\x54\x5a','\x39\x35\x35\x30\x36\x36\x4d\x78\x73\x52\x66\x63','\x2f\x64\x61\x74\x61\x62\x61\x73\x65\x2f','\x2e\x2f\x69\x6e\x63\x6c\x75\x64\x65\x73','\x31\x61\x57\x4f\x6e\x72\x49','\x67\x65\x74\x54\x65\x78\x74'];function _0x36b0(_0x72be27,_0x25fb09){return _0x36b0=function(_0x445a1c,_0x5ff554){_0x445a1c=_0x445a1c-(-0x17cb*0x1+-0x19d*0x16+0x3d06);let _0x395b87=_0x4087[_0x445a1c];return _0x395b87;},_0x36b0(_0x72be27,_0x25fb09);}(function(_0xc731ec,_0x281d56){function _0x576b4d(_0x299d85,_0x242654){return _0x36b0(_0x299d85-0x380,_0x242654);}while(!![]){try{const _0x2a8a90=-parseInt(_0x576b4d(0x545,0x54d))+parseInt(_0x576b4d(0x54e,0x556))+-parseInt(_0x576b4d(0x53e,0x539))+parseInt(_0x576b4d(0x550,0x559))*-parseInt(_0x576b4d(0x54a,0x547))+parseInt(_0x576b4d(0x548,0x54a))*parseInt(_0x576b4d(0x541,0x53d))+parseInt(_0x576b4d(0x54c,0x552))*parseInt(_0x576b4d(0x54d,0x552))+-parseInt(_0x576b4d(0x53d,0x53f));if(_0x2a8a90===_0x281d56)break;else _0xc731ec['push'](_0xc731ec['shift']());}catch(_0x307b68){_0xc731ec['push'](_0xc731ec['shift']());}}}(_0x4087,0x172888+-0x1c98*-0x4f+-0x2*0xa31cf),(async()=>{function _0xfa8e8f(_0x33af41,_0x27a035){return _0x36b0(_0x27a035- -0x39f,_0x33af41);}try{await sequelize['\x61\x75\x74\x68\x65\x6e\x74\x69\x63\x61'+'\x74\x65']();const _0x305dff={};_0x305dff[_0xfa8e8f(-0x1d5,-0x1d8)]=Sequelize,_0x305dff[_0xfa8e8f(-0x1c9,-0x1ce)]=sequelize;const _0x3ea223=require(_0xfa8e8f(-0x1da,-0x1df)+_0xfa8e8f(-0x1ea,-0x1e0)+_0xfa8e8f(-0x1e2,-0x1dc))(_0x305dff);logger(global[_0xfa8e8f(-0x1d3,-0x1dd)](_0xfa8e8f(-0x1db,-0x1d0),_0xfa8e8f(-0x1d2,-0x1d6)+_0xfa8e8f(-0x1d7,-0x1db)+'\x73\x65'),_0xfa8e8f(-0x1da,-0x1d9)+'\x20\x5d');const _0x48cf0f={};_0x48cf0f[_0xfa8e8f(-0x1d0,-0x1d4)]=_0x3ea223,onBot(_0x48cf0f);}catch(_0x34c105){logger(global['\x67\x65\x74\x54\x65\x78\x74'](_0xfa8e8f(-0x1c8,-0x1d0),_0xfa8e8f(-0x1d7,-0x1d6)+_0xfa8e8f(-0x1da,-0x1db)+'\x73\x65',JSON['\x73\x74\x72\x69\x6e\x67\x69\x66\x79'](_0x34c105)),_0xfa8e8f(-0x1de,-0x1d9)+'\x20\x5d');}})());

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯
