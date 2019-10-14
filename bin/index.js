#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_extra_1 = __importDefault(require("fs-extra"));
//テンプレートパッケージの階層を確認
var packageLevel = false;
var packageName = "";
try {
    var selfPackage = JSON.parse(fs_extra_1.default.readFileSync("package.json").toString());
    packageName = selfPackage.name;
    if (packageName.charAt(0) === "@")
        packageLevel = true;
}
catch (_a) {
    console.error("Can't find package.json");
    process.exit(-1);
}
//ターゲットパスの設定
var targetPath = packageLevel ? "../../../" : "../../";
//パッケージに追加設定を合成する
var targetPackage;
try {
    targetPackage = JSON.parse(fs_extra_1.default.readFileSync(targetPath + "package.json").toString());
    //既に自身がインストール済みか確認
    if ((targetPackage.dependencies && targetPackage.dependencies[packageName]) ||
        (targetPackage.devDependencies &&
            targetPackage.devDependencies[packageName]))
        process.exit(0); //インストール済みなら終了
}
catch (_b) {
    console.error("Can't find package.json of target");
    process.exit(-1);
}
console.log("=============== Start:setup-template ===================");
try {
    var optionPackage = JSON.parse(fs_extra_1.default.readFileSync("options/package.json").toString());
    fs_extra_1.default.writeFileSync(targetPath + "package.json", JSON.stringify(__assign(__assign({}, targetPackage), optionPackage), null, "  "));
}
catch (_c) { }
//テンプレートのコピー
try {
    fs_extra_1.default.copySync(path_1.default.resolve("template"), targetPath, { overwrite: true });
}
catch (_d) { }
//終了時の処理
process.on("exit", function () {
    console.log("================ End:setup-template ====================");
    try {
        var message = fs_extra_1.default.readFileSync("options/message.txt");
        console.log(message);
    }
    catch (_a) { }
});
