#!/usr/bin/env node
import path from "path";
import fs from "fs-extra";

//テンプレートパッケージの階層を確認
let packageLevel = false;
let packageName = "";
try {
  const selfPackage = JSON.parse(
    fs.readFileSync("package.json").toString()
  ) as { name: string };
  packageName = selfPackage.name;
  if (packageName.charAt(0) === "@") packageLevel = true;
} catch {
  console.error("Can't find package.json");
  process.exit(-1);
}

//ターゲットパスの設定
const targetPath = packageLevel ? "../../../" : "../../";

//パッケージに追加設定を合成する
let targetPackage;
try {
  targetPackage = JSON.parse(
    fs.readFileSync(targetPath + "package.json").toString()
  ) as {
    dependencies?: { [key: string]: string };
    devDependencies?: { [key: string]: string };
  };
  //既に自身がインストール済みか確認
  if (
    (targetPackage.dependencies && targetPackage.dependencies[packageName]) ||
    (targetPackage.devDependencies &&
      targetPackage.devDependencies[packageName])
  )
    process.exit(0);  //インストール済みなら終了
} catch {
  console.error("Can't find package.json of target");
  process.exit(-1);
}
console.log("=============== Start:setup-template ===================");
try {
  const optionPackage = JSON.parse(
    fs.readFileSync("options/package.json").toString()
  );
  fs.writeFileSync(
    targetPath + "package.json",
    JSON.stringify({ ...targetPackage, ...optionPackage }, null, "  ")
  );
} catch {}

//テンプレートのコピー
try {
  fs.copySync(path.resolve("template"), targetPath, { overwrite: true });
} catch {}

//終了時の処理
process.on("exit", () => {
  console.log("================ End:setup-template ====================");
  try {
    const message = fs.readFileSync("options/message.txt");
    console.log(message);
  } catch {}
});
