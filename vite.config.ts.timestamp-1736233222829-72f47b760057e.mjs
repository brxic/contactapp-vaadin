// vite.generated.ts
import path from "path";
import { existsSync as existsSync5, mkdirSync as mkdirSync2, readdirSync as readdirSync2, readFileSync as readFileSync4, writeFileSync as writeFileSync2 } from "fs";
import { createHash } from "crypto";
import * as net from "net";

// target/plugins/application-theme-plugin/theme-handle.js
import { existsSync as existsSync3, readFileSync as readFileSync2 } from "fs";
import { resolve as resolve3 } from "path";

// target/plugins/application-theme-plugin/theme-generator.js
import { globSync as globSync2 } from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/glob/dist/esm/index.js";
import { resolve as resolve2, basename as basename2 } from "path";
import { existsSync as existsSync2, readFileSync, writeFileSync } from "fs";

// target/plugins/application-theme-plugin/theme-copy.js
import { readdirSync, statSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { resolve, basename, relative, extname } from "path";
import { globSync } from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/glob/dist/esm/index.js";
var ignoredFileExtensions = [".css", ".js", ".json"];
function copyThemeResources(themeFolder2, projectStaticAssetsOutputFolder, logger) {
  const staticAssetsThemeFolder = resolve(projectStaticAssetsOutputFolder, "themes", basename(themeFolder2));
  const collection = collectFolders(themeFolder2, logger);
  if (collection.files.length > 0) {
    mkdirSync(staticAssetsThemeFolder, { recursive: true });
    collection.directories.forEach((directory) => {
      const relativeDirectory = relative(themeFolder2, directory);
      const targetDirectory = resolve(staticAssetsThemeFolder, relativeDirectory);
      mkdirSync(targetDirectory, { recursive: true });
    });
    collection.files.forEach((file) => {
      const relativeFile = relative(themeFolder2, file);
      const targetFile = resolve(staticAssetsThemeFolder, relativeFile);
      copyFileIfAbsentOrNewer(file, targetFile, logger);
    });
  }
}
function collectFolders(folderToCopy, logger) {
  const collection = { directories: [], files: [] };
  logger.trace("files in directory", readdirSync(folderToCopy));
  readdirSync(folderToCopy).forEach((file) => {
    const fileToCopy = resolve(folderToCopy, file);
    try {
      if (statSync(fileToCopy).isDirectory()) {
        logger.debug("Going through directory", fileToCopy);
        const result = collectFolders(fileToCopy, logger);
        if (result.files.length > 0) {
          collection.directories.push(fileToCopy);
          logger.debug("Adding directory", fileToCopy);
          collection.directories.push.apply(collection.directories, result.directories);
          collection.files.push.apply(collection.files, result.files);
        }
      } else if (!ignoredFileExtensions.includes(extname(fileToCopy))) {
        logger.debug("Adding file", fileToCopy);
        collection.files.push(fileToCopy);
      }
    } catch (error) {
      handleNoSuchFileError(fileToCopy, error, logger);
    }
  });
  return collection;
}
function copyStaticAssets(themeName, themeProperties, projectStaticAssetsOutputFolder, logger) {
  const assets = themeProperties["assets"];
  if (!assets) {
    logger.debug("no assets to handle no static assets were copied");
    return;
  }
  mkdirSync(projectStaticAssetsOutputFolder, {
    recursive: true
  });
  const missingModules = checkModules(Object.keys(assets));
  if (missingModules.length > 0) {
    throw Error(
      "Missing npm modules '" + missingModules.join("', '") + "' for assets marked in 'theme.json'.\nInstall package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
    );
  }
  Object.keys(assets).forEach((module) => {
    const copyRules = assets[module];
    Object.keys(copyRules).forEach((copyRule) => {
      const nodeSources = resolve("node_modules/", module, copyRule).replace(/\\/g, "/");
      const files = globSync(nodeSources, { nodir: true });
      const targetFolder = resolve(projectStaticAssetsOutputFolder, "themes", themeName, copyRules[copyRule]);
      mkdirSync(targetFolder, {
        recursive: true
      });
      files.forEach((file) => {
        const copyTarget = resolve(targetFolder, basename(file));
        copyFileIfAbsentOrNewer(file, copyTarget, logger);
      });
    });
  });
}
function checkModules(modules) {
  const missing = [];
  modules.forEach((module) => {
    if (!existsSync(resolve("node_modules/", module))) {
      missing.push(module);
    }
  });
  return missing;
}
function copyFileIfAbsentOrNewer(fileToCopy, copyTarget, logger) {
  try {
    if (!existsSync(copyTarget) || statSync(copyTarget).mtime < statSync(fileToCopy).mtime) {
      logger.trace("Copying: ", fileToCopy, "=>", copyTarget);
      copyFileSync(fileToCopy, copyTarget);
    }
  } catch (error) {
    handleNoSuchFileError(fileToCopy, error, logger);
  }
}
function handleNoSuchFileError(file, error, logger) {
  if (error.code === "ENOENT") {
    logger.warn("Ignoring not existing file " + file + ". File may have been deleted during theme processing.");
  } else {
    throw error;
  }
}

// target/plugins/application-theme-plugin/theme-generator.js
var themeComponentsFolder = "components";
var documentCssFilename = "document.css";
var stylesCssFilename = "styles.css";
var CSSIMPORT_COMMENT = "CSSImport end";
var headerImport = `import 'construct-style-sheets-polyfill';
`;
function writeThemeFiles(themeFolder2, themeName, themeProperties, options) {
  const productionMode = !options.devMode;
  const useDevServerOrInProductionMode = !options.useDevBundle;
  const outputFolder = options.frontendGeneratedFolder;
  const styles = resolve2(themeFolder2, stylesCssFilename);
  const documentCssFile = resolve2(themeFolder2, documentCssFilename);
  const autoInjectComponents = themeProperties.autoInjectComponents ?? true;
  const autoInjectGlobalCssImports = themeProperties.autoInjectGlobalCssImports ?? false;
  const globalFilename = "theme-" + themeName + ".global.generated.js";
  const componentsFilename = "theme-" + themeName + ".components.generated.js";
  const themeFilename = "theme-" + themeName + ".generated.js";
  let themeFileContent = headerImport;
  let globalImportContent = "// When this file is imported, global styles are automatically applied\n";
  let componentsFileContent = "";
  var componentsFiles;
  if (autoInjectComponents) {
    componentsFiles = globSync2("*.css", {
      cwd: resolve2(themeFolder2, themeComponentsFolder),
      nodir: true
    });
    if (componentsFiles.length > 0) {
      componentsFileContent += "import { unsafeCSS, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles';\n";
    }
  }
  if (themeProperties.parent) {
    themeFileContent += `import { applyTheme as applyBaseTheme } from './theme-${themeProperties.parent}.generated.js';
`;
  }
  themeFileContent += `import { injectGlobalCss } from 'Frontend/generated/jar-resources/theme-util.js';
`;
  themeFileContent += `import { webcomponentGlobalCssInjector } from 'Frontend/generated/jar-resources/theme-util.js';
`;
  themeFileContent += `import './${componentsFilename}';
`;
  themeFileContent += `let needsReloadOnChanges = false;
`;
  const imports = [];
  const componentCssImports = [];
  const globalFileContent = [];
  const globalCssCode = [];
  const shadowOnlyCss = [];
  const componentCssCode = [];
  const parentTheme = themeProperties.parent ? "applyBaseTheme(target);\n" : "";
  const parentThemeGlobalImport = themeProperties.parent ? `import './theme-${themeProperties.parent}.global.generated.js';
` : "";
  const themeIdentifier = "_vaadintheme_" + themeName + "_";
  const lumoCssFlag = "_vaadinthemelumoimports_";
  const globalCssFlag = themeIdentifier + "globalCss";
  const componentCssFlag = themeIdentifier + "componentCss";
  if (!existsSync2(styles)) {
    if (productionMode) {
      throw new Error(`styles.css file is missing and is needed for '${themeName}' in folder '${themeFolder2}'`);
    }
    writeFileSync(
      styles,
      "/* Import your application global css files here or add the styles directly to this file */",
      "utf8"
    );
  }
  let filename = basename2(styles);
  let variable = camelCase(filename);
  const lumoImports = themeProperties.lumoImports || ["typography", "color", "spacing", "badge", "utility"];
  if (lumoImports) {
    lumoImports.forEach((lumoImport) => {
      imports.push(`import { ${lumoImport} } from '@vaadin/vaadin-lumo-styles/${lumoImport}.js';
`);
      if (lumoImport === "utility" || lumoImport === "badge" || lumoImport === "typography" || lumoImport === "color") {
        globalFileContent.push(`import '@vaadin/vaadin-lumo-styles/${lumoImport}-global.js';
`);
      }
    });
    lumoImports.forEach((lumoImport) => {
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${lumoImport}.cssText, '', target, true));
`);
    });
  }
  globalFileContent.push(parentThemeGlobalImport);
  if (useDevServerOrInProductionMode) {
    globalFileContent.push(`import 'themes/${themeName}/${filename}';
`);
    imports.push(`import ${variable} from 'themes/${themeName}/${filename}?inline';
`);
    shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable}.toString(), '', target));
    `);
  }
  if (existsSync2(documentCssFile)) {
    filename = basename2(documentCssFile);
    variable = camelCase(filename);
    if (useDevServerOrInProductionMode) {
      globalFileContent.push(`import 'themes/${themeName}/${filename}';
`);
      imports.push(`import ${variable} from 'themes/${themeName}/${filename}?inline';
`);
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable}.toString(),'', document));
    `);
    }
  }
  let i = 0;
  if (themeProperties.documentCss) {
    const missingModules = checkModules(themeProperties.documentCss);
    if (missingModules.length > 0) {
      throw Error(
        "Missing npm modules or files '" + missingModules.join("', '") + "' for documentCss marked in 'theme.json'.\nInstall or update package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
      );
    }
    themeProperties.documentCss.forEach((cssImport) => {
      const variable2 = "module" + i++;
      imports.push(`import ${variable2} from '${cssImport}?inline';
`);
      globalCssCode.push(`if(target !== document) {
        removers.push(injectGlobalCss(${variable2}.toString(), '', target));
    }
    `);
      globalCssCode.push(
        `removers.push(injectGlobalCss(${variable2}.toString(), '${CSSIMPORT_COMMENT}', document));
    `
      );
    });
  }
  if (themeProperties.importCss) {
    const missingModules = checkModules(themeProperties.importCss);
    if (missingModules.length > 0) {
      throw Error(
        "Missing npm modules or files '" + missingModules.join("', '") + "' for importCss marked in 'theme.json'.\nInstall or update package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
      );
    }
    themeProperties.importCss.forEach((cssPath) => {
      const variable2 = "module" + i++;
      globalFileContent.push(`import '${cssPath}';
`);
      imports.push(`import ${variable2} from '${cssPath}?inline';
`);
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable2}.toString(), '${CSSIMPORT_COMMENT}', target));
`);
    });
  }
  if (autoInjectComponents) {
    componentsFiles.forEach((componentCss) => {
      const filename2 = basename2(componentCss);
      const tag = filename2.replace(".css", "");
      const variable2 = camelCase(filename2);
      componentCssImports.push(
        `import ${variable2} from 'themes/${themeName}/${themeComponentsFolder}/${filename2}?inline';
`
      );
      const componentString = `registerStyles(
        '${tag}',
        unsafeCSS(${variable2}.toString())
      );
      `;
      componentCssCode.push(componentString);
    });
  }
  themeFileContent += imports.join("");
  const themeFileApply = `
  let themeRemovers = new WeakMap();
  let targets = [];

  export const applyTheme = (target) => {
    const removers = [];
    if (target !== document) {
      ${shadowOnlyCss.join("")}
      ${autoInjectGlobalCssImports ? `
        webcomponentGlobalCssInjector((css) => {
          removers.push(injectGlobalCss(css, '', target));
        });
        ` : ""}
    }
    ${parentTheme}
    ${globalCssCode.join("")}

    if (import.meta.hot) {
      targets.push(new WeakRef(target));
      themeRemovers.set(target, removers);
    }

  }

`;
  componentsFileContent += `
${componentCssImports.join("")}

if (!document['${componentCssFlag}']) {
  ${componentCssCode.join("")}
  document['${componentCssFlag}'] = true;
}

if (import.meta.hot) {
  import.meta.hot.accept((module) => {
    window.location.reload();
  });
}

`;
  themeFileContent += themeFileApply;
  themeFileContent += `
if (import.meta.hot) {
  import.meta.hot.accept((module) => {

    if (needsReloadOnChanges) {
      window.location.reload();
    } else {
      targets.forEach(targetRef => {
        const target = targetRef.deref();
        if (target) {
          themeRemovers.get(target).forEach(remover => remover())
          module.applyTheme(target);
        }
      })
    }
  });

  import.meta.hot.on('vite:afterUpdate', (update) => {
    document.dispatchEvent(new CustomEvent('vaadin-theme-updated', { detail: update }));
  });
}

`;
  globalImportContent += `
${globalFileContent.join("")}
`;
  writeIfChanged(resolve2(outputFolder, globalFilename), globalImportContent);
  writeIfChanged(resolve2(outputFolder, themeFilename), themeFileContent);
  writeIfChanged(resolve2(outputFolder, componentsFilename), componentsFileContent);
}
function writeIfChanged(file, data) {
  if (!existsSync2(file) || readFileSync(file, { encoding: "utf-8" }) !== data) {
    writeFileSync(file, data);
  }
}
function camelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, "").replace(/\.|\-/g, "");
}

// target/plugins/application-theme-plugin/theme-handle.js
var nameRegex = /theme-(.*)\.generated\.js/;
var prevThemeName = void 0;
var firstThemeName = void 0;
function processThemeResources(options, logger) {
  const themeName = extractThemeName(options.frontendGeneratedFolder);
  if (themeName) {
    if (!prevThemeName && !firstThemeName) {
      firstThemeName = themeName;
    } else if (prevThemeName && prevThemeName !== themeName && firstThemeName !== themeName || !prevThemeName && firstThemeName !== themeName) {
      const warning = `Attention: Active theme is switched to '${themeName}'.`;
      const description = `
      Note that adding new style sheet files to '/themes/${themeName}/components', 
      may not be taken into effect until the next application restart.
      Changes to already existing style sheet files are being reloaded as before.`;
      logger.warn("*******************************************************************");
      logger.warn(warning);
      logger.warn(description);
      logger.warn("*******************************************************************");
    }
    prevThemeName = themeName;
    findThemeFolderAndHandleTheme(themeName, options, logger);
  } else {
    prevThemeName = void 0;
    logger.debug("Skipping Vaadin application theme handling.");
    logger.trace("Most likely no @Theme annotation for application or only themeClass used.");
  }
}
function findThemeFolderAndHandleTheme(themeName, options, logger) {
  let themeFound = false;
  for (let i = 0; i < options.themeProjectFolders.length; i++) {
    const themeProjectFolder = options.themeProjectFolders[i];
    if (existsSync3(themeProjectFolder)) {
      logger.debug("Searching themes folder '" + themeProjectFolder + "' for theme '" + themeName + "'");
      const handled = handleThemes(themeName, themeProjectFolder, options, logger);
      if (handled) {
        if (themeFound) {
          throw new Error(
            "Found theme files in '" + themeProjectFolder + "' and '" + themeFound + "'. Theme should only be available in one folder"
          );
        }
        logger.debug("Found theme files from '" + themeProjectFolder + "'");
        themeFound = themeProjectFolder;
      }
    }
  }
  if (existsSync3(options.themeResourceFolder)) {
    if (themeFound && existsSync3(resolve3(options.themeResourceFolder, themeName))) {
      throw new Error(
        "Theme '" + themeName + `'should not exist inside a jar and in the project at the same time
Extending another theme is possible by adding { "parent": "my-parent-theme" } entry to the theme.json file inside your theme folder.`
      );
    }
    logger.debug(
      "Searching theme jar resource folder '" + options.themeResourceFolder + "' for theme '" + themeName + "'"
    );
    handleThemes(themeName, options.themeResourceFolder, options, logger);
    themeFound = true;
  }
  return themeFound;
}
function handleThemes(themeName, themesFolder, options, logger) {
  const themeFolder2 = resolve3(themesFolder, themeName);
  if (existsSync3(themeFolder2)) {
    logger.debug("Found theme ", themeName, " in folder ", themeFolder2);
    const themeProperties = getThemeProperties(themeFolder2);
    if (themeProperties.parent) {
      const found = findThemeFolderAndHandleTheme(themeProperties.parent, options, logger);
      if (!found) {
        throw new Error(
          "Could not locate files for defined parent theme '" + themeProperties.parent + "'.\nPlease verify that dependency is added or theme folder exists."
        );
      }
    }
    copyStaticAssets(themeName, themeProperties, options.projectStaticAssetsOutputFolder, logger);
    copyThemeResources(themeFolder2, options.projectStaticAssetsOutputFolder, logger);
    writeThemeFiles(themeFolder2, themeName, themeProperties, options);
    return true;
  }
  return false;
}
function getThemeProperties(themeFolder2) {
  const themePropertyFile = resolve3(themeFolder2, "theme.json");
  if (!existsSync3(themePropertyFile)) {
    return {};
  }
  const themePropertyFileAsString = readFileSync2(themePropertyFile);
  if (themePropertyFileAsString.length === 0) {
    return {};
  }
  return JSON.parse(themePropertyFileAsString);
}
function extractThemeName(frontendGeneratedFolder) {
  if (!frontendGeneratedFolder) {
    throw new Error(
      "Couldn't extract theme name from 'theme.js', because the path to folder containing this file is empty. Please set the a correct folder path in ApplicationThemePlugin constructor parameters."
    );
  }
  const generatedThemeFile = resolve3(frontendGeneratedFolder, "theme.js");
  if (existsSync3(generatedThemeFile)) {
    const themeName = nameRegex.exec(readFileSync2(generatedThemeFile, { encoding: "utf8" }))[1];
    if (!themeName) {
      throw new Error("Couldn't parse theme name from '" + generatedThemeFile + "'.");
    }
    return themeName;
  } else {
    return "";
  }
}

// target/plugins/theme-loader/theme-loader-utils.js
import { existsSync as existsSync4, readFileSync as readFileSync3 } from "fs";
import { resolve as resolve4, basename as basename3 } from "path";
import { globSync as globSync3 } from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/glob/dist/esm/index.js";
var urlMatcher = /(url\(\s*)(\'|\")?(\.\/|\.\.\/)((?:\3)*)?(\S*)(\2\s*\))/g;
function assetsContains(fileUrl, themeFolder2, logger) {
  const themeProperties = getThemeProperties2(themeFolder2);
  if (!themeProperties) {
    logger.debug("No theme properties found.");
    return false;
  }
  const assets = themeProperties["assets"];
  if (!assets) {
    logger.debug("No defined assets in theme properties");
    return false;
  }
  for (let module of Object.keys(assets)) {
    const copyRules = assets[module];
    for (let copyRule of Object.keys(copyRules)) {
      if (fileUrl.startsWith(copyRules[copyRule])) {
        const targetFile = fileUrl.replace(copyRules[copyRule], "");
        const files = globSync3(resolve4("node_modules/", module, copyRule), { nodir: true });
        for (let file of files) {
          if (file.endsWith(targetFile)) return true;
        }
      }
    }
  }
  return false;
}
function getThemeProperties2(themeFolder2) {
  const themePropertyFile = resolve4(themeFolder2, "theme.json");
  if (!existsSync4(themePropertyFile)) {
    return {};
  }
  const themePropertyFileAsString = readFileSync3(themePropertyFile);
  if (themePropertyFileAsString.length === 0) {
    return {};
  }
  return JSON.parse(themePropertyFileAsString);
}
function rewriteCssUrls(source, handledResourceFolder, themeFolder2, logger, options) {
  source = source.replace(urlMatcher, function(match, url, quoteMark, replace2, additionalDotSegments, fileUrl, endString) {
    let absolutePath = resolve4(handledResourceFolder, replace2, additionalDotSegments || "", fileUrl);
    let existingThemeResource = absolutePath.startsWith(themeFolder2) && existsSync4(absolutePath);
    if (!existingThemeResource && additionalDotSegments) {
      absolutePath = resolve4(handledResourceFolder, replace2, fileUrl);
      existingThemeResource = absolutePath.startsWith(themeFolder2) && existsSync4(absolutePath);
    }
    const isAsset = assetsContains(fileUrl, themeFolder2, logger);
    if (existingThemeResource || isAsset) {
      const replacement = options.devMode ? "./" : "../static/";
      const skipLoader = existingThemeResource ? "" : replacement;
      const frontendThemeFolder = skipLoader + "themes/" + basename3(themeFolder2);
      logger.log(
        "Updating url for file",
        "'" + replace2 + fileUrl + "'",
        "to use",
        "'" + frontendThemeFolder + "/" + fileUrl + "'"
      );
      const pathResolved = isAsset ? "/" + fileUrl : absolutePath.substring(themeFolder2.length).replace(/\\/g, "/");
      return url + (quoteMark ?? "") + frontendThemeFolder + pathResolved + endString;
    } else if (options.devMode) {
      logger.log("No rewrite for '", match, "' as the file was not found.");
    } else {
      return url + (quoteMark ?? "") + "../../" + fileUrl + endString;
    }
    return match;
  });
  return source;
}

// target/plugins/react-function-location-plugin/react-function-location-plugin.js
import * as t from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/@babel/types/lib/index.js";
function addFunctionComponentSourceLocationBabel() {
  function isReactFunctionName(name) {
    return name && name.match(/^[A-Z].*/);
  }
  function addDebugInfo(path2, name, filename, loc) {
    const lineNumber = loc.start.line;
    const columnNumber = loc.start.column + 1;
    const debugSourceMember = t.memberExpression(t.identifier(name), t.identifier("__debugSourceDefine"));
    const debugSourceDefine = t.objectExpression([
      t.objectProperty(t.identifier("fileName"), t.stringLiteral(filename)),
      t.objectProperty(t.identifier("lineNumber"), t.numericLiteral(lineNumber)),
      t.objectProperty(t.identifier("columnNumber"), t.numericLiteral(columnNumber))
    ]);
    const assignment = t.expressionStatement(t.assignmentExpression("=", debugSourceMember, debugSourceDefine));
    const condition = t.binaryExpression(
      "===",
      t.unaryExpression("typeof", t.identifier(name)),
      t.stringLiteral("function")
    );
    const ifFunction = t.ifStatement(condition, t.blockStatement([assignment]));
    path2.insertAfter(ifFunction);
  }
  return {
    visitor: {
      VariableDeclaration(path2, state) {
        path2.node.declarations.forEach((declaration) => {
          if (declaration.id.type !== "Identifier") {
            return;
          }
          const name = declaration?.id?.name;
          if (!isReactFunctionName(name)) {
            return;
          }
          const filename = state.file.opts.filename;
          if (declaration?.init?.body?.loc) {
            addDebugInfo(path2, name, filename, declaration.init.body.loc);
          }
        });
      },
      FunctionDeclaration(path2, state) {
        const node = path2.node;
        const name = node?.id?.name;
        if (!isReactFunctionName(name)) {
          return;
        }
        const filename = state.file.opts.filename;
        if (node.body.loc) {
          addDebugInfo(path2, name, filename, node.body.loc);
        }
      }
    }
  };
}

// target/vaadin-dev-server-settings.json
var vaadin_dev_server_settings_default = {
  frontendFolder: "C:/Users/BasilGIBM/IdeaProjects/contactapp/./src/main/frontend",
  themeFolder: "themes",
  themeResourceFolder: "C:/Users/BasilGIBM/IdeaProjects/contactapp/./src/main/frontend/generated/jar-resources",
  staticOutput: "C:/Users/BasilGIBM/IdeaProjects/contactapp/target/classes/META-INF/VAADIN/webapp/VAADIN/static",
  generatedFolder: "generated",
  statsOutput: "C:\\Users\\BasilGIBM\\IdeaProjects\\contactapp\\target\\classes\\META-INF\\VAADIN\\config",
  frontendBundleOutput: "C:\\Users\\BasilGIBM\\IdeaProjects\\contactapp\\target\\classes\\META-INF\\VAADIN\\webapp",
  devBundleOutput: "C:/Users/BasilGIBM/IdeaProjects/contactapp/target/dev-bundle/webapp",
  devBundleStatsOutput: "C:/Users/BasilGIBM/IdeaProjects/contactapp/target/dev-bundle/config",
  jarResourcesFolder: "C:/Users/BasilGIBM/IdeaProjects/contactapp/./src/main/frontend/generated/jar-resources",
  themeName: "",
  clientServiceWorkerSource: "C:\\Users\\BasilGIBM\\IdeaProjects\\contactapp\\target\\sw.ts",
  pwaEnabled: false,
  offlineEnabled: false,
  offlinePath: "'offline.html'"
};

// vite.generated.ts
import {
  defineConfig,
  mergeConfig
} from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/vite/dist/node/index.js";
import { getManifest } from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/workbox-build/build/index.js";
import * as rollup from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/rollup/dist/es/rollup.js";
import brotli from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/rollup-plugin-brotli/lib/index.cjs.js";
import replace from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/@rollup/plugin-replace/dist/es/index.js";
import checker from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/vite-plugin-checker/dist/esm/main.js";

// target/plugins/rollup-plugin-postcss-lit-custom/rollup-plugin-postcss-lit.js
import { createFilter } from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/@rollup/pluginutils/dist/es/index.js";
import transformAst from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/transform-ast/index.js";
var assetUrlRE = /__VITE_ASSET__([\w$]+)__(?:\$_(.*?)__)?/g;
var escape = (str) => str.replace(assetUrlRE, '${unsafeCSSTag("__VITE_ASSET__$1__$2")}').replace(/`/g, "\\`").replace(/\\(?!`)/g, "\\\\");
function postcssLit(options = {}) {
  const defaultOptions = {
    include: "**/*.{css,sss,pcss,styl,stylus,sass,scss,less}",
    exclude: null,
    importPackage: "lit"
  };
  const opts = { ...defaultOptions, ...options };
  const filter = createFilter(opts.include, opts.exclude);
  return {
    name: "postcss-lit",
    enforce: "post",
    transform(code, id) {
      if (!filter(id)) return;
      const ast = this.parse(code, {});
      let defaultExportName;
      let isDeclarationLiteral = false;
      const magicString = transformAst(code, { ast }, (node) => {
        if (node.type === "ExportDefaultDeclaration") {
          defaultExportName = node.declaration.name;
          isDeclarationLiteral = node.declaration.type === "Literal";
        }
      });
      if (!defaultExportName && !isDeclarationLiteral) {
        return;
      }
      magicString.walk((node) => {
        if (defaultExportName && node.type === "VariableDeclaration") {
          const exportedVar = node.declarations.find((d) => d.id.name === defaultExportName);
          if (exportedVar) {
            exportedVar.init.edit.update(`cssTag\`${escape(exportedVar.init.value)}\``);
          }
        }
        if (isDeclarationLiteral && node.type === "ExportDefaultDeclaration") {
          node.declaration.edit.update(`cssTag\`${escape(node.declaration.value)}\``);
        }
      });
      magicString.prepend(`import {css as cssTag, unsafeCSS as unsafeCSSTag} from '${opts.importPackage}';
`);
      return {
        code: magicString.toString(),
        map: magicString.generateMap({
          hires: true
        })
      };
    }
  };
}

// vite.generated.ts
import { createRequire } from "module";
import { visualizer } from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import reactPlugin from "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\BasilGIBM\\IdeaProjects\\contactapp";
var __vite_injected_original_import_meta_url = "file:///C:/Users/BasilGIBM/IdeaProjects/contactapp/vite.generated.ts";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var appShellUrl = ".";
var frontendFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.frontendFolder);
var themeFolder = path.resolve(frontendFolder, vaadin_dev_server_settings_default.themeFolder);
var frontendBundleFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.frontendBundleOutput);
var devBundleFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.devBundleOutput);
var devBundle = !!process.env.devBundle;
var jarResourcesFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.jarResourcesFolder);
var themeResourceFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.themeResourceFolder);
var projectPackageJsonFile = path.resolve(__vite_injected_original_dirname, "package.json");
var buildOutputFolder = devBundle ? devBundleFolder : frontendBundleFolder;
var statsFolder = path.resolve(__vite_injected_original_dirname, devBundle ? vaadin_dev_server_settings_default.devBundleStatsOutput : vaadin_dev_server_settings_default.statsOutput);
var statsFile = path.resolve(statsFolder, "stats.json");
var bundleSizeFile = path.resolve(statsFolder, "bundle-size.html");
var nodeModulesFolder = path.resolve(__vite_injected_original_dirname, "node_modules");
var webComponentTags = "";
var projectIndexHtml = path.resolve(frontendFolder, "index.html");
var projectStaticAssetsFolders = [
  path.resolve(__vite_injected_original_dirname, "src", "main", "resources", "META-INF", "resources"),
  path.resolve(__vite_injected_original_dirname, "src", "main", "resources", "static"),
  frontendFolder
];
var themeProjectFolders = projectStaticAssetsFolders.map((folder) => path.resolve(folder, vaadin_dev_server_settings_default.themeFolder));
var themeOptions = {
  devMode: false,
  useDevBundle: devBundle,
  // The following matches folder 'frontend/generated/themes/'
  // (not 'frontend/themes') for theme in JAR that is copied there
  themeResourceFolder: path.resolve(themeResourceFolder, vaadin_dev_server_settings_default.themeFolder),
  themeProjectFolders,
  projectStaticAssetsOutputFolder: devBundle ? path.resolve(devBundleFolder, "../assets") : path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.staticOutput),
  frontendGeneratedFolder: path.resolve(frontendFolder, vaadin_dev_server_settings_default.generatedFolder)
};
var hasExportedWebComponents = existsSync5(path.resolve(frontendFolder, "web-component.html"));
console.trace = () => {
};
console.debug = () => {
};
function injectManifestToSWPlugin() {
  const rewriteManifestIndexHtmlUrl = (manifest) => {
    const indexEntry = manifest.find((entry) => entry.url === "index.html");
    if (indexEntry) {
      indexEntry.url = appShellUrl;
    }
    return { manifest, warnings: [] };
  };
  return {
    name: "vaadin:inject-manifest-to-sw",
    async transform(code, id) {
      if (/sw\.(ts|js)$/.test(id)) {
        const { manifestEntries } = await getManifest({
          globDirectory: buildOutputFolder,
          globPatterns: ["**/*"],
          globIgnores: ["**/*.br"],
          manifestTransforms: [rewriteManifestIndexHtmlUrl],
          maximumFileSizeToCacheInBytes: 100 * 1024 * 1024
          // 100mb,
        });
        return code.replace("self.__WB_MANIFEST", JSON.stringify(manifestEntries));
      }
    }
  };
}
function buildSWPlugin(opts) {
  let config;
  const devMode = opts.devMode;
  const swObj = {};
  async function build(action, additionalPlugins = []) {
    const includedPluginNames = [
      "vite:esbuild",
      "rollup-plugin-dynamic-import-variables",
      "vite:esbuild-transpile",
      "vite:terser"
    ];
    const plugins = config.plugins.filter((p) => {
      return includedPluginNames.includes(p.name);
    });
    const resolver = config.createResolver();
    const resolvePlugin = {
      name: "resolver",
      resolveId(source, importer, _options) {
        return resolver(source, importer);
      }
    };
    plugins.unshift(resolvePlugin);
    plugins.push(
      replace({
        values: {
          "process.env.NODE_ENV": JSON.stringify(config.mode),
          ...config.define
        },
        preventAssignment: true
      })
    );
    if (additionalPlugins) {
      plugins.push(...additionalPlugins);
    }
    const bundle = await rollup.rollup({
      input: path.resolve(vaadin_dev_server_settings_default.clientServiceWorkerSource),
      plugins
    });
    try {
      return await bundle[action]({
        file: path.resolve(buildOutputFolder, "sw.js"),
        format: "es",
        exports: "none",
        sourcemap: config.command === "serve" || config.build.sourcemap,
        inlineDynamicImports: true
      });
    } finally {
      await bundle.close();
    }
  }
  return {
    name: "vaadin:build-sw",
    enforce: "post",
    async configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async buildStart() {
      if (devMode) {
        const { output } = await build("generate");
        swObj.code = output[0].code;
        swObj.map = output[0].map;
      }
    },
    async load(id) {
      if (id.endsWith("sw.js")) {
        return "";
      }
    },
    async transform(_code, id) {
      if (id.endsWith("sw.js")) {
        return swObj;
      }
    },
    async closeBundle() {
      if (!devMode) {
        await build("write", [injectManifestToSWPlugin(), brotli()]);
      }
    }
  };
}
function statsExtracterPlugin() {
  function collectThemeJsonsInFrontend(themeJsonContents, themeName) {
    const themeJson = path.resolve(frontendFolder, vaadin_dev_server_settings_default.themeFolder, themeName, "theme.json");
    if (existsSync5(themeJson)) {
      const themeJsonContent = readFileSync4(themeJson, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
      themeJsonContents[themeName] = themeJsonContent;
      const themeJsonObject = JSON.parse(themeJsonContent);
      if (themeJsonObject.parent) {
        collectThemeJsonsInFrontend(themeJsonContents, themeJsonObject.parent);
      }
    }
  }
  return {
    name: "vaadin:stats",
    enforce: "post",
    async writeBundle(options, bundle) {
      const modules = Object.values(bundle).flatMap((b) => b.modules ? Object.keys(b.modules) : []);
      const nodeModulesFolders = modules.map((id) => id.replace(/\\/g, "/")).filter((id) => id.startsWith(nodeModulesFolder.replace(/\\/g, "/"))).map((id) => id.substring(nodeModulesFolder.length + 1));
      const npmModules = nodeModulesFolders.map((id) => id.replace(/\\/g, "/")).map((id) => {
        const parts = id.split("/");
        if (id.startsWith("@")) {
          return parts[0] + "/" + parts[1];
        } else {
          return parts[0];
        }
      }).sort().filter((value, index, self) => self.indexOf(value) === index);
      const npmModuleAndVersion = Object.fromEntries(npmModules.map((module) => [module, getVersion(module)]));
      const cvdls = Object.fromEntries(
        npmModules.filter((module) => getCvdlName(module) != null).map((module) => [module, { name: getCvdlName(module), version: getVersion(module) }])
      );
      mkdirSync2(path.dirname(statsFile), { recursive: true });
      const projectPackageJson = JSON.parse(readFileSync4(projectPackageJsonFile, { encoding: "utf-8" }));
      const entryScripts = Object.values(bundle).filter((bundle2) => bundle2.isEntry).map((bundle2) => bundle2.fileName);
      const generatedIndexHtml = path.resolve(buildOutputFolder, "index.html");
      const customIndexData = readFileSync4(projectIndexHtml, { encoding: "utf-8" });
      const generatedIndexData = readFileSync4(generatedIndexHtml, {
        encoding: "utf-8"
      });
      const customIndexRows = new Set(customIndexData.split(/[\r\n]/).filter((row) => row.trim() !== ""));
      const generatedIndexRows = generatedIndexData.split(/[\r\n]/).filter((row) => row.trim() !== "");
      const rowsGenerated = [];
      generatedIndexRows.forEach((row) => {
        if (!customIndexRows.has(row)) {
          rowsGenerated.push(row);
        }
      });
      const parseImports = (filename, result) => {
        const content = readFileSync4(filename, { encoding: "utf-8" });
        const lines = content.split("\n");
        const staticImports = lines.filter((line) => line.startsWith("import ")).map((line) => line.substring(line.indexOf("'") + 1, line.lastIndexOf("'"))).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line);
        const dynamicImports = lines.filter((line) => line.includes("import(")).map((line) => line.replace(/.*import\(/, "")).map((line) => line.split(/'/)[1]).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line);
        staticImports.forEach((staticImport) => result.add(staticImport));
        dynamicImports.map((dynamicImport) => {
          const importedFile = path.resolve(path.dirname(filename), dynamicImport);
          parseImports(importedFile, result);
        });
      };
      const generatedImportsSet = /* @__PURE__ */ new Set();
      parseImports(
        path.resolve(themeOptions.frontendGeneratedFolder, "flow", "generated-flow-imports.js"),
        generatedImportsSet
      );
      const generatedImports = Array.from(generatedImportsSet).sort();
      const frontendFiles = {};
      const projectFileExtensions = [".js", ".js.map", ".ts", ".ts.map", ".tsx", ".tsx.map", ".css", ".css.map"];
      const isThemeComponentsResource = (id) => id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) && id.match(/.*\/jar-resources\/themes\/[^\/]+\/components\//);
      const isGeneratedWebComponentResource = (id) => id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) && id.match(/.*\/flow\/web-components\//);
      const isFrontendResourceCollected = (id) => !id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) || isThemeComponentsResource(id) || isGeneratedWebComponentResource(id);
      modules.map((id) => id.replace(/\\/g, "/")).filter((id) => id.startsWith(frontendFolder.replace(/\\/g, "/"))).filter(isFrontendResourceCollected).map((id) => id.substring(frontendFolder.length + 1)).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line).forEach((line) => {
        const filePath = path.resolve(frontendFolder, line);
        if (projectFileExtensions.includes(path.extname(filePath))) {
          const fileBuffer = readFileSync4(filePath, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
          frontendFiles[line] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        }
      });
      generatedImports.filter((line) => line.includes("generated/jar-resources")).forEach((line) => {
        let filename = line.substring(line.indexOf("generated"));
        const fileBuffer = readFileSync4(path.resolve(frontendFolder, filename), { encoding: "utf-8" }).replace(
          /\r\n/g,
          "\n"
        );
        const hash = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        const fileKey = line.substring(line.indexOf("jar-resources/") + 14);
        frontendFiles[fileKey] = hash;
      });
      let frontendFolderAlias = "Frontend";
      generatedImports.filter((line) => line.startsWith(frontendFolderAlias + "/")).filter((line) => !line.startsWith(frontendFolderAlias + "/generated/")).filter((line) => !line.startsWith(frontendFolderAlias + "/themes/")).map((line) => line.substring(frontendFolderAlias.length + 1)).filter((line) => !frontendFiles[line]).forEach((line) => {
        const filePath = path.resolve(frontendFolder, line);
        if (projectFileExtensions.includes(path.extname(filePath)) && existsSync5(filePath)) {
          const fileBuffer = readFileSync4(filePath, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
          frontendFiles[line] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        }
      });
      if (existsSync5(path.resolve(frontendFolder, "index.ts"))) {
        const fileBuffer = readFileSync4(path.resolve(frontendFolder, "index.ts"), { encoding: "utf-8" }).replace(
          /\r\n/g,
          "\n"
        );
        frontendFiles[`index.ts`] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
      }
      const themeJsonContents = {};
      const themesFolder = path.resolve(jarResourcesFolder, "themes");
      if (existsSync5(themesFolder)) {
        readdirSync2(themesFolder).forEach((themeFolder2) => {
          const themeJson = path.resolve(themesFolder, themeFolder2, "theme.json");
          if (existsSync5(themeJson)) {
            themeJsonContents[path.basename(themeFolder2)] = readFileSync4(themeJson, { encoding: "utf-8" }).replace(
              /\r\n/g,
              "\n"
            );
          }
        });
      }
      collectThemeJsonsInFrontend(themeJsonContents, vaadin_dev_server_settings_default.themeName);
      let webComponents = [];
      if (webComponentTags) {
        webComponents = webComponentTags.split(";");
      }
      const stats = {
        packageJsonDependencies: projectPackageJson.dependencies,
        npmModules: npmModuleAndVersion,
        bundleImports: generatedImports,
        frontendHashes: frontendFiles,
        themeJsonContents,
        entryScripts,
        webComponents,
        cvdlModules: cvdls,
        packageJsonHash: projectPackageJson?.vaadin?.hash,
        indexHtmlGenerated: rowsGenerated
      };
      writeFileSync2(statsFile, JSON.stringify(stats, null, 1));
    }
  };
}
function vaadinBundlesPlugin() {
  const disabledMessage = "Vaadin component dependency bundles are disabled.";
  const modulesDirectory = nodeModulesFolder.replace(/\\/g, "/");
  let vaadinBundleJson;
  function parseModuleId(id) {
    const [scope, scopedPackageName] = id.split("/", 3);
    const packageName = scope.startsWith("@") ? `${scope}/${scopedPackageName}` : scope;
    const modulePath = `.${id.substring(packageName.length)}`;
    return {
      packageName,
      modulePath
    };
  }
  function getExports(id) {
    const { packageName, modulePath } = parseModuleId(id);
    const packageInfo = vaadinBundleJson.packages[packageName];
    if (!packageInfo) return;
    const exposeInfo = packageInfo.exposes[modulePath];
    if (!exposeInfo) return;
    const exportsSet = /* @__PURE__ */ new Set();
    for (const e of exposeInfo.exports) {
      if (typeof e === "string") {
        exportsSet.add(e);
      } else {
        const { namespace, source } = e;
        if (namespace) {
          exportsSet.add(namespace);
        } else {
          const sourceExports = getExports(source);
          if (sourceExports) {
            sourceExports.forEach((e2) => exportsSet.add(e2));
          }
        }
      }
    }
    return Array.from(exportsSet);
  }
  function getExportBinding(binding) {
    return binding === "default" ? "_default as default" : binding;
  }
  function getImportAssigment(binding) {
    return binding === "default" ? "default: _default" : binding;
  }
  return {
    name: "vaadin:bundles",
    enforce: "pre",
    apply(config, { command }) {
      if (command !== "serve") return false;
      try {
        const vaadinBundleJsonPath = require2.resolve("@vaadin/bundles/vaadin-bundle.json");
        vaadinBundleJson = JSON.parse(readFileSync4(vaadinBundleJsonPath, { encoding: "utf8" }));
      } catch (e) {
        if (typeof e === "object" && e.code === "MODULE_NOT_FOUND") {
          vaadinBundleJson = { packages: {} };
          console.info(`@vaadin/bundles npm package is not found, ${disabledMessage}`);
          return false;
        } else {
          throw e;
        }
      }
      const versionMismatches = [];
      for (const [name, packageInfo] of Object.entries(vaadinBundleJson.packages)) {
        let installedVersion = void 0;
        try {
          const { version: bundledVersion } = packageInfo;
          const installedPackageJsonFile = path.resolve(modulesDirectory, name, "package.json");
          const packageJson = JSON.parse(readFileSync4(installedPackageJsonFile, { encoding: "utf8" }));
          installedVersion = packageJson.version;
          if (installedVersion && installedVersion !== bundledVersion) {
            versionMismatches.push({
              name,
              bundledVersion,
              installedVersion
            });
          }
        } catch (_) {
        }
      }
      if (versionMismatches.length) {
        console.info(`@vaadin/bundles has version mismatches with installed packages, ${disabledMessage}`);
        console.info(`Packages with version mismatches: ${JSON.stringify(versionMismatches, void 0, 2)}`);
        vaadinBundleJson = { packages: {} };
        return false;
      }
      return true;
    },
    async config(config) {
      return mergeConfig(
        {
          optimizeDeps: {
            exclude: [
              // Vaadin bundle
              "@vaadin/bundles",
              ...Object.keys(vaadinBundleJson.packages),
              "@vaadin/vaadin-material-styles"
            ]
          }
        },
        config
      );
    },
    load(rawId) {
      const [path2, params] = rawId.split("?");
      if (!path2.startsWith(modulesDirectory)) return;
      const id = path2.substring(modulesDirectory.length + 1);
      const bindings = getExports(id);
      if (bindings === void 0) return;
      const cacheSuffix = params ? `?${params}` : "";
      const bundlePath = `@vaadin/bundles/vaadin.js${cacheSuffix}`;
      return `import { init as VaadinBundleInit, get as VaadinBundleGet } from '${bundlePath}';
await VaadinBundleInit('default');
const { ${bindings.map(getImportAssigment).join(", ")} } = (await VaadinBundleGet('./node_modules/${id}'))();
export { ${bindings.map(getExportBinding).join(", ")} };`;
    }
  };
}
function themePlugin(opts) {
  const fullThemeOptions = { ...themeOptions, devMode: opts.devMode };
  return {
    name: "vaadin:theme",
    config() {
      processThemeResources(fullThemeOptions, console);
    },
    configureServer(server) {
      function handleThemeFileCreateDelete(themeFile, stats) {
        if (themeFile.startsWith(themeFolder)) {
          const changed = path.relative(themeFolder, themeFile);
          console.debug("Theme file " + (!!stats ? "created" : "deleted"), changed);
          processThemeResources(fullThemeOptions, console);
        }
      }
      server.watcher.on("add", handleThemeFileCreateDelete);
      server.watcher.on("unlink", handleThemeFileCreateDelete);
    },
    handleHotUpdate(context) {
      const contextPath = path.resolve(context.file);
      const themePath = path.resolve(themeFolder);
      if (contextPath.startsWith(themePath)) {
        const changed = path.relative(themePath, contextPath);
        console.debug("Theme file changed", changed);
        if (changed.startsWith(vaadin_dev_server_settings_default.themeName)) {
          processThemeResources(fullThemeOptions, console);
        }
      }
    },
    async resolveId(id, importer) {
      if (path.resolve(themeOptions.frontendGeneratedFolder, "theme.js") === importer && !existsSync5(path.resolve(themeOptions.frontendGeneratedFolder, id))) {
        console.debug("Generate theme file " + id + " not existing. Processing theme resource");
        processThemeResources(fullThemeOptions, console);
        return;
      }
      if (!id.startsWith(vaadin_dev_server_settings_default.themeFolder)) {
        return;
      }
      for (const location of [themeResourceFolder, frontendFolder]) {
        const result = await this.resolve(path.resolve(location, id));
        if (result) {
          return result;
        }
      }
    },
    async transform(raw, id, options) {
      const [bareId, query] = id.split("?");
      if (!bareId?.startsWith(themeFolder) && !bareId?.startsWith(themeOptions.themeResourceFolder) || !bareId?.endsWith(".css")) {
        return;
      }
      const resourceThemeFolder = bareId.startsWith(themeFolder) ? themeFolder : themeOptions.themeResourceFolder;
      const [themeName] = bareId.substring(resourceThemeFolder.length + 1).split("/");
      return rewriteCssUrls(raw, path.dirname(bareId), path.resolve(resourceThemeFolder, themeName), console, opts);
    }
  };
}
function runWatchDog(watchDogPort, watchDogHost) {
  const client = new net.Socket();
  client.setEncoding("utf8");
  client.on("error", function(err) {
    console.log("Watchdog connection error. Terminating vite process...", err);
    client.destroy();
    process.exit(0);
  });
  client.on("close", function() {
    client.destroy();
    runWatchDog(watchDogPort, watchDogHost);
  });
  client.connect(watchDogPort, watchDogHost || "localhost");
}
var allowedFrontendFolders = [frontendFolder, nodeModulesFolder];
function showRecompileReason() {
  return {
    name: "vaadin:why-you-compile",
    handleHotUpdate(context) {
      console.log("Recompiling because", context.file, "changed");
    }
  };
}
var DEV_MODE_START_REGEXP = /\/\*[\*!]\s+vaadin-dev-mode:start/;
var DEV_MODE_CODE_REGEXP = /\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i;
function preserveUsageStats() {
  return {
    name: "vaadin:preserve-usage-stats",
    transform(src, id) {
      if (id.includes("vaadin-usage-statistics")) {
        if (src.includes("vaadin-dev-mode:start")) {
          const newSrc = src.replace(DEV_MODE_START_REGEXP, "/*! vaadin-dev-mode:start");
          if (newSrc === src) {
            console.error("Comment replacement failed to change anything");
          } else if (!newSrc.match(DEV_MODE_CODE_REGEXP)) {
            console.error("New comment fails to match original regexp");
          } else {
            return { code: newSrc };
          }
        }
      }
      return { code: src };
    }
  };
}
var vaadinConfig = (env) => {
  const devMode = env.mode === "development";
  const productionMode = !devMode && !devBundle;
  if (devMode && process.env.watchDogPort) {
    runWatchDog(parseInt(process.env.watchDogPort), process.env.watchDogHost);
  }
  return {
    root: frontendFolder,
    base: "",
    publicDir: false,
    resolve: {
      alias: {
        "@vaadin/flow-frontend": jarResourcesFolder,
        Frontend: frontendFolder
      },
      preserveSymlinks: true
    },
    define: {
      OFFLINE_PATH: vaadin_dev_server_settings_default.offlinePath,
      VITE_ENABLED: "true"
    },
    server: {
      host: "127.0.0.1",
      strictPort: true,
      fs: {
        allow: allowedFrontendFolders
      }
    },
    build: {
      minify: productionMode,
      outDir: buildOutputFolder,
      emptyOutDir: devBundle,
      assetsDir: "VAADIN/build",
      rollupOptions: {
        input: {
          indexhtml: projectIndexHtml,
          ...hasExportedWebComponents ? { webcomponenthtml: path.resolve(frontendFolder, "web-component.html") } : {}
        },
        onwarn: (warning, defaultHandler) => {
          const ignoreEvalWarning = [
            "generated/jar-resources/FlowClient.js",
            "generated/jar-resources/vaadin-spreadsheet/spreadsheet-export.js",
            "@vaadin/charts/src/helpers.js"
          ];
          if (warning.code === "EVAL" && warning.id && !!ignoreEvalWarning.find((id) => warning.id?.endsWith(id))) {
            return;
          }
          defaultHandler(warning);
        }
      }
    },
    optimizeDeps: {
      entries: [
        // Pre-scan entrypoints in Vite to avoid reloading on first open
        "generated/vaadin.ts"
      ],
      exclude: [
        "@vaadin/router",
        "@vaadin/vaadin-license-checker",
        "@vaadin/vaadin-usage-statistics",
        "workbox-core",
        "workbox-precaching",
        "workbox-routing",
        "workbox-strategies"
      ]
    },
    plugins: [
      productionMode && brotli(),
      devMode && vaadinBundlesPlugin(),
      devMode && showRecompileReason(),
      vaadin_dev_server_settings_default.offlineEnabled && buildSWPlugin({ devMode }),
      !devMode && statsExtracterPlugin(),
      !productionMode && preserveUsageStats(),
      themePlugin({ devMode }),
      postcssLit({
        include: ["**/*.css", /.*\/.*\.css\?.*/],
        exclude: [
          `${themeFolder}/**/*.css`,
          new RegExp(`${themeFolder}/.*/.*\\.css\\?.*`),
          `${themeResourceFolder}/**/*.css`,
          new RegExp(`${themeResourceFolder}/.*/.*\\.css\\?.*`),
          new RegExp(".*/.*\\?html-proxy.*")
        ]
      }),
      // The React plugin provides fast refresh and debug source info
      reactPlugin({
        include: "**/*.tsx",
        babel: {
          // We need to use babel to provide the source information for it to be correct
          // (otherwise Babel will slightly rewrite the source file and esbuild generate source info for the modified file)
          presets: [["@babel/preset-react", { runtime: "automatic", development: !productionMode }]],
          // React writes the source location for where components are used, this writes for where they are defined
          plugins: [
            !productionMode && addFunctionComponentSourceLocationBabel(),
            [
              "module:@preact/signals-react-transform",
              {
                mode: "all"
                // Needed to include translations which do not use something.value
              }
            ]
          ].filter(Boolean)
        }
      }),
      {
        name: "vaadin:force-remove-html-middleware",
        configureServer(server) {
          return () => {
            server.middlewares.stack = server.middlewares.stack.filter((mw) => {
              const handleName = `${mw.handle}`;
              return !handleName.includes("viteHtmlFallbackMiddleware");
            });
          };
        }
      },
      hasExportedWebComponents && {
        name: "vaadin:inject-entrypoints-to-web-component-html",
        transformIndexHtml: {
          order: "pre",
          handler(_html, { path: path2, server }) {
            if (path2 !== "/web-component.html") {
              return;
            }
            return [
              {
                tag: "script",
                attrs: { type: "module", src: `/generated/vaadin-web-component.ts` },
                injectTo: "head"
              }
            ];
          }
        }
      },
      {
        name: "vaadin:inject-entrypoints-to-index-html",
        transformIndexHtml: {
          order: "pre",
          handler(_html, { path: path2, server }) {
            if (path2 !== "/index.html") {
              return;
            }
            const scripts = [];
            if (devMode) {
              scripts.push({
                tag: "script",
                attrs: { type: "module", src: `/generated/vite-devmode.ts`, onerror: "document.location.reload()" },
                injectTo: "head"
              });
            }
            scripts.push({
              tag: "script",
              attrs: { type: "module", src: "/generated/vaadin.ts" },
              injectTo: "head"
            });
            return scripts;
          }
        }
      },
      checker({
        typescript: true
      }),
      productionMode && visualizer({ brotliSize: true, filename: bundleSizeFile })
    ]
  };
};
var overrideVaadinConfig = (customConfig2) => {
  return defineConfig((env) => mergeConfig(vaadinConfig(env), customConfig2(env)));
};
function getVersion(module) {
  const packageJson = path.resolve(nodeModulesFolder, module, "package.json");
  return JSON.parse(readFileSync4(packageJson, { encoding: "utf-8" })).version;
}
function getCvdlName(module) {
  const packageJson = path.resolve(nodeModulesFolder, module, "package.json");
  return JSON.parse(readFileSync4(packageJson, { encoding: "utf-8" })).cvdlName;
}

// vite.config.ts
var customConfig = (env) => ({
  // Here you can add custom Vite parameters
  // https://vitejs.dev/config/
});
var vite_config_default = overrideVaadinConfig(customConfig);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5nZW5lcmF0ZWQudHMiLCAidGFyZ2V0L3BsdWdpbnMvYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luL3RoZW1lLWhhbmRsZS5qcyIsICJ0YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtZ2VuZXJhdG9yLmpzIiwgInRhcmdldC9wbHVnaW5zL2FwcGxpY2F0aW9uLXRoZW1lLXBsdWdpbi90aGVtZS1jb3B5LmpzIiwgInRhcmdldC9wbHVnaW5zL3RoZW1lLWxvYWRlci90aGVtZS1sb2FkZXItdXRpbHMuanMiLCAidGFyZ2V0L3BsdWdpbnMvcmVhY3QtZnVuY3Rpb24tbG9jYXRpb24tcGx1Z2luL3JlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpbi5qcyIsICJ0YXJnZXQvdmFhZGluLWRldi1zZXJ2ZXItc2V0dGluZ3MuanNvbiIsICJ0YXJnZXQvcGx1Z2lucy9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LWN1c3RvbS9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LmpzIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQmFzaWxHSUJNXFxcXElkZWFQcm9qZWN0c1xcXFxjb250YWN0YXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCYXNpbEdJQk1cXFxcSWRlYVByb2plY3RzXFxcXGNvbnRhY3RhcHBcXFxcdml0ZS5nZW5lcmF0ZWQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0Jhc2lsR0lCTS9JZGVhUHJvamVjdHMvY29udGFjdGFwcC92aXRlLmdlbmVyYXRlZC50c1wiOy8qKlxuICogTk9USUNFOiB0aGlzIGlzIGFuIGF1dG8tZ2VuZXJhdGVkIGZpbGVcbiAqXG4gKiBUaGlzIGZpbGUgaGFzIGJlZW4gZ2VuZXJhdGVkIGJ5IHRoZSBgZmxvdzpwcmVwYXJlLWZyb250ZW5kYCBtYXZlbiBnb2FsLlxuICogVGhpcyBmaWxlIHdpbGwgYmUgb3ZlcndyaXR0ZW4gb24gZXZlcnkgcnVuLiBBbnkgY3VzdG9tIGNoYW5nZXMgc2hvdWxkIGJlIG1hZGUgdG8gdml0ZS5jb25maWcudHNcbiAqL1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBleGlzdHNTeW5jLCBta2RpclN5bmMsIHJlYWRkaXJTeW5jLCByZWFkRmlsZVN5bmMsIHdyaXRlRmlsZVN5bmMsIFN0YXRzIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgY3JlYXRlSGFzaCB9IGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgKiBhcyBuZXQgZnJvbSAnbmV0JztcblxuaW1wb3J0IHsgcHJvY2Vzc1RoZW1lUmVzb3VyY2VzIH0gZnJvbSAnLi90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtaGFuZGxlLmpzJztcbmltcG9ydCB7IHJld3JpdGVDc3NVcmxzIH0gZnJvbSAnLi90YXJnZXQvcGx1Z2lucy90aGVtZS1sb2FkZXIvdGhlbWUtbG9hZGVyLXV0aWxzLmpzJztcbmltcG9ydCB7IGFkZEZ1bmN0aW9uQ29tcG9uZW50U291cmNlTG9jYXRpb25CYWJlbCB9IGZyb20gJy4vdGFyZ2V0L3BsdWdpbnMvcmVhY3QtZnVuY3Rpb24tbG9jYXRpb24tcGx1Z2luL3JlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpbi5qcyc7XG5pbXBvcnQgc2V0dGluZ3MgZnJvbSAnLi90YXJnZXQvdmFhZGluLWRldi1zZXJ2ZXItc2V0dGluZ3MuanNvbic7XG5pbXBvcnQge1xuICBBc3NldEluZm8sXG4gIENodW5rSW5mbyxcbiAgZGVmaW5lQ29uZmlnLFxuICBtZXJnZUNvbmZpZyxcbiAgT3V0cHV0T3B0aW9ucyxcbiAgUGx1Z2luT3B0aW9uLFxuICBSZXNvbHZlZENvbmZpZyxcbiAgVXNlckNvbmZpZ0ZuXG59IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgZ2V0TWFuaWZlc3QsIHR5cGUgTWFuaWZlc3RUcmFuc2Zvcm0gfSBmcm9tICd3b3JrYm94LWJ1aWxkJztcblxuaW1wb3J0ICogYXMgcm9sbHVwIGZyb20gJ3JvbGx1cCc7XG5pbXBvcnQgYnJvdGxpIGZyb20gJ3JvbGx1cC1wbHVnaW4tYnJvdGxpJztcbmltcG9ydCByZXBsYWNlIGZyb20gJ0Byb2xsdXAvcGx1Z2luLXJlcGxhY2UnO1xuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcic7XG5pbXBvcnQgcG9zdGNzc0xpdCBmcm9tICcuL3RhcmdldC9wbHVnaW5zL3JvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQtY3VzdG9tL3JvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQuanMnO1xuXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJztcblxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XG5pbXBvcnQgcmVhY3RQbHVnaW4gZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG5cblxuLy8gTWFrZSBgcmVxdWlyZWAgY29tcGF0aWJsZSB3aXRoIEVTIG1vZHVsZXNcbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XG5cbmNvbnN0IGFwcFNoZWxsVXJsID0gJy4nO1xuXG5jb25zdCBmcm9udGVuZEZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHNldHRpbmdzLmZyb250ZW5kRm9sZGVyKTtcbmNvbnN0IHRoZW1lRm9sZGVyID0gcGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCBzZXR0aW5ncy50aGVtZUZvbGRlcik7XG5jb25zdCBmcm9udGVuZEJ1bmRsZUZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHNldHRpbmdzLmZyb250ZW5kQnVuZGxlT3V0cHV0KTtcbmNvbnN0IGRldkJ1bmRsZUZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHNldHRpbmdzLmRldkJ1bmRsZU91dHB1dCk7XG5jb25zdCBkZXZCdW5kbGUgPSAhIXByb2Nlc3MuZW52LmRldkJ1bmRsZTtcbmNvbnN0IGphclJlc291cmNlc0ZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHNldHRpbmdzLmphclJlc291cmNlc0ZvbGRlcik7XG5jb25zdCB0aGVtZVJlc291cmNlRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MudGhlbWVSZXNvdXJjZUZvbGRlcik7XG5jb25zdCBwcm9qZWN0UGFja2FnZUpzb25GaWxlID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3BhY2thZ2UuanNvbicpO1xuXG5jb25zdCBidWlsZE91dHB1dEZvbGRlciA9IGRldkJ1bmRsZSA/IGRldkJ1bmRsZUZvbGRlciA6IGZyb250ZW5kQnVuZGxlRm9sZGVyO1xuY29uc3Qgc3RhdHNGb2xkZXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBkZXZCdW5kbGUgPyBzZXR0aW5ncy5kZXZCdW5kbGVTdGF0c091dHB1dCA6IHNldHRpbmdzLnN0YXRzT3V0cHV0KTtcbmNvbnN0IHN0YXRzRmlsZSA9IHBhdGgucmVzb2x2ZShzdGF0c0ZvbGRlciwgJ3N0YXRzLmpzb24nKTtcbmNvbnN0IGJ1bmRsZVNpemVGaWxlID0gcGF0aC5yZXNvbHZlKHN0YXRzRm9sZGVyLCAnYnVuZGxlLXNpemUuaHRtbCcpO1xuY29uc3Qgbm9kZU1vZHVsZXNGb2xkZXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzJyk7XG5jb25zdCB3ZWJDb21wb25lbnRUYWdzID0gJyc7XG5cbmNvbnN0IHByb2plY3RJbmRleEh0bWwgPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsICdpbmRleC5odG1sJyk7XG5cbmNvbnN0IHByb2plY3RTdGF0aWNBc3NldHNGb2xkZXJzID0gW1xuICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJywgJ21haW4nLCAncmVzb3VyY2VzJywgJ01FVEEtSU5GJywgJ3Jlc291cmNlcycpLFxuICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJywgJ21haW4nLCAncmVzb3VyY2VzJywgJ3N0YXRpYycpLFxuICBmcm9udGVuZEZvbGRlclxuXTtcblxuLy8gRm9sZGVycyBpbiB0aGUgcHJvamVjdCB3aGljaCBjYW4gY29udGFpbiBhcHBsaWNhdGlvbiB0aGVtZXNcbmNvbnN0IHRoZW1lUHJvamVjdEZvbGRlcnMgPSBwcm9qZWN0U3RhdGljQXNzZXRzRm9sZGVycy5tYXAoKGZvbGRlcikgPT4gcGF0aC5yZXNvbHZlKGZvbGRlciwgc2V0dGluZ3MudGhlbWVGb2xkZXIpKTtcblxuY29uc3QgdGhlbWVPcHRpb25zID0ge1xuICBkZXZNb2RlOiBmYWxzZSxcbiAgdXNlRGV2QnVuZGxlOiBkZXZCdW5kbGUsXG4gIC8vIFRoZSBmb2xsb3dpbmcgbWF0Y2hlcyBmb2xkZXIgJ2Zyb250ZW5kL2dlbmVyYXRlZC90aGVtZXMvJ1xuICAvLyAobm90ICdmcm9udGVuZC90aGVtZXMnKSBmb3IgdGhlbWUgaW4gSkFSIHRoYXQgaXMgY29waWVkIHRoZXJlXG4gIHRoZW1lUmVzb3VyY2VGb2xkZXI6IHBhdGgucmVzb2x2ZSh0aGVtZVJlc291cmNlRm9sZGVyLCBzZXR0aW5ncy50aGVtZUZvbGRlciksXG4gIHRoZW1lUHJvamVjdEZvbGRlcnM6IHRoZW1lUHJvamVjdEZvbGRlcnMsXG4gIHByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXI6IGRldkJ1bmRsZVxuICAgID8gcGF0aC5yZXNvbHZlKGRldkJ1bmRsZUZvbGRlciwgJy4uL2Fzc2V0cycpXG4gICAgOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBzZXR0aW5ncy5zdGF0aWNPdXRwdXQpLFxuICBmcm9udGVuZEdlbmVyYXRlZEZvbGRlcjogcGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCBzZXR0aW5ncy5nZW5lcmF0ZWRGb2xkZXIpXG59O1xuXG5jb25zdCBoYXNFeHBvcnRlZFdlYkNvbXBvbmVudHMgPSBleGlzdHNTeW5jKHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ3dlYi1jb21wb25lbnQuaHRtbCcpKTtcblxuLy8gQmxvY2sgZGVidWcgYW5kIHRyYWNlIGxvZ3MuXG5jb25zb2xlLnRyYWNlID0gKCkgPT4ge307XG5jb25zb2xlLmRlYnVnID0gKCkgPT4ge307XG5cbmZ1bmN0aW9uIGluamVjdE1hbmlmZXN0VG9TV1BsdWdpbigpOiByb2xsdXAuUGx1Z2luIHtcbiAgY29uc3QgcmV3cml0ZU1hbmlmZXN0SW5kZXhIdG1sVXJsOiBNYW5pZmVzdFRyYW5zZm9ybSA9IChtYW5pZmVzdCkgPT4ge1xuICAgIGNvbnN0IGluZGV4RW50cnkgPSBtYW5pZmVzdC5maW5kKChlbnRyeSkgPT4gZW50cnkudXJsID09PSAnaW5kZXguaHRtbCcpO1xuICAgIGlmIChpbmRleEVudHJ5KSB7XG4gICAgICBpbmRleEVudHJ5LnVybCA9IGFwcFNoZWxsVXJsO1xuICAgIH1cblxuICAgIHJldHVybiB7IG1hbmlmZXN0LCB3YXJuaW5nczogW10gfTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2YWFkaW46aW5qZWN0LW1hbmlmZXN0LXRvLXN3JyxcbiAgICBhc3luYyB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcbiAgICAgIGlmICgvc3dcXC4odHN8anMpJC8udGVzdChpZCkpIHtcbiAgICAgICAgY29uc3QgeyBtYW5pZmVzdEVudHJpZXMgfSA9IGF3YWl0IGdldE1hbmlmZXN0KHtcbiAgICAgICAgICBnbG9iRGlyZWN0b3J5OiBidWlsZE91dHB1dEZvbGRlcixcbiAgICAgICAgICBnbG9iUGF0dGVybnM6IFsnKiovKiddLFxuICAgICAgICAgIGdsb2JJZ25vcmVzOiBbJyoqLyouYnInXSxcbiAgICAgICAgICBtYW5pZmVzdFRyYW5zZm9ybXM6IFtyZXdyaXRlTWFuaWZlc3RJbmRleEh0bWxVcmxdLFxuICAgICAgICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiAxMDAgKiAxMDI0ICogMTAyNCAvLyAxMDBtYixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNvZGUucmVwbGFjZSgnc2VsZi5fX1dCX01BTklGRVNUJywgSlNPTi5zdHJpbmdpZnkobWFuaWZlc3RFbnRyaWVzKSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBidWlsZFNXUGx1Z2luKG9wdHM6IHsgZGV2TW9kZTogYm9vbGVhbiB9KTogUGx1Z2luT3B0aW9uIHtcbiAgbGV0IGNvbmZpZzogUmVzb2x2ZWRDb25maWc7XG4gIGNvbnN0IGRldk1vZGUgPSBvcHRzLmRldk1vZGU7XG5cbiAgY29uc3Qgc3dPYmo6IHsgY29kZT86IHN0cmluZywgbWFwPzogcm9sbHVwLlNvdXJjZU1hcCB8IG51bGwgfSA9IHt9O1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGJ1aWxkKGFjdGlvbjogJ2dlbmVyYXRlJyB8ICd3cml0ZScsIGFkZGl0aW9uYWxQbHVnaW5zOiByb2xsdXAuUGx1Z2luW10gPSBbXSkge1xuICAgIGNvbnN0IGluY2x1ZGVkUGx1Z2luTmFtZXMgPSBbXG4gICAgICAndml0ZTplc2J1aWxkJyxcbiAgICAgICdyb2xsdXAtcGx1Z2luLWR5bmFtaWMtaW1wb3J0LXZhcmlhYmxlcycsXG4gICAgICAndml0ZTplc2J1aWxkLXRyYW5zcGlsZScsXG4gICAgICAndml0ZTp0ZXJzZXInXG4gICAgXTtcbiAgICBjb25zdCBwbHVnaW5zOiByb2xsdXAuUGx1Z2luW10gPSBjb25maWcucGx1Z2lucy5maWx0ZXIoKHApID0+IHtcbiAgICAgIHJldHVybiBpbmNsdWRlZFBsdWdpbk5hbWVzLmluY2x1ZGVzKHAubmFtZSk7XG4gICAgfSk7XG4gICAgY29uc3QgcmVzb2x2ZXIgPSBjb25maWcuY3JlYXRlUmVzb2x2ZXIoKTtcbiAgICBjb25zdCByZXNvbHZlUGx1Z2luOiByb2xsdXAuUGx1Z2luID0ge1xuICAgICAgbmFtZTogJ3Jlc29sdmVyJyxcbiAgICAgIHJlc29sdmVJZChzb3VyY2UsIGltcG9ydGVyLCBfb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZXIoc291cmNlLCBpbXBvcnRlcik7XG4gICAgICB9XG4gICAgfTtcbiAgICBwbHVnaW5zLnVuc2hpZnQocmVzb2x2ZVBsdWdpbik7IC8vIFB1dCByZXNvbHZlIGZpcnN0XG4gICAgcGx1Z2lucy5wdXNoKFxuICAgICAgcmVwbGFjZSh7XG4gICAgICAgIHZhbHVlczoge1xuICAgICAgICAgICdwcm9jZXNzLmVudi5OT0RFX0VOVic6IEpTT04uc3RyaW5naWZ5KGNvbmZpZy5tb2RlKSxcbiAgICAgICAgICAuLi5jb25maWcuZGVmaW5lXG4gICAgICAgIH0sXG4gICAgICAgIHByZXZlbnRBc3NpZ25tZW50OiB0cnVlXG4gICAgICB9KVxuICAgICk7XG4gICAgaWYgKGFkZGl0aW9uYWxQbHVnaW5zKSB7XG4gICAgICBwbHVnaW5zLnB1c2goLi4uYWRkaXRpb25hbFBsdWdpbnMpO1xuICAgIH1cbiAgICBjb25zdCBidW5kbGUgPSBhd2FpdCByb2xsdXAucm9sbHVwKHtcbiAgICAgIGlucHV0OiBwYXRoLnJlc29sdmUoc2V0dGluZ3MuY2xpZW50U2VydmljZVdvcmtlclNvdXJjZSksXG4gICAgICBwbHVnaW5zXG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGJ1bmRsZVthY3Rpb25dKHtcbiAgICAgICAgZmlsZTogcGF0aC5yZXNvbHZlKGJ1aWxkT3V0cHV0Rm9sZGVyLCAnc3cuanMnKSxcbiAgICAgICAgZm9ybWF0OiAnZXMnLFxuICAgICAgICBleHBvcnRzOiAnbm9uZScsXG4gICAgICAgIHNvdXJjZW1hcDogY29uZmlnLmNvbW1hbmQgPT09ICdzZXJ2ZScgfHwgY29uZmlnLmJ1aWxkLnNvdXJjZW1hcCxcbiAgICAgICAgaW5saW5lRHluYW1pY0ltcG9ydHM6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBhd2FpdCBidW5kbGUuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2YWFkaW46YnVpbGQtc3cnLFxuICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICBhc3luYyBjb25maWdSZXNvbHZlZChyZXNvbHZlZENvbmZpZykge1xuICAgICAgY29uZmlnID0gcmVzb2x2ZWRDb25maWc7XG4gICAgfSxcbiAgICBhc3luYyBidWlsZFN0YXJ0KCkge1xuICAgICAgaWYgKGRldk1vZGUpIHtcbiAgICAgICAgY29uc3QgeyBvdXRwdXQgfSA9IGF3YWl0IGJ1aWxkKCdnZW5lcmF0ZScpO1xuICAgICAgICBzd09iai5jb2RlID0gb3V0cHV0WzBdLmNvZGU7XG4gICAgICAgIHN3T2JqLm1hcCA9IG91dHB1dFswXS5tYXA7XG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luYyBsb2FkKGlkKSB7XG4gICAgICBpZiAoaWQuZW5kc1dpdGgoJ3N3LmpzJykpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgdHJhbnNmb3JtKF9jb2RlLCBpZCkge1xuICAgICAgaWYgKGlkLmVuZHNXaXRoKCdzdy5qcycpKSB7XG4gICAgICAgIHJldHVybiBzd09iajtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jIGNsb3NlQnVuZGxlKCkge1xuICAgICAgaWYgKCFkZXZNb2RlKSB7XG4gICAgICAgIGF3YWl0IGJ1aWxkKCd3cml0ZScsIFtpbmplY3RNYW5pZmVzdFRvU1dQbHVnaW4oKSwgYnJvdGxpKCldKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0YXRzRXh0cmFjdGVyUGx1Z2luKCk6IFBsdWdpbk9wdGlvbiB7XG4gIGZ1bmN0aW9uIGNvbGxlY3RUaGVtZUpzb25zSW5Gcm9udGVuZCh0aGVtZUpzb25Db250ZW50czogUmVjb3JkPHN0cmluZywgc3RyaW5nPiwgdGhlbWVOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0aGVtZUpzb24gPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIHNldHRpbmdzLnRoZW1lRm9sZGVyLCB0aGVtZU5hbWUsICd0aGVtZS5qc29uJyk7XG4gICAgaWYgKGV4aXN0c1N5bmModGhlbWVKc29uKSkge1xuICAgICAgY29uc3QgdGhlbWVKc29uQ29udGVudCA9IHJlYWRGaWxlU3luYyh0aGVtZUpzb24sIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgICAgIHRoZW1lSnNvbkNvbnRlbnRzW3RoZW1lTmFtZV0gPSB0aGVtZUpzb25Db250ZW50O1xuICAgICAgY29uc3QgdGhlbWVKc29uT2JqZWN0ID0gSlNPTi5wYXJzZSh0aGVtZUpzb25Db250ZW50KTtcbiAgICAgIGlmICh0aGVtZUpzb25PYmplY3QucGFyZW50KSB7XG4gICAgICAgIGNvbGxlY3RUaGVtZUpzb25zSW5Gcm9udGVuZCh0aGVtZUpzb25Db250ZW50cywgdGhlbWVKc29uT2JqZWN0LnBhcmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOnN0YXRzJyxcbiAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgYXN5bmMgd3JpdGVCdW5kbGUob3B0aW9uczogT3V0cHV0T3B0aW9ucywgYnVuZGxlOiB7IFtmaWxlTmFtZTogc3RyaW5nXTogQXNzZXRJbmZvIHwgQ2h1bmtJbmZvIH0pIHtcbiAgICAgIGNvbnN0IG1vZHVsZXMgPSBPYmplY3QudmFsdWVzKGJ1bmRsZSkuZmxhdE1hcCgoYikgPT4gKGIubW9kdWxlcyA/IE9iamVjdC5rZXlzKGIubW9kdWxlcykgOiBbXSkpO1xuICAgICAgY29uc3Qgbm9kZU1vZHVsZXNGb2xkZXJzID0gbW9kdWxlc1xuICAgICAgICAubWFwKChpZCkgPT4gaWQucmVwbGFjZSgvXFxcXC9nLCAnLycpKVxuICAgICAgICAuZmlsdGVyKChpZCkgPT4gaWQuc3RhcnRzV2l0aChub2RlTW9kdWxlc0ZvbGRlci5yZXBsYWNlKC9cXFxcL2csICcvJykpKVxuICAgICAgICAubWFwKChpZCkgPT4gaWQuc3Vic3RyaW5nKG5vZGVNb2R1bGVzRm9sZGVyLmxlbmd0aCArIDEpKTtcbiAgICAgIGNvbnN0IG5wbU1vZHVsZXMgPSBub2RlTW9kdWxlc0ZvbGRlcnNcbiAgICAgICAgLm1hcCgoaWQpID0+IGlkLnJlcGxhY2UoL1xcXFwvZywgJy8nKSlcbiAgICAgICAgLm1hcCgoaWQpID0+IHtcbiAgICAgICAgICBjb25zdCBwYXJ0cyA9IGlkLnNwbGl0KCcvJyk7XG4gICAgICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoJ0AnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzWzBdICsgJy8nICsgcGFydHNbMV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJ0c1swXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zb3J0KClcbiAgICAgICAgLmZpbHRlcigodmFsdWUsIGluZGV4LCBzZWxmKSA9PiBzZWxmLmluZGV4T2YodmFsdWUpID09PSBpbmRleCk7XG4gICAgICBjb25zdCBucG1Nb2R1bGVBbmRWZXJzaW9uID0gT2JqZWN0LmZyb21FbnRyaWVzKG5wbU1vZHVsZXMubWFwKChtb2R1bGUpID0+IFttb2R1bGUsIGdldFZlcnNpb24obW9kdWxlKV0pKTtcbiAgICAgIGNvbnN0IGN2ZGxzID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICBucG1Nb2R1bGVzXG4gICAgICAgICAgLmZpbHRlcigobW9kdWxlKSA9PiBnZXRDdmRsTmFtZShtb2R1bGUpICE9IG51bGwpXG4gICAgICAgICAgLm1hcCgobW9kdWxlKSA9PiBbbW9kdWxlLCB7IG5hbWU6IGdldEN2ZGxOYW1lKG1vZHVsZSksIHZlcnNpb246IGdldFZlcnNpb24obW9kdWxlKSB9XSlcbiAgICAgICk7XG5cbiAgICAgIG1rZGlyU3luYyhwYXRoLmRpcm5hbWUoc3RhdHNGaWxlKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICBjb25zdCBwcm9qZWN0UGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHJlYWRGaWxlU3luYyhwcm9qZWN0UGFja2FnZUpzb25GaWxlLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKTtcblxuICAgICAgY29uc3QgZW50cnlTY3JpcHRzID0gT2JqZWN0LnZhbHVlcyhidW5kbGUpXG4gICAgICAgIC5maWx0ZXIoKGJ1bmRsZSkgPT4gYnVuZGxlLmlzRW50cnkpXG4gICAgICAgIC5tYXAoKGJ1bmRsZSkgPT4gYnVuZGxlLmZpbGVOYW1lKTtcblxuICAgICAgY29uc3QgZ2VuZXJhdGVkSW5kZXhIdG1sID0gcGF0aC5yZXNvbHZlKGJ1aWxkT3V0cHV0Rm9sZGVyLCAnaW5kZXguaHRtbCcpO1xuICAgICAgY29uc3QgY3VzdG9tSW5kZXhEYXRhOiBzdHJpbmcgPSByZWFkRmlsZVN5bmMocHJvamVjdEluZGV4SHRtbCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZEluZGV4RGF0YTogc3RyaW5nID0gcmVhZEZpbGVTeW5jKGdlbmVyYXRlZEluZGV4SHRtbCwge1xuICAgICAgICBlbmNvZGluZzogJ3V0Zi04J1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGN1c3RvbUluZGV4Um93cyA9IG5ldyBTZXQoY3VzdG9tSW5kZXhEYXRhLnNwbGl0KC9bXFxyXFxuXS8pLmZpbHRlcigocm93KSA9PiByb3cudHJpbSgpICE9PSAnJykpO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkSW5kZXhSb3dzID0gZ2VuZXJhdGVkSW5kZXhEYXRhLnNwbGl0KC9bXFxyXFxuXS8pLmZpbHRlcigocm93KSA9PiByb3cudHJpbSgpICE9PSAnJyk7XG5cbiAgICAgIGNvbnN0IHJvd3NHZW5lcmF0ZWQ6IHN0cmluZ1tdID0gW107XG4gICAgICBnZW5lcmF0ZWRJbmRleFJvd3MuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgIGlmICghY3VzdG9tSW5kZXhSb3dzLmhhcyhyb3cpKSB7XG4gICAgICAgICAgcm93c0dlbmVyYXRlZC5wdXNoKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvL0FmdGVyIGRldi1idW5kbGUgYnVpbGQgYWRkIHVzZWQgRmxvdyBmcm9udGVuZCBpbXBvcnRzIEpzTW9kdWxlL0phdmFTY3JpcHQvQ3NzSW1wb3J0XG5cbiAgICAgIGNvbnN0IHBhcnNlSW1wb3J0cyA9IChmaWxlbmFtZTogc3RyaW5nLCByZXN1bHQ6IFNldDxzdHJpbmc+KTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQ6IHN0cmluZyA9IHJlYWRGaWxlU3luYyhmaWxlbmFtZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgICAgICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgY29uc3Qgc3RhdGljSW1wb3J0cyA9IGxpbmVzXG4gICAgICAgICAgLmZpbHRlcigobGluZSkgPT4gbGluZS5zdGFydHNXaXRoKCdpbXBvcnQgJykpXG4gICAgICAgICAgLm1hcCgobGluZSkgPT4gbGluZS5zdWJzdHJpbmcobGluZS5pbmRleE9mKFwiJ1wiKSArIDEsIGxpbmUubGFzdEluZGV4T2YoXCInXCIpKSlcbiAgICAgICAgICAubWFwKChsaW5lKSA9PiAobGluZS5pbmNsdWRlcygnPycpID8gbGluZS5zdWJzdHJpbmcoMCwgbGluZS5sYXN0SW5kZXhPZignPycpKSA6IGxpbmUpKTtcbiAgICAgICAgY29uc3QgZHluYW1pY0ltcG9ydHMgPSBsaW5lc1xuICAgICAgICAgIC5maWx0ZXIoKGxpbmUpID0+IGxpbmUuaW5jbHVkZXMoJ2ltcG9ydCgnKSlcbiAgICAgICAgICAubWFwKChsaW5lKSA9PiBsaW5lLnJlcGxhY2UoLy4qaW1wb3J0XFwoLywgJycpKVxuICAgICAgICAgIC5tYXAoKGxpbmUpID0+IGxpbmUuc3BsaXQoLycvKVsxXSlcbiAgICAgICAgICAubWFwKChsaW5lKSA9PiAobGluZS5pbmNsdWRlcygnPycpID8gbGluZS5zdWJzdHJpbmcoMCwgbGluZS5sYXN0SW5kZXhPZignPycpKSA6IGxpbmUpKTtcblxuICAgICAgICBzdGF0aWNJbXBvcnRzLmZvckVhY2goKHN0YXRpY0ltcG9ydCkgPT4gcmVzdWx0LmFkZChzdGF0aWNJbXBvcnQpKTtcblxuICAgICAgICBkeW5hbWljSW1wb3J0cy5tYXAoKGR5bmFtaWNJbXBvcnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRlZEZpbGUgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKGZpbGVuYW1lKSwgZHluYW1pY0ltcG9ydCk7XG4gICAgICAgICAgcGFyc2VJbXBvcnRzKGltcG9ydGVkRmlsZSwgcmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBnZW5lcmF0ZWRJbXBvcnRzU2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICBwYXJzZUltcG9ydHMoXG4gICAgICAgIHBhdGgucmVzb2x2ZSh0aGVtZU9wdGlvbnMuZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIsICdmbG93JywgJ2dlbmVyYXRlZC1mbG93LWltcG9ydHMuanMnKSxcbiAgICAgICAgZ2VuZXJhdGVkSW1wb3J0c1NldFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZEltcG9ydHMgPSBBcnJheS5mcm9tKGdlbmVyYXRlZEltcG9ydHNTZXQpLnNvcnQoKTtcblxuICAgICAgY29uc3QgZnJvbnRlbmRGaWxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gICAgICBjb25zdCBwcm9qZWN0RmlsZUV4dGVuc2lvbnMgPSBbJy5qcycsICcuanMubWFwJywgJy50cycsICcudHMubWFwJywgJy50c3gnLCAnLnRzeC5tYXAnLCAnLmNzcycsICcuY3NzLm1hcCddO1xuXG4gICAgICBjb25zdCBpc1RoZW1lQ29tcG9uZW50c1Jlc291cmNlID0gKGlkOiBzdHJpbmcpID0+XG4gICAgICAgICAgaWQuc3RhcnRzV2l0aCh0aGVtZU9wdGlvbnMuZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIucmVwbGFjZSgvXFxcXC9nLCAnLycpKVxuICAgICAgICAgICAgICAmJiBpZC5tYXRjaCgvLipcXC9qYXItcmVzb3VyY2VzXFwvdGhlbWVzXFwvW15cXC9dK1xcL2NvbXBvbmVudHNcXC8vKTtcblxuICAgICAgY29uc3QgaXNHZW5lcmF0ZWRXZWJDb21wb25lbnRSZXNvdXJjZSA9IChpZDogc3RyaW5nKSA9PlxuICAgICAgICAgIGlkLnN0YXJ0c1dpdGgodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLnJlcGxhY2UoL1xcXFwvZywgJy8nKSlcbiAgICAgICAgICAgICAgJiYgaWQubWF0Y2goLy4qXFwvZmxvd1xcL3dlYi1jb21wb25lbnRzXFwvLyk7XG5cbiAgICAgIGNvbnN0IGlzRnJvbnRlbmRSZXNvdXJjZUNvbGxlY3RlZCA9IChpZDogc3RyaW5nKSA9PlxuICAgICAgICAgICFpZC5zdGFydHNXaXRoKHRoZW1lT3B0aW9ucy5mcm9udGVuZEdlbmVyYXRlZEZvbGRlci5yZXBsYWNlKC9cXFxcL2csICcvJykpXG4gICAgICAgICAgfHwgaXNUaGVtZUNvbXBvbmVudHNSZXNvdXJjZShpZClcbiAgICAgICAgICB8fCBpc0dlbmVyYXRlZFdlYkNvbXBvbmVudFJlc291cmNlKGlkKTtcblxuICAgICAgLy8gY29sbGVjdHMgcHJvamVjdCdzIGZyb250ZW5kIHJlc291cmNlcyBpbiBmcm9udGVuZCBmb2xkZXIsIGV4Y2x1ZGluZ1xuICAgICAgLy8gJ2dlbmVyYXRlZCcgc3ViLWZvbGRlciwgZXhjZXB0IGZvciBsZWdhY3kgc2hhZG93IERPTSBzdHlsZXNoZWV0c1xuICAgICAgLy8gcGFja2FnZWQgaW4gYHRoZW1lL2NvbXBvbmVudHMvYCBmb2xkZXJcbiAgICAgIC8vIGFuZCBnZW5lcmF0ZWQgd2ViIGNvbXBvbmVudCByZXNvdXJjZXMgaW4gYGZsb3cvd2ViLWNvbXBvbmVudHNgIGZvbGRlci5cbiAgICAgIG1vZHVsZXNcbiAgICAgICAgLm1hcCgoaWQpID0+IGlkLnJlcGxhY2UoL1xcXFwvZywgJy8nKSlcbiAgICAgICAgLmZpbHRlcigoaWQpID0+IGlkLnN0YXJ0c1dpdGgoZnJvbnRlbmRGb2xkZXIucmVwbGFjZSgvXFxcXC9nLCAnLycpKSlcbiAgICAgICAgLmZpbHRlcihpc0Zyb250ZW5kUmVzb3VyY2VDb2xsZWN0ZWQpXG4gICAgICAgIC5tYXAoKGlkKSA9PiBpZC5zdWJzdHJpbmcoZnJvbnRlbmRGb2xkZXIubGVuZ3RoICsgMSkpXG4gICAgICAgIC5tYXAoKGxpbmU6IHN0cmluZykgPT4gKGxpbmUuaW5jbHVkZXMoJz8nKSA/IGxpbmUuc3Vic3RyaW5nKDAsIGxpbmUubGFzdEluZGV4T2YoJz8nKSkgOiBsaW5lKSlcbiAgICAgICAgLmZvckVhY2goKGxpbmU6IHN0cmluZykgPT4ge1xuICAgICAgICAgIC8vIFxcclxcbiBmcm9tIHdpbmRvd3MgbWFkZSBmaWxlcyBtYXkgYmUgdXNlZCBzbyBjaGFuZ2UgdG8gXFxuXG4gICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIGxpbmUpO1xuICAgICAgICAgIGlmIChwcm9qZWN0RmlsZUV4dGVuc2lvbnMuaW5jbHVkZXMocGF0aC5leHRuYW1lKGZpbGVQYXRoKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVCdWZmZXIgPSByZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgICAgICAgICAgIGZyb250ZW5kRmlsZXNbbGluZV0gPSBjcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoZmlsZUJ1ZmZlciwgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIC8vIGNvbGxlY3RzIGZyb250ZW5kIHJlc291cmNlcyBmcm9tIHRoZSBKQVJzXG4gICAgICBnZW5lcmF0ZWRJbXBvcnRzXG4gICAgICAgIC5maWx0ZXIoKGxpbmU6IHN0cmluZykgPT4gbGluZS5pbmNsdWRlcygnZ2VuZXJhdGVkL2phci1yZXNvdXJjZXMnKSlcbiAgICAgICAgLmZvckVhY2goKGxpbmU6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGxldCBmaWxlbmFtZSA9IGxpbmUuc3Vic3RyaW5nKGxpbmUuaW5kZXhPZignZ2VuZXJhdGVkJykpO1xuICAgICAgICAgIC8vIFxcclxcbiBmcm9tIHdpbmRvd3MgbWFkZSBmaWxlcyBtYXkgYmUgdXNlZCBybyByZW1vdmUgdG8gYmUgb25seSBcXG5cbiAgICAgICAgICBjb25zdCBmaWxlQnVmZmVyID0gcmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgZmlsZW5hbWUpLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pLnJlcGxhY2UoXG4gICAgICAgICAgICAvXFxyXFxuL2csXG4gICAgICAgICAgICAnXFxuJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3QgaGFzaCA9IGNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShmaWxlQnVmZmVyLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG5cbiAgICAgICAgICBjb25zdCBmaWxlS2V5ID0gbGluZS5zdWJzdHJpbmcobGluZS5pbmRleE9mKCdqYXItcmVzb3VyY2VzLycpICsgMTQpO1xuICAgICAgICAgIGZyb250ZW5kRmlsZXNbZmlsZUtleV0gPSBoYXNoO1xuICAgICAgICB9KTtcbiAgICAgIC8vIGNvbGxlY3RzIGFuZCBoYXNoIHJlc3Qgb2YgdGhlIEZyb250ZW5kIHJlc291cmNlcyBleGNsdWRpbmcgZmlsZXMgaW4gL2dlbmVyYXRlZC8gYW5kIC90aGVtZXMvXG4gICAgICAvLyBhbmQgZmlsZXMgYWxyZWFkeSBpbiBmcm9udGVuZEZpbGVzLlxuICAgICAgbGV0IGZyb250ZW5kRm9sZGVyQWxpYXMgPSBcIkZyb250ZW5kXCI7XG4gICAgICBnZW5lcmF0ZWRJbXBvcnRzXG4gICAgICAgIC5maWx0ZXIoKGxpbmU6IHN0cmluZykgPT4gbGluZS5zdGFydHNXaXRoKGZyb250ZW5kRm9sZGVyQWxpYXMgKyAnLycpKVxuICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+ICFsaW5lLnN0YXJ0c1dpdGgoZnJvbnRlbmRGb2xkZXJBbGlhcyArICcvZ2VuZXJhdGVkLycpKVxuICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+ICFsaW5lLnN0YXJ0c1dpdGgoZnJvbnRlbmRGb2xkZXJBbGlhcyArICcvdGhlbWVzLycpKVxuICAgICAgICAubWFwKChsaW5lKSA9PiBsaW5lLnN1YnN0cmluZyhmcm9udGVuZEZvbGRlckFsaWFzLmxlbmd0aCArIDEpKVxuICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+ICFmcm9udGVuZEZpbGVzW2xpbmVdKVxuICAgICAgICAuZm9yRWFjaCgobGluZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIGxpbmUpO1xuICAgICAgICAgIGlmIChwcm9qZWN0RmlsZUV4dGVuc2lvbnMuaW5jbHVkZXMocGF0aC5leHRuYW1lKGZpbGVQYXRoKSkgJiYgZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVCdWZmZXIgPSByZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgICAgICAgICAgIGZyb250ZW5kRmlsZXNbbGluZV0gPSBjcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoZmlsZUJ1ZmZlciwgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAvLyBJZiBhIGluZGV4LnRzIGV4aXN0cyBoYXNoIGl0IHRvIGJlIGFibGUgdG8gc2VlIGlmIGl0IGNoYW5nZXMuXG4gICAgICBpZiAoZXhpc3RzU3luYyhwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsICdpbmRleC50cycpKSkge1xuICAgICAgICBjb25zdCBmaWxlQnVmZmVyID0gcmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ2luZGV4LnRzJyksIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZShcbiAgICAgICAgICAvXFxyXFxuL2csXG4gICAgICAgICAgJ1xcbidcbiAgICAgICAgKTtcbiAgICAgICAgZnJvbnRlbmRGaWxlc1tgaW5kZXgudHNgXSA9IGNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShmaWxlQnVmZmVyLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRoZW1lSnNvbkNvbnRlbnRzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgICBjb25zdCB0aGVtZXNGb2xkZXIgPSBwYXRoLnJlc29sdmUoamFyUmVzb3VyY2VzRm9sZGVyLCAndGhlbWVzJyk7XG4gICAgICBpZiAoZXhpc3RzU3luYyh0aGVtZXNGb2xkZXIpKSB7XG4gICAgICAgIHJlYWRkaXJTeW5jKHRoZW1lc0ZvbGRlcikuZm9yRWFjaCgodGhlbWVGb2xkZXIpID0+IHtcbiAgICAgICAgICBjb25zdCB0aGVtZUpzb24gPSBwYXRoLnJlc29sdmUodGhlbWVzRm9sZGVyLCB0aGVtZUZvbGRlciwgJ3RoZW1lLmpzb24nKTtcbiAgICAgICAgICBpZiAoZXhpc3RzU3luYyh0aGVtZUpzb24pKSB7XG4gICAgICAgICAgICB0aGVtZUpzb25Db250ZW50c1twYXRoLmJhc2VuYW1lKHRoZW1lRm9sZGVyKV0gPSByZWFkRmlsZVN5bmModGhlbWVKc29uLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pLnJlcGxhY2UoXG4gICAgICAgICAgICAgIC9cXHJcXG4vZyxcbiAgICAgICAgICAgICAgJ1xcbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29sbGVjdFRoZW1lSnNvbnNJbkZyb250ZW5kKHRoZW1lSnNvbkNvbnRlbnRzLCBzZXR0aW5ncy50aGVtZU5hbWUpO1xuXG4gICAgICBsZXQgd2ViQ29tcG9uZW50czogc3RyaW5nW10gPSBbXTtcbiAgICAgIGlmICh3ZWJDb21wb25lbnRUYWdzKSB7XG4gICAgICAgIHdlYkNvbXBvbmVudHMgPSB3ZWJDb21wb25lbnRUYWdzLnNwbGl0KCc7Jyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0YXRzID0ge1xuICAgICAgICBwYWNrYWdlSnNvbkRlcGVuZGVuY2llczogcHJvamVjdFBhY2thZ2VKc29uLmRlcGVuZGVuY2llcyxcbiAgICAgICAgbnBtTW9kdWxlczogbnBtTW9kdWxlQW5kVmVyc2lvbixcbiAgICAgICAgYnVuZGxlSW1wb3J0czogZ2VuZXJhdGVkSW1wb3J0cyxcbiAgICAgICAgZnJvbnRlbmRIYXNoZXM6IGZyb250ZW5kRmlsZXMsXG4gICAgICAgIHRoZW1lSnNvbkNvbnRlbnRzOiB0aGVtZUpzb25Db250ZW50cyxcbiAgICAgICAgZW50cnlTY3JpcHRzLFxuICAgICAgICB3ZWJDb21wb25lbnRzLFxuICAgICAgICBjdmRsTW9kdWxlczogY3ZkbHMsXG4gICAgICAgIHBhY2thZ2VKc29uSGFzaDogcHJvamVjdFBhY2thZ2VKc29uPy52YWFkaW4/Lmhhc2gsXG4gICAgICAgIGluZGV4SHRtbEdlbmVyYXRlZDogcm93c0dlbmVyYXRlZFxuICAgICAgfTtcbiAgICAgIHdyaXRlRmlsZVN5bmMoc3RhdHNGaWxlLCBKU09OLnN0cmluZ2lmeShzdGF0cywgbnVsbCwgMSkpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIHZhYWRpbkJ1bmRsZXNQbHVnaW4oKTogUGx1Z2luT3B0aW9uIHtcbiAgdHlwZSBFeHBvcnRJbmZvID1cbiAgICB8IHN0cmluZ1xuICAgIHwge1xuICAgICAgICBuYW1lc3BhY2U/OiBzdHJpbmc7XG4gICAgICAgIHNvdXJjZTogc3RyaW5nO1xuICAgICAgfTtcblxuICB0eXBlIEV4cG9zZUluZm8gPSB7XG4gICAgZXhwb3J0czogRXhwb3J0SW5mb1tdO1xuICB9O1xuXG4gIHR5cGUgUGFja2FnZUluZm8gPSB7XG4gICAgdmVyc2lvbjogc3RyaW5nO1xuICAgIGV4cG9zZXM6IFJlY29yZDxzdHJpbmcsIEV4cG9zZUluZm8+O1xuICB9O1xuXG4gIHR5cGUgQnVuZGxlSnNvbiA9IHtcbiAgICBwYWNrYWdlczogUmVjb3JkPHN0cmluZywgUGFja2FnZUluZm8+O1xuICB9O1xuXG4gIGNvbnN0IGRpc2FibGVkTWVzc2FnZSA9ICdWYWFkaW4gY29tcG9uZW50IGRlcGVuZGVuY3kgYnVuZGxlcyBhcmUgZGlzYWJsZWQuJztcblxuICBjb25zdCBtb2R1bGVzRGlyZWN0b3J5ID0gbm9kZU1vZHVsZXNGb2xkZXIucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gIGxldCB2YWFkaW5CdW5kbGVKc29uOiBCdW5kbGVKc29uO1xuXG4gIGZ1bmN0aW9uIHBhcnNlTW9kdWxlSWQoaWQ6IHN0cmluZyk6IHsgcGFja2FnZU5hbWU6IHN0cmluZzsgbW9kdWxlUGF0aDogc3RyaW5nIH0ge1xuICAgIGNvbnN0IFtzY29wZSwgc2NvcGVkUGFja2FnZU5hbWVdID0gaWQuc3BsaXQoJy8nLCAzKTtcbiAgICBjb25zdCBwYWNrYWdlTmFtZSA9IHNjb3BlLnN0YXJ0c1dpdGgoJ0AnKSA/IGAke3Njb3BlfS8ke3Njb3BlZFBhY2thZ2VOYW1lfWAgOiBzY29wZTtcbiAgICBjb25zdCBtb2R1bGVQYXRoID0gYC4ke2lkLnN1YnN0cmluZyhwYWNrYWdlTmFtZS5sZW5ndGgpfWA7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhY2thZ2VOYW1lLFxuICAgICAgbW9kdWxlUGF0aFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRFeHBvcnRzKGlkOiBzdHJpbmcpOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgeyBwYWNrYWdlTmFtZSwgbW9kdWxlUGF0aCB9ID0gcGFyc2VNb2R1bGVJZChpZCk7XG4gICAgY29uc3QgcGFja2FnZUluZm8gPSB2YWFkaW5CdW5kbGVKc29uLnBhY2thZ2VzW3BhY2thZ2VOYW1lXTtcblxuICAgIGlmICghcGFja2FnZUluZm8pIHJldHVybjtcblxuICAgIGNvbnN0IGV4cG9zZUluZm86IEV4cG9zZUluZm8gPSBwYWNrYWdlSW5mby5leHBvc2VzW21vZHVsZVBhdGhdO1xuICAgIGlmICghZXhwb3NlSW5mbykgcmV0dXJuO1xuXG4gICAgY29uc3QgZXhwb3J0c1NldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgZSBvZiBleHBvc2VJbmZvLmV4cG9ydHMpIHtcbiAgICAgIGlmICh0eXBlb2YgZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZXhwb3J0c1NldC5hZGQoZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB7IG5hbWVzcGFjZSwgc291cmNlIH0gPSBlO1xuICAgICAgICBpZiAobmFtZXNwYWNlKSB7XG4gICAgICAgICAgZXhwb3J0c1NldC5hZGQobmFtZXNwYWNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBzb3VyY2VFeHBvcnRzID0gZ2V0RXhwb3J0cyhzb3VyY2UpO1xuICAgICAgICAgIGlmIChzb3VyY2VFeHBvcnRzKSB7XG4gICAgICAgICAgICBzb3VyY2VFeHBvcnRzLmZvckVhY2goKGUpID0+IGV4cG9ydHNTZXQuYWRkKGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZXhwb3J0c1NldCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRFeHBvcnRCaW5kaW5nKGJpbmRpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBiaW5kaW5nID09PSAnZGVmYXVsdCcgPyAnX2RlZmF1bHQgYXMgZGVmYXVsdCcgOiBiaW5kaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW1wb3J0QXNzaWdtZW50KGJpbmRpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBiaW5kaW5nID09PSAnZGVmYXVsdCcgPyAnZGVmYXVsdDogX2RlZmF1bHQnIDogYmluZGluZztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjpidW5kbGVzJyxcbiAgICBlbmZvcmNlOiAncHJlJyxcbiAgICBhcHBseShjb25maWcsIHsgY29tbWFuZCB9KSB7XG4gICAgICBpZiAoY29tbWFuZCAhPT0gJ3NlcnZlJykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWFkaW5CdW5kbGVKc29uUGF0aCA9IHJlcXVpcmUucmVzb2x2ZSgnQHZhYWRpbi9idW5kbGVzL3ZhYWRpbi1idW5kbGUuanNvbicpO1xuICAgICAgICB2YWFkaW5CdW5kbGVKc29uID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmModmFhZGluQnVuZGxlSnNvblBhdGgsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KSk7XG4gICAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZSA9PT0gJ29iamVjdCcgJiYgKGUgYXMgeyBjb2RlOiBzdHJpbmcgfSkuY29kZSA9PT0gJ01PRFVMRV9OT1RfRk9VTkQnKSB7XG4gICAgICAgICAgdmFhZGluQnVuZGxlSnNvbiA9IHsgcGFja2FnZXM6IHt9IH07XG4gICAgICAgICAgY29uc29sZS5pbmZvKGBAdmFhZGluL2J1bmRsZXMgbnBtIHBhY2thZ2UgaXMgbm90IGZvdW5kLCAke2Rpc2FibGVkTWVzc2FnZX1gKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCB2ZXJzaW9uTWlzbWF0Y2hlczogQXJyYXk8eyBuYW1lOiBzdHJpbmc7IGJ1bmRsZWRWZXJzaW9uOiBzdHJpbmc7IGluc3RhbGxlZFZlcnNpb246IHN0cmluZyB9PiA9IFtdO1xuICAgICAgZm9yIChjb25zdCBbbmFtZSwgcGFja2FnZUluZm9dIG9mIE9iamVjdC5lbnRyaWVzKHZhYWRpbkJ1bmRsZUpzb24ucGFja2FnZXMpKSB7XG4gICAgICAgIGxldCBpbnN0YWxsZWRWZXJzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgeyB2ZXJzaW9uOiBidW5kbGVkVmVyc2lvbiB9ID0gcGFja2FnZUluZm87XG4gICAgICAgICAgY29uc3QgaW5zdGFsbGVkUGFja2FnZUpzb25GaWxlID0gcGF0aC5yZXNvbHZlKG1vZHVsZXNEaXJlY3RvcnksIG5hbWUsICdwYWNrYWdlLmpzb24nKTtcbiAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKGluc3RhbGxlZFBhY2thZ2VKc29uRmlsZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pKTtcbiAgICAgICAgICBpbnN0YWxsZWRWZXJzaW9uID0gcGFja2FnZUpzb24udmVyc2lvbjtcbiAgICAgICAgICBpZiAoaW5zdGFsbGVkVmVyc2lvbiAmJiBpbnN0YWxsZWRWZXJzaW9uICE9PSBidW5kbGVkVmVyc2lvbikge1xuICAgICAgICAgICAgdmVyc2lvbk1pc21hdGNoZXMucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgIGJ1bmRsZWRWZXJzaW9uLFxuICAgICAgICAgICAgICBpbnN0YWxsZWRWZXJzaW9uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICAvLyBpZ25vcmUgcGFja2FnZSBub3QgZm91bmRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHZlcnNpb25NaXNtYXRjaGVzLmxlbmd0aCkge1xuICAgICAgICBjb25zb2xlLmluZm8oYEB2YWFkaW4vYnVuZGxlcyBoYXMgdmVyc2lvbiBtaXNtYXRjaGVzIHdpdGggaW5zdGFsbGVkIHBhY2thZ2VzLCAke2Rpc2FibGVkTWVzc2FnZX1gKTtcbiAgICAgICAgY29uc29sZS5pbmZvKGBQYWNrYWdlcyB3aXRoIHZlcnNpb24gbWlzbWF0Y2hlczogJHtKU09OLnN0cmluZ2lmeSh2ZXJzaW9uTWlzbWF0Y2hlcywgdW5kZWZpbmVkLCAyKX1gKTtcbiAgICAgICAgdmFhZGluQnVuZGxlSnNvbiA9IHsgcGFja2FnZXM6IHt9IH07XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBhc3luYyBjb25maWcoY29uZmlnKSB7XG4gICAgICByZXR1cm4gbWVyZ2VDb25maWcoXG4gICAgICAgIHtcbiAgICAgICAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgICAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgICAgICAgLy8gVmFhZGluIGJ1bmRsZVxuICAgICAgICAgICAgICAnQHZhYWRpbi9idW5kbGVzJyxcbiAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXModmFhZGluQnVuZGxlSnNvbi5wYWNrYWdlcyksXG4gICAgICAgICAgICAgICdAdmFhZGluL3ZhYWRpbi1tYXRlcmlhbC1zdHlsZXMnXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb25maWdcbiAgICAgICk7XG4gICAgfSxcbiAgICBsb2FkKHJhd0lkKSB7XG4gICAgICBjb25zdCBbcGF0aCwgcGFyYW1zXSA9IHJhd0lkLnNwbGl0KCc/Jyk7XG4gICAgICBpZiAoIXBhdGguc3RhcnRzV2l0aChtb2R1bGVzRGlyZWN0b3J5KSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBpZCA9IHBhdGguc3Vic3RyaW5nKG1vZHVsZXNEaXJlY3RvcnkubGVuZ3RoICsgMSk7XG4gICAgICBjb25zdCBiaW5kaW5ncyA9IGdldEV4cG9ydHMoaWQpO1xuICAgICAgaWYgKGJpbmRpbmdzID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgY29uc3QgY2FjaGVTdWZmaXggPSBwYXJhbXMgPyBgPyR7cGFyYW1zfWAgOiAnJztcbiAgICAgIGNvbnN0IGJ1bmRsZVBhdGggPSBgQHZhYWRpbi9idW5kbGVzL3ZhYWRpbi5qcyR7Y2FjaGVTdWZmaXh9YDtcblxuICAgICAgcmV0dXJuIGBpbXBvcnQgeyBpbml0IGFzIFZhYWRpbkJ1bmRsZUluaXQsIGdldCBhcyBWYWFkaW5CdW5kbGVHZXQgfSBmcm9tICcke2J1bmRsZVBhdGh9JztcbmF3YWl0IFZhYWRpbkJ1bmRsZUluaXQoJ2RlZmF1bHQnKTtcbmNvbnN0IHsgJHtiaW5kaW5ncy5tYXAoZ2V0SW1wb3J0QXNzaWdtZW50KS5qb2luKCcsICcpfSB9ID0gKGF3YWl0IFZhYWRpbkJ1bmRsZUdldCgnLi9ub2RlX21vZHVsZXMvJHtpZH0nKSkoKTtcbmV4cG9ydCB7ICR7YmluZGluZ3MubWFwKGdldEV4cG9ydEJpbmRpbmcpLmpvaW4oJywgJyl9IH07YDtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRoZW1lUGx1Z2luKG9wdHM6IHsgZGV2TW9kZTogYm9vbGVhbiB9KTogUGx1Z2luT3B0aW9uIHtcbiAgY29uc3QgZnVsbFRoZW1lT3B0aW9ucyA9IHsgLi4udGhlbWVPcHRpb25zLCBkZXZNb2RlOiBvcHRzLmRldk1vZGUgfTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOnRoZW1lJyxcbiAgICBjb25maWcoKSB7XG4gICAgICBwcm9jZXNzVGhlbWVSZXNvdXJjZXMoZnVsbFRoZW1lT3B0aW9ucywgY29uc29sZSk7XG4gICAgfSxcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBmdW5jdGlvbiBoYW5kbGVUaGVtZUZpbGVDcmVhdGVEZWxldGUodGhlbWVGaWxlOiBzdHJpbmcsIHN0YXRzPzogU3RhdHMpIHtcbiAgICAgICAgaWYgKHRoZW1lRmlsZS5zdGFydHNXaXRoKHRoZW1lRm9sZGVyKSkge1xuICAgICAgICAgIGNvbnN0IGNoYW5nZWQgPSBwYXRoLnJlbGF0aXZlKHRoZW1lRm9sZGVyLCB0aGVtZUZpbGUpO1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1RoZW1lIGZpbGUgJyArICghIXN0YXRzID8gJ2NyZWF0ZWQnIDogJ2RlbGV0ZWQnKSwgY2hhbmdlZCk7XG4gICAgICAgICAgcHJvY2Vzc1RoZW1lUmVzb3VyY2VzKGZ1bGxUaGVtZU9wdGlvbnMsIGNvbnNvbGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXJ2ZXIud2F0Y2hlci5vbignYWRkJywgaGFuZGxlVGhlbWVGaWxlQ3JlYXRlRGVsZXRlKTtcbiAgICAgIHNlcnZlci53YXRjaGVyLm9uKCd1bmxpbmsnLCBoYW5kbGVUaGVtZUZpbGVDcmVhdGVEZWxldGUpO1xuICAgIH0sXG4gICAgaGFuZGxlSG90VXBkYXRlKGNvbnRleHQpIHtcbiAgICAgIGNvbnN0IGNvbnRleHRQYXRoID0gcGF0aC5yZXNvbHZlKGNvbnRleHQuZmlsZSk7XG4gICAgICBjb25zdCB0aGVtZVBhdGggPSBwYXRoLnJlc29sdmUodGhlbWVGb2xkZXIpO1xuICAgICAgaWYgKGNvbnRleHRQYXRoLnN0YXJ0c1dpdGgodGhlbWVQYXRoKSkge1xuICAgICAgICBjb25zdCBjaGFuZ2VkID0gcGF0aC5yZWxhdGl2ZSh0aGVtZVBhdGgsIGNvbnRleHRQYXRoKTtcblxuICAgICAgICBjb25zb2xlLmRlYnVnKCdUaGVtZSBmaWxlIGNoYW5nZWQnLCBjaGFuZ2VkKTtcblxuICAgICAgICBpZiAoY2hhbmdlZC5zdGFydHNXaXRoKHNldHRpbmdzLnRoZW1lTmFtZSkpIHtcbiAgICAgICAgICBwcm9jZXNzVGhlbWVSZXNvdXJjZXMoZnVsbFRoZW1lT3B0aW9ucywgY29uc29sZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jIHJlc29sdmVJZChpZCwgaW1wb3J0ZXIpIHtcbiAgICAgIC8vIGZvcmNlIHRoZW1lIGdlbmVyYXRpb24gaWYgZ2VuZXJhdGVkIHRoZW1lIHNvdXJjZXMgZG9lcyBub3QgeWV0IGV4aXN0XG4gICAgICAvLyB0aGlzIG1heSBoYXBwZW4gZm9yIGV4YW1wbGUgZHVyaW5nIEphdmEgaG90IHJlbG9hZCB3aGVuIHVwZGF0aW5nXG4gICAgICAvLyBAVGhlbWUgYW5ub3RhdGlvbiB2YWx1ZVxuICAgICAgaWYgKFxuICAgICAgICBwYXRoLnJlc29sdmUodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLCAndGhlbWUuanMnKSA9PT0gaW1wb3J0ZXIgJiZcbiAgICAgICAgIWV4aXN0c1N5bmMocGF0aC5yZXNvbHZlKHRoZW1lT3B0aW9ucy5mcm9udGVuZEdlbmVyYXRlZEZvbGRlciwgaWQpKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ0dlbmVyYXRlIHRoZW1lIGZpbGUgJyArIGlkICsgJyBub3QgZXhpc3RpbmcuIFByb2Nlc3NpbmcgdGhlbWUgcmVzb3VyY2UnKTtcbiAgICAgICAgcHJvY2Vzc1RoZW1lUmVzb3VyY2VzKGZ1bGxUaGVtZU9wdGlvbnMsIGNvbnNvbGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWlkLnN0YXJ0c1dpdGgoc2V0dGluZ3MudGhlbWVGb2xkZXIpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgbG9jYXRpb24gb2YgW3RoZW1lUmVzb3VyY2VGb2xkZXIsIGZyb250ZW5kRm9sZGVyXSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJlc29sdmUocGF0aC5yZXNvbHZlKGxvY2F0aW9uLCBpZCkpO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgdHJhbnNmb3JtKHJhdywgaWQsIG9wdGlvbnMpIHtcbiAgICAgIC8vIHJld3JpdGUgdXJscyBmb3IgdGhlIGFwcGxpY2F0aW9uIHRoZW1lIGNzcyBmaWxlc1xuICAgICAgY29uc3QgW2JhcmVJZCwgcXVlcnldID0gaWQuc3BsaXQoJz8nKTtcbiAgICAgIGlmIChcbiAgICAgICAgKCFiYXJlSWQ/LnN0YXJ0c1dpdGgodGhlbWVGb2xkZXIpICYmICFiYXJlSWQ/LnN0YXJ0c1dpdGgodGhlbWVPcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIpKSB8fFxuICAgICAgICAhYmFyZUlkPy5lbmRzV2l0aCgnLmNzcycpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVzb3VyY2VUaGVtZUZvbGRlciA9IGJhcmVJZC5zdGFydHNXaXRoKHRoZW1lRm9sZGVyKSA/IHRoZW1lRm9sZGVyIDogdGhlbWVPcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXI7XG4gICAgICBjb25zdCBbdGhlbWVOYW1lXSA9ICBiYXJlSWQuc3Vic3RyaW5nKHJlc291cmNlVGhlbWVGb2xkZXIubGVuZ3RoICsgMSkuc3BsaXQoJy8nKTtcbiAgICAgIHJldHVybiByZXdyaXRlQ3NzVXJscyhyYXcsIHBhdGguZGlybmFtZShiYXJlSWQpLCBwYXRoLnJlc29sdmUocmVzb3VyY2VUaGVtZUZvbGRlciwgdGhlbWVOYW1lKSwgY29uc29sZSwgb3B0cyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBydW5XYXRjaERvZyh3YXRjaERvZ1BvcnQ6IG51bWJlciwgd2F0Y2hEb2dIb3N0OiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgY29uc3QgY2xpZW50ID0gbmV3IG5ldC5Tb2NrZXQoKTtcbiAgY2xpZW50LnNldEVuY29kaW5nKCd1dGY4Jyk7XG4gIGNsaWVudC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coJ1dhdGNoZG9nIGNvbm5lY3Rpb24gZXJyb3IuIFRlcm1pbmF0aW5nIHZpdGUgcHJvY2Vzcy4uLicsIGVycik7XG4gICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICBwcm9jZXNzLmV4aXQoMCk7XG4gIH0pO1xuICBjbGllbnQub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgIGNsaWVudC5kZXN0cm95KCk7XG4gICAgcnVuV2F0Y2hEb2cod2F0Y2hEb2dQb3J0LCB3YXRjaERvZ0hvc3QpO1xuICB9KTtcblxuICBjbGllbnQuY29ubmVjdCh3YXRjaERvZ1BvcnQsIHdhdGNoRG9nSG9zdCB8fCAnbG9jYWxob3N0Jyk7XG59XG5cbmNvbnN0IGFsbG93ZWRGcm9udGVuZEZvbGRlcnMgPSBbZnJvbnRlbmRGb2xkZXIsIG5vZGVNb2R1bGVzRm9sZGVyXTtcblxuZnVuY3Rpb24gc2hvd1JlY29tcGlsZVJlYXNvbigpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2YWFkaW46d2h5LXlvdS1jb21waWxlJyxcbiAgICBoYW5kbGVIb3RVcGRhdGUoY29udGV4dCkge1xuICAgICAgY29uc29sZS5sb2coJ1JlY29tcGlsaW5nIGJlY2F1c2UnLCBjb250ZXh0LmZpbGUsICdjaGFuZ2VkJyk7XG4gICAgfVxuICB9O1xufVxuXG5jb25zdCBERVZfTU9ERV9TVEFSVF9SRUdFWFAgPSAvXFwvXFwqW1xcKiFdXFxzK3ZhYWRpbi1kZXYtbW9kZTpzdGFydC87XG5jb25zdCBERVZfTU9ERV9DT0RFX1JFR0VYUCA9IC9cXC9cXCpbXFwqIV1cXHMrdmFhZGluLWRldi1tb2RlOnN0YXJ0KFtcXHNcXFNdKil2YWFkaW4tZGV2LW1vZGU6ZW5kXFxzK1xcKlxcKlxcLy9pO1xuXG5mdW5jdGlvbiBwcmVzZXJ2ZVVzYWdlU3RhdHMoKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjpwcmVzZXJ2ZS11c2FnZS1zdGF0cycsXG5cbiAgICB0cmFuc2Zvcm0oc3JjOiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcbiAgICAgIGlmIChpZC5pbmNsdWRlcygndmFhZGluLXVzYWdlLXN0YXRpc3RpY3MnKSkge1xuICAgICAgICBpZiAoc3JjLmluY2x1ZGVzKCd2YWFkaW4tZGV2LW1vZGU6c3RhcnQnKSkge1xuICAgICAgICAgIGNvbnN0IG5ld1NyYyA9IHNyYy5yZXBsYWNlKERFVl9NT0RFX1NUQVJUX1JFR0VYUCwgJy8qISB2YWFkaW4tZGV2LW1vZGU6c3RhcnQnKTtcbiAgICAgICAgICBpZiAobmV3U3JjID09PSBzcmMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbW1lbnQgcmVwbGFjZW1lbnQgZmFpbGVkIHRvIGNoYW5nZSBhbnl0aGluZycpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIW5ld1NyYy5tYXRjaChERVZfTU9ERV9DT0RFX1JFR0VYUCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05ldyBjb21tZW50IGZhaWxzIHRvIG1hdGNoIG9yaWdpbmFsIHJlZ2V4cCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4geyBjb2RlOiBuZXdTcmMgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgY29kZTogc3JjIH07XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgdmFhZGluQ29uZmlnOiBVc2VyQ29uZmlnRm4gPSAoZW52KSA9PiB7XG4gIGNvbnN0IGRldk1vZGUgPSBlbnYubW9kZSA9PT0gJ2RldmVsb3BtZW50JztcbiAgY29uc3QgcHJvZHVjdGlvbk1vZGUgPSAhZGV2TW9kZSAmJiAhZGV2QnVuZGxlXG5cbiAgaWYgKGRldk1vZGUgJiYgcHJvY2Vzcy5lbnYud2F0Y2hEb2dQb3J0KSB7XG4gICAgLy8gT3BlbiBhIGNvbm5lY3Rpb24gd2l0aCB0aGUgSmF2YSBkZXYtbW9kZSBoYW5kbGVyIGluIG9yZGVyIHRvIGZpbmlzaFxuICAgIC8vIHZpdGUgd2hlbiBpdCBleGl0cyBvciBjcmFzaGVzLlxuICAgIHJ1bldhdGNoRG9nKHBhcnNlSW50KHByb2Nlc3MuZW52LndhdGNoRG9nUG9ydCksIHByb2Nlc3MuZW52LndhdGNoRG9nSG9zdCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJvb3Q6IGZyb250ZW5kRm9sZGVyLFxuICAgIGJhc2U6ICcnLFxuICAgIHB1YmxpY0RpcjogZmFsc2UsXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0B2YWFkaW4vZmxvdy1mcm9udGVuZCc6IGphclJlc291cmNlc0ZvbGRlcixcbiAgICAgICAgRnJvbnRlbmQ6IGZyb250ZW5kRm9sZGVyXG4gICAgICB9LFxuICAgICAgcHJlc2VydmVTeW1saW5rczogdHJ1ZVxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICBPRkZMSU5FX1BBVEg6IHNldHRpbmdzLm9mZmxpbmVQYXRoLFxuICAgICAgVklURV9FTkFCTEVEOiAndHJ1ZSdcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogJzEyNy4wLjAuMScsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgZnM6IHtcbiAgICAgICAgYWxsb3c6IGFsbG93ZWRGcm9udGVuZEZvbGRlcnNcbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBtaW5pZnk6IHByb2R1Y3Rpb25Nb2RlLFxuICAgICAgb3V0RGlyOiBidWlsZE91dHB1dEZvbGRlcixcbiAgICAgIGVtcHR5T3V0RGlyOiBkZXZCdW5kbGUsXG4gICAgICBhc3NldHNEaXI6ICdWQUFESU4vYnVpbGQnLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBpbnB1dDoge1xuICAgICAgICAgIGluZGV4aHRtbDogcHJvamVjdEluZGV4SHRtbCxcblxuICAgICAgICAgIC4uLihoYXNFeHBvcnRlZFdlYkNvbXBvbmVudHMgPyB7IHdlYmNvbXBvbmVudGh0bWw6IHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ3dlYi1jb21wb25lbnQuaHRtbCcpIH0gOiB7fSlcbiAgICAgICAgfSxcbiAgICAgICAgb253YXJuOiAod2FybmluZzogcm9sbHVwLlJvbGx1cExvZywgZGVmYXVsdEhhbmRsZXI6IHJvbGx1cC5Mb2dnaW5nRnVuY3Rpb24pID0+IHtcbiAgICAgICAgICBjb25zdCBpZ25vcmVFdmFsV2FybmluZyA9IFtcbiAgICAgICAgICAgICdnZW5lcmF0ZWQvamFyLXJlc291cmNlcy9GbG93Q2xpZW50LmpzJyxcbiAgICAgICAgICAgICdnZW5lcmF0ZWQvamFyLXJlc291cmNlcy92YWFkaW4tc3ByZWFkc2hlZXQvc3ByZWFkc2hlZXQtZXhwb3J0LmpzJyxcbiAgICAgICAgICAgICdAdmFhZGluL2NoYXJ0cy9zcmMvaGVscGVycy5qcydcbiAgICAgICAgICBdO1xuICAgICAgICAgIGlmICh3YXJuaW5nLmNvZGUgPT09ICdFVkFMJyAmJiB3YXJuaW5nLmlkICYmICEhaWdub3JlRXZhbFdhcm5pbmcuZmluZCgoaWQpID0+IHdhcm5pbmcuaWQ/LmVuZHNXaXRoKGlkKSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVmYXVsdEhhbmRsZXIod2FybmluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZW50cmllczogW1xuICAgICAgICAvLyBQcmUtc2NhbiBlbnRyeXBvaW50cyBpbiBWaXRlIHRvIGF2b2lkIHJlbG9hZGluZyBvbiBmaXJzdCBvcGVuXG4gICAgICAgICdnZW5lcmF0ZWQvdmFhZGluLnRzJ1xuICAgICAgXSxcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgJ0B2YWFkaW4vcm91dGVyJyxcbiAgICAgICAgJ0B2YWFkaW4vdmFhZGluLWxpY2Vuc2UtY2hlY2tlcicsXG4gICAgICAgICdAdmFhZGluL3ZhYWRpbi11c2FnZS1zdGF0aXN0aWNzJyxcbiAgICAgICAgJ3dvcmtib3gtY29yZScsXG4gICAgICAgICd3b3JrYm94LXByZWNhY2hpbmcnLFxuICAgICAgICAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgJ3dvcmtib3gtc3RyYXRlZ2llcydcbiAgICAgIF1cbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHByb2R1Y3Rpb25Nb2RlICYmIGJyb3RsaSgpLFxuICAgICAgZGV2TW9kZSAmJiB2YWFkaW5CdW5kbGVzUGx1Z2luKCksXG4gICAgICBkZXZNb2RlICYmIHNob3dSZWNvbXBpbGVSZWFzb24oKSxcbiAgICAgIHNldHRpbmdzLm9mZmxpbmVFbmFibGVkICYmIGJ1aWxkU1dQbHVnaW4oeyBkZXZNb2RlIH0pLFxuICAgICAgIWRldk1vZGUgJiYgc3RhdHNFeHRyYWN0ZXJQbHVnaW4oKSxcbiAgICAgICFwcm9kdWN0aW9uTW9kZSAmJiBwcmVzZXJ2ZVVzYWdlU3RhdHMoKSxcbiAgICAgIHRoZW1lUGx1Z2luKHsgZGV2TW9kZSB9KSxcbiAgICAgIHBvc3Rjc3NMaXQoe1xuICAgICAgICBpbmNsdWRlOiBbJyoqLyouY3NzJywgLy4qXFwvLipcXC5jc3NcXD8uKi9dLFxuICAgICAgICBleGNsdWRlOiBbXG4gICAgICAgICAgYCR7dGhlbWVGb2xkZXJ9LyoqLyouY3NzYCxcbiAgICAgICAgICBuZXcgUmVnRXhwKGAke3RoZW1lRm9sZGVyfS8uKi8uKlxcXFwuY3NzXFxcXD8uKmApLFxuICAgICAgICAgIGAke3RoZW1lUmVzb3VyY2VGb2xkZXJ9LyoqLyouY3NzYCxcbiAgICAgICAgICBuZXcgUmVnRXhwKGAke3RoZW1lUmVzb3VyY2VGb2xkZXJ9Ly4qLy4qXFxcXC5jc3NcXFxcPy4qYCksXG4gICAgICAgICAgbmV3IFJlZ0V4cCgnLiovLipcXFxcP2h0bWwtcHJveHkuKicpXG4gICAgICAgIF1cbiAgICAgIH0pLFxuICAgICAgLy8gVGhlIFJlYWN0IHBsdWdpbiBwcm92aWRlcyBmYXN0IHJlZnJlc2ggYW5kIGRlYnVnIHNvdXJjZSBpbmZvXG4gICAgICByZWFjdFBsdWdpbih7XG4gICAgICAgIGluY2x1ZGU6ICcqKi8qLnRzeCcsXG4gICAgICAgIGJhYmVsOiB7XG4gICAgICAgICAgLy8gV2UgbmVlZCB0byB1c2UgYmFiZWwgdG8gcHJvdmlkZSB0aGUgc291cmNlIGluZm9ybWF0aW9uIGZvciBpdCB0byBiZSBjb3JyZWN0XG4gICAgICAgICAgLy8gKG90aGVyd2lzZSBCYWJlbCB3aWxsIHNsaWdodGx5IHJld3JpdGUgdGhlIHNvdXJjZSBmaWxlIGFuZCBlc2J1aWxkIGdlbmVyYXRlIHNvdXJjZSBpbmZvIGZvciB0aGUgbW9kaWZpZWQgZmlsZSlcbiAgICAgICAgICBwcmVzZXRzOiBbWydAYmFiZWwvcHJlc2V0LXJlYWN0JywgeyBydW50aW1lOiAnYXV0b21hdGljJywgZGV2ZWxvcG1lbnQ6ICFwcm9kdWN0aW9uTW9kZSB9XV0sXG4gICAgICAgICAgLy8gUmVhY3Qgd3JpdGVzIHRoZSBzb3VyY2UgbG9jYXRpb24gZm9yIHdoZXJlIGNvbXBvbmVudHMgYXJlIHVzZWQsIHRoaXMgd3JpdGVzIGZvciB3aGVyZSB0aGV5IGFyZSBkZWZpbmVkXG4gICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgIXByb2R1Y3Rpb25Nb2RlICYmIGFkZEZ1bmN0aW9uQ29tcG9uZW50U291cmNlTG9jYXRpb25CYWJlbCgpLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnbW9kdWxlOkBwcmVhY3Qvc2lnbmFscy1yZWFjdC10cmFuc2Zvcm0nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbW9kZTogJ2FsbCcgLy8gTmVlZGVkIHRvIGluY2x1ZGUgdHJhbnNsYXRpb25zIHdoaWNoIGRvIG5vdCB1c2Ugc29tZXRoaW5nLnZhbHVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdLmZpbHRlcihCb29sZWFuKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3ZhYWRpbjpmb3JjZS1yZW1vdmUtaHRtbC1taWRkbGV3YXJlJyxcbiAgICAgICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMuc3RhY2sgPSBzZXJ2ZXIubWlkZGxld2FyZXMuc3RhY2suZmlsdGVyKChtdykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBoYW5kbGVOYW1lID0gYCR7bXcuaGFuZGxlfWA7XG4gICAgICAgICAgICAgIHJldHVybiAhaGFuZGxlTmFtZS5pbmNsdWRlcygndml0ZUh0bWxGYWxsYmFja01pZGRsZXdhcmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgaGFzRXhwb3J0ZWRXZWJDb21wb25lbnRzICYmIHtcbiAgICAgICAgbmFtZTogJ3ZhYWRpbjppbmplY3QtZW50cnlwb2ludHMtdG8td2ViLWNvbXBvbmVudC1odG1sJyxcbiAgICAgICAgdHJhbnNmb3JtSW5kZXhIdG1sOiB7XG4gICAgICAgICAgb3JkZXI6ICdwcmUnLFxuICAgICAgICAgIGhhbmRsZXIoX2h0bWwsIHsgcGF0aCwgc2VydmVyIH0pIHtcbiAgICAgICAgICAgIGlmIChwYXRoICE9PSAnL3dlYi1jb21wb25lbnQuaHRtbCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGFnOiAnc2NyaXB0JyxcbiAgICAgICAgICAgICAgICBhdHRyczogeyB0eXBlOiAnbW9kdWxlJywgc3JjOiBgL2dlbmVyYXRlZC92YWFkaW4td2ViLWNvbXBvbmVudC50c2AgfSxcbiAgICAgICAgICAgICAgICBpbmplY3RUbzogJ2hlYWQnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAndmFhZGluOmluamVjdC1lbnRyeXBvaW50cy10by1pbmRleC1odG1sJyxcbiAgICAgICAgdHJhbnNmb3JtSW5kZXhIdG1sOiB7XG4gICAgICAgICAgb3JkZXI6ICdwcmUnLFxuICAgICAgICAgIGhhbmRsZXIoX2h0bWwsIHsgcGF0aCwgc2VydmVyIH0pIHtcbiAgICAgICAgICAgIGlmIChwYXRoICE9PSAnL2luZGV4Lmh0bWwnKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2NyaXB0cyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoZGV2TW9kZSkge1xuICAgICAgICAgICAgICBzY3JpcHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRhZzogJ3NjcmlwdCcsXG4gICAgICAgICAgICAgICAgYXR0cnM6IHsgdHlwZTogJ21vZHVsZScsIHNyYzogYC9nZW5lcmF0ZWQvdml0ZS1kZXZtb2RlLnRzYCwgb25lcnJvcjogXCJkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQoKVwiIH0sXG4gICAgICAgICAgICAgICAgaW5qZWN0VG86ICdoZWFkJ1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjcmlwdHMucHVzaCh7XG4gICAgICAgICAgICAgIHRhZzogJ3NjcmlwdCcsXG4gICAgICAgICAgICAgIGF0dHJzOiB7IHR5cGU6ICdtb2R1bGUnLCBzcmM6ICcvZ2VuZXJhdGVkL3ZhYWRpbi50cycgfSxcbiAgICAgICAgICAgICAgaW5qZWN0VG86ICdoZWFkJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gc2NyaXB0cztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjaGVja2VyKHtcbiAgICAgICAgdHlwZXNjcmlwdDogdHJ1ZVxuICAgICAgfSksXG4gICAgICBwcm9kdWN0aW9uTW9kZSAmJiB2aXN1YWxpemVyKHsgYnJvdGxpU2l6ZTogdHJ1ZSwgZmlsZW5hbWU6IGJ1bmRsZVNpemVGaWxlIH0pXG4gICAgICBcbiAgICBdXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3Qgb3ZlcnJpZGVWYWFkaW5Db25maWcgPSAoY3VzdG9tQ29uZmlnOiBVc2VyQ29uZmlnRm4pID0+IHtcbiAgcmV0dXJuIGRlZmluZUNvbmZpZygoZW52KSA9PiBtZXJnZUNvbmZpZyh2YWFkaW5Db25maWcoZW52KSwgY3VzdG9tQ29uZmlnKGVudikpKTtcbn07XG5mdW5jdGlvbiBnZXRWZXJzaW9uKG1vZHVsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFja2FnZUpzb24gPSBwYXRoLnJlc29sdmUobm9kZU1vZHVsZXNGb2xkZXIsIG1vZHVsZSwgJ3BhY2thZ2UuanNvbicpO1xuICByZXR1cm4gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGFja2FnZUpzb24sIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkpLnZlcnNpb247XG59XG5mdW5jdGlvbiBnZXRDdmRsTmFtZShtb2R1bGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhY2thZ2VKc29uID0gcGF0aC5yZXNvbHZlKG5vZGVNb2R1bGVzRm9sZGVyLCBtb2R1bGUsICdwYWNrYWdlLmpzb24nKTtcbiAgcmV0dXJuIEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKHBhY2thZ2VKc29uLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKS5jdmRsTmFtZTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQmFzaWxHSUJNXFxcXElkZWFQcm9qZWN0c1xcXFxjb250YWN0YXBwXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXGFwcGxpY2F0aW9uLXRoZW1lLXBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQmFzaWxHSUJNXFxcXElkZWFQcm9qZWN0c1xcXFxjb250YWN0YXBwXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXGFwcGxpY2F0aW9uLXRoZW1lLXBsdWdpblxcXFx0aGVtZS1oYW5kbGUuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0Jhc2lsR0lCTS9JZGVhUHJvamVjdHMvY29udGFjdGFwcC90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtaGFuZGxlLmpzXCI7LypcbiAqIENvcHlyaWdodCAyMDAwLTIwMjQgVmFhZGluIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdFxuICogdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2ZcbiAqIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUXG4gKiBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGVcbiAqIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyXG4gKiB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgZmlsZSBjb250YWlucyBmdW5jdGlvbnMgZm9yIGxvb2sgdXAgYW5kIGhhbmRsZSB0aGUgdGhlbWUgcmVzb3VyY2VzXG4gKiBmb3IgYXBwbGljYXRpb24gdGhlbWUgcGx1Z2luLlxuICovXG5pbXBvcnQgeyBleGlzdHNTeW5jLCByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyB3cml0ZVRoZW1lRmlsZXMgfSBmcm9tICcuL3RoZW1lLWdlbmVyYXRvci5qcyc7XG5pbXBvcnQgeyBjb3B5U3RhdGljQXNzZXRzLCBjb3B5VGhlbWVSZXNvdXJjZXMgfSBmcm9tICcuL3RoZW1lLWNvcHkuanMnO1xuXG4vLyBtYXRjaGVzIHRoZW1lIG5hbWUgaW4gJy4vdGhlbWUtbXktdGhlbWUuZ2VuZXJhdGVkLmpzJ1xuY29uc3QgbmFtZVJlZ2V4ID0gL3RoZW1lLSguKilcXC5nZW5lcmF0ZWRcXC5qcy87XG5cbmxldCBwcmV2VGhlbWVOYW1lID0gdW5kZWZpbmVkO1xubGV0IGZpcnN0VGhlbWVOYW1lID0gdW5kZWZpbmVkO1xuXG4vKipcbiAqIExvb2tzIHVwIGZvciBhIHRoZW1lIHJlc291cmNlcyBpbiBhIGN1cnJlbnQgcHJvamVjdCBhbmQgaW4gamFyIGRlcGVuZGVuY2llcyxcbiAqIGNvcGllcyB0aGUgZm91bmQgcmVzb3VyY2VzIGFuZCBnZW5lcmF0ZXMvdXBkYXRlcyBtZXRhIGRhdGEgZm9yIHdlYnBhY2tcbiAqIGNvbXBpbGF0aW9uLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIGFwcGxpY2F0aW9uIHRoZW1lIHBsdWdpbiBtYW5kYXRvcnkgb3B0aW9ucyxcbiAqIEBzZWUge0BsaW5rIEFwcGxpY2F0aW9uVGhlbWVQbHVnaW59XG4gKlxuICogQHBhcmFtIGxvZ2dlciBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NUaGVtZVJlc291cmNlcyhvcHRpb25zLCBsb2dnZXIpIHtcbiAgY29uc3QgdGhlbWVOYW1lID0gZXh0cmFjdFRoZW1lTmFtZShvcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyKTtcbiAgaWYgKHRoZW1lTmFtZSkge1xuICAgIGlmICghcHJldlRoZW1lTmFtZSAmJiAhZmlyc3RUaGVtZU5hbWUpIHtcbiAgICAgIGZpcnN0VGhlbWVOYW1lID0gdGhlbWVOYW1lO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAocHJldlRoZW1lTmFtZSAmJiBwcmV2VGhlbWVOYW1lICE9PSB0aGVtZU5hbWUgJiYgZmlyc3RUaGVtZU5hbWUgIT09IHRoZW1lTmFtZSkgfHxcbiAgICAgICghcHJldlRoZW1lTmFtZSAmJiBmaXJzdFRoZW1lTmFtZSAhPT0gdGhlbWVOYW1lKVxuICAgICkge1xuICAgICAgLy8gV2FybmluZyBtZXNzYWdlIGlzIHNob3duIHRvIHRoZSBkZXZlbG9wZXIgd2hlbjpcbiAgICAgIC8vIDEuIEhlIGlzIHN3aXRjaGluZyB0byBhbnkgdGhlbWUsIHdoaWNoIGlzIGRpZmZlciBmcm9tIG9uZSBiZWluZyBzZXQgdXBcbiAgICAgIC8vIG9uIGFwcGxpY2F0aW9uIHN0YXJ0dXAsIGJ5IGNoYW5naW5nIHRoZW1lIG5hbWUgaW4gYEBUaGVtZSgpYFxuICAgICAgLy8gMi4gSGUgcmVtb3ZlcyBvciBjb21tZW50cyBvdXQgYEBUaGVtZSgpYCB0byBzZWUgaG93IHRoZSBhcHBcbiAgICAgIC8vIGxvb2tzIGxpa2Ugd2l0aG91dCB0aGVtaW5nLCBhbmQgdGhlbiBhZ2FpbiBicmluZ3MgYEBUaGVtZSgpYCBiYWNrXG4gICAgICAvLyB3aXRoIGEgdGhlbWVOYW1lIHdoaWNoIGlzIGRpZmZlciBmcm9tIG9uZSBiZWluZyBzZXQgdXAgb24gYXBwbGljYXRpb25cbiAgICAgIC8vIHN0YXJ0dXAuXG4gICAgICBjb25zdCB3YXJuaW5nID0gYEF0dGVudGlvbjogQWN0aXZlIHRoZW1lIGlzIHN3aXRjaGVkIHRvICcke3RoZW1lTmFtZX0nLmA7XG4gICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGBcbiAgICAgIE5vdGUgdGhhdCBhZGRpbmcgbmV3IHN0eWxlIHNoZWV0IGZpbGVzIHRvICcvdGhlbWVzLyR7dGhlbWVOYW1lfS9jb21wb25lbnRzJywgXG4gICAgICBtYXkgbm90IGJlIHRha2VuIGludG8gZWZmZWN0IHVudGlsIHRoZSBuZXh0IGFwcGxpY2F0aW9uIHJlc3RhcnQuXG4gICAgICBDaGFuZ2VzIHRvIGFscmVhZHkgZXhpc3Rpbmcgc3R5bGUgc2hlZXQgZmlsZXMgYXJlIGJlaW5nIHJlbG9hZGVkIGFzIGJlZm9yZS5gO1xuICAgICAgbG9nZ2VyLndhcm4oJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKTtcbiAgICAgIGxvZ2dlci53YXJuKHdhcm5pbmcpO1xuICAgICAgbG9nZ2VyLndhcm4oZGVzY3JpcHRpb24pO1xuICAgICAgbG9nZ2VyLndhcm4oJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKTtcbiAgICB9XG4gICAgcHJldlRoZW1lTmFtZSA9IHRoZW1lTmFtZTtcblxuICAgIGZpbmRUaGVtZUZvbGRlckFuZEhhbmRsZVRoZW1lKHRoZW1lTmFtZSwgb3B0aW9ucywgbG9nZ2VyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUaGlzIGlzIG5lZWRlZCBpbiB0aGUgc2l0dWF0aW9uIHRoYXQgdGhlIHVzZXIgZGVjaWRlcyB0byBjb21tZW50IG9yXG4gICAgLy8gcmVtb3ZlIHRoZSBAVGhlbWUoLi4uKSBjb21wbGV0ZWx5IHRvIHNlZSBob3cgdGhlIGFwcGxpY2F0aW9uIGxvb2tzXG4gICAgLy8gd2l0aG91dCBhbnkgdGhlbWUuIFRoZW4gd2hlbiB0aGUgdXNlciBicmluZ3MgYmFjayBvbmUgb2YgdGhlIHRoZW1lcyxcbiAgICAvLyB0aGUgcHJldmlvdXMgdGhlbWUgc2hvdWxkIGJlIHVuZGVmaW5lZCB0byBlbmFibGUgdXMgdG8gZGV0ZWN0IHRoZSBjaGFuZ2UuXG4gICAgcHJldlRoZW1lTmFtZSA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIuZGVidWcoJ1NraXBwaW5nIFZhYWRpbiBhcHBsaWNhdGlvbiB0aGVtZSBoYW5kbGluZy4nKTtcbiAgICBsb2dnZXIudHJhY2UoJ01vc3QgbGlrZWx5IG5vIEBUaGVtZSBhbm5vdGF0aW9uIGZvciBhcHBsaWNhdGlvbiBvciBvbmx5IHRoZW1lQ2xhc3MgdXNlZC4nKTtcbiAgfVxufVxuXG4vKipcbiAqIFNlYXJjaCBmb3IgdGhlIGdpdmVuIHRoZW1lIGluIHRoZSBwcm9qZWN0IGFuZCByZXNvdXJjZSBmb2xkZXJzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZU5hbWUgbmFtZSBvZiB0aGVtZSB0byBmaW5kXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHBhcmFtIGxvZ2dlciBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbG9nZ2VyXG4gKiBAcmV0dXJuIHRydWUgb3IgZmFsc2UgZm9yIGlmIHRoZW1lIHdhcyBmb3VuZFxuICovXG5mdW5jdGlvbiBmaW5kVGhlbWVGb2xkZXJBbmRIYW5kbGVUaGVtZSh0aGVtZU5hbWUsIG9wdGlvbnMsIGxvZ2dlcikge1xuICBsZXQgdGhlbWVGb3VuZCA9IGZhbHNlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVycy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHRoZW1lUHJvamVjdEZvbGRlciA9IG9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVyc1tpXTtcbiAgICBpZiAoZXhpc3RzU3luYyh0aGVtZVByb2plY3RGb2xkZXIpKSB7XG4gICAgICBsb2dnZXIuZGVidWcoXCJTZWFyY2hpbmcgdGhlbWVzIGZvbGRlciAnXCIgKyB0aGVtZVByb2plY3RGb2xkZXIgKyBcIicgZm9yIHRoZW1lICdcIiArIHRoZW1lTmFtZSArIFwiJ1wiKTtcbiAgICAgIGNvbnN0IGhhbmRsZWQgPSBoYW5kbGVUaGVtZXModGhlbWVOYW1lLCB0aGVtZVByb2plY3RGb2xkZXIsIG9wdGlvbnMsIGxvZ2dlcik7XG4gICAgICBpZiAoaGFuZGxlZCkge1xuICAgICAgICBpZiAodGhlbWVGb3VuZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiRm91bmQgdGhlbWUgZmlsZXMgaW4gJ1wiICtcbiAgICAgICAgICAgICAgdGhlbWVQcm9qZWN0Rm9sZGVyICtcbiAgICAgICAgICAgICAgXCInIGFuZCAnXCIgK1xuICAgICAgICAgICAgICB0aGVtZUZvdW5kICtcbiAgICAgICAgICAgICAgXCInLiBUaGVtZSBzaG91bGQgb25seSBiZSBhdmFpbGFibGUgaW4gb25lIGZvbGRlclwiXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBsb2dnZXIuZGVidWcoXCJGb3VuZCB0aGVtZSBmaWxlcyBmcm9tICdcIiArIHRoZW1lUHJvamVjdEZvbGRlciArIFwiJ1wiKTtcbiAgICAgICAgdGhlbWVGb3VuZCA9IHRoZW1lUHJvamVjdEZvbGRlcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZXhpc3RzU3luYyhvcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIpKSB7XG4gICAgaWYgKHRoZW1lRm91bmQgJiYgZXhpc3RzU3luYyhyZXNvbHZlKG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciwgdGhlbWVOYW1lKSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJUaGVtZSAnXCIgK1xuICAgICAgICAgIHRoZW1lTmFtZSArXG4gICAgICAgICAgXCInc2hvdWxkIG5vdCBleGlzdCBpbnNpZGUgYSBqYXIgYW5kIGluIHRoZSBwcm9qZWN0IGF0IHRoZSBzYW1lIHRpbWVcXG5cIiArXG4gICAgICAgICAgJ0V4dGVuZGluZyBhbm90aGVyIHRoZW1lIGlzIHBvc3NpYmxlIGJ5IGFkZGluZyB7IFwicGFyZW50XCI6IFwibXktcGFyZW50LXRoZW1lXCIgfSBlbnRyeSB0byB0aGUgdGhlbWUuanNvbiBmaWxlIGluc2lkZSB5b3VyIHRoZW1lIGZvbGRlci4nXG4gICAgICApO1xuICAgIH1cbiAgICBsb2dnZXIuZGVidWcoXG4gICAgICBcIlNlYXJjaGluZyB0aGVtZSBqYXIgcmVzb3VyY2UgZm9sZGVyICdcIiArIG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciArIFwiJyBmb3IgdGhlbWUgJ1wiICsgdGhlbWVOYW1lICsgXCInXCJcbiAgICApO1xuICAgIGhhbmRsZVRoZW1lcyh0aGVtZU5hbWUsIG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciwgb3B0aW9ucywgbG9nZ2VyKTtcbiAgICB0aGVtZUZvdW5kID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdGhlbWVGb3VuZDtcbn1cblxuLyoqXG4gKiBDb3BpZXMgc3RhdGljIHJlc291cmNlcyBmb3IgdGhlbWUgYW5kIGdlbmVyYXRlcy93cml0ZXMgdGhlXG4gKiBbdGhlbWUtbmFtZV0uZ2VuZXJhdGVkLmpzIGZvciB3ZWJwYWNrIHRvIGhhbmRsZS5cbiAqXG4gKiBOb3RlISBJZiBhIHBhcmVudCB0aGVtZSBpcyBkZWZpbmVkIGl0IHdpbGwgYWxzbyBiZSBoYW5kbGVkIGhlcmUgc28gdGhhdCB0aGUgcGFyZW50IHRoZW1lIGdlbmVyYXRlZCBmaWxlIGlzXG4gKiBnZW5lcmF0ZWQgaW4gYWR2YW5jZSBvZiB0aGUgdGhlbWUgZ2VuZXJhdGVkIGZpbGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBuYW1lIG9mIHRoZW1lIHRvIGhhbmRsZVxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lc0ZvbGRlciBmb2xkZXIgY29udGFpbmluZyBhcHBsaWNhdGlvbiB0aGVtZSBmb2xkZXJzXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHBhcmFtIHtvYmplY3R9IGxvZ2dlciBwbHVnaW4gbG9nZ2VyIGluc3RhbmNlXG4gKlxuICogQHRocm93cyBFcnJvciBpZiBwYXJlbnQgdGhlbWUgZGVmaW5lZCwgYnV0IGNhbid0IGxvY2F0ZSBwYXJlbnQgdGhlbWVcbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZW1lIHdhcyBmb3VuZCBlbHNlIGZhbHNlLlxuICovXG5mdW5jdGlvbiBoYW5kbGVUaGVtZXModGhlbWVOYW1lLCB0aGVtZXNGb2xkZXIsIG9wdGlvbnMsIGxvZ2dlcikge1xuICBjb25zdCB0aGVtZUZvbGRlciA9IHJlc29sdmUodGhlbWVzRm9sZGVyLCB0aGVtZU5hbWUpO1xuICBpZiAoZXhpc3RzU3luYyh0aGVtZUZvbGRlcikpIHtcbiAgICBsb2dnZXIuZGVidWcoJ0ZvdW5kIHRoZW1lICcsIHRoZW1lTmFtZSwgJyBpbiBmb2xkZXIgJywgdGhlbWVGb2xkZXIpO1xuXG4gICAgY29uc3QgdGhlbWVQcm9wZXJ0aWVzID0gZ2V0VGhlbWVQcm9wZXJ0aWVzKHRoZW1lRm9sZGVyKTtcblxuICAgIC8vIElmIHRoZW1lIGhhcyBwYXJlbnQgaGFuZGxlIHBhcmVudCB0aGVtZSBpbW1lZGlhdGVseS5cbiAgICBpZiAodGhlbWVQcm9wZXJ0aWVzLnBhcmVudCkge1xuICAgICAgY29uc3QgZm91bmQgPSBmaW5kVGhlbWVGb2xkZXJBbmRIYW5kbGVUaGVtZSh0aGVtZVByb3BlcnRpZXMucGFyZW50LCBvcHRpb25zLCBsb2dnZXIpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJDb3VsZCBub3QgbG9jYXRlIGZpbGVzIGZvciBkZWZpbmVkIHBhcmVudCB0aGVtZSAnXCIgK1xuICAgICAgICAgICAgdGhlbWVQcm9wZXJ0aWVzLnBhcmVudCArXG4gICAgICAgICAgICBcIicuXFxuXCIgK1xuICAgICAgICAgICAgJ1BsZWFzZSB2ZXJpZnkgdGhhdCBkZXBlbmRlbmN5IGlzIGFkZGVkIG9yIHRoZW1lIGZvbGRlciBleGlzdHMuJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBjb3B5U3RhdGljQXNzZXRzKHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zLnByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsIGxvZ2dlcik7XG4gICAgY29weVRoZW1lUmVzb3VyY2VzKHRoZW1lRm9sZGVyLCBvcHRpb25zLnByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsIGxvZ2dlcik7XG5cbiAgICB3cml0ZVRoZW1lRmlsZXModGhlbWVGb2xkZXIsIHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW1lUHJvcGVydGllcyh0aGVtZUZvbGRlcikge1xuICBjb25zdCB0aGVtZVByb3BlcnR5RmlsZSA9IHJlc29sdmUodGhlbWVGb2xkZXIsICd0aGVtZS5qc29uJyk7XG4gIGlmICghZXhpc3RzU3luYyh0aGVtZVByb3BlcnR5RmlsZSkpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbiAgY29uc3QgdGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZyA9IHJlYWRGaWxlU3luYyh0aGVtZVByb3BlcnR5RmlsZSk7XG4gIGlmICh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICByZXR1cm4gSlNPTi5wYXJzZSh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nKTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0cyBjdXJyZW50IHRoZW1lIG5hbWUgZnJvbSBhdXRvLWdlbmVyYXRlZCAndGhlbWUuanMnIGZpbGUgbG9jYXRlZCBvbiBhXG4gKiBnaXZlbiBmb2xkZXIuXG4gKiBAcGFyYW0gZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIgZm9sZGVyIGluIHByb2plY3QgY29udGFpbmluZyAndGhlbWUuanMnIGZpbGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGN1cnJlbnQgdGhlbWUgbmFtZVxuICovXG5mdW5jdGlvbiBleHRyYWN0VGhlbWVOYW1lKGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyKSB7XG4gIGlmICghZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIkNvdWxkbid0IGV4dHJhY3QgdGhlbWUgbmFtZSBmcm9tICd0aGVtZS5qcycsXCIgK1xuICAgICAgICAnIGJlY2F1c2UgdGhlIHBhdGggdG8gZm9sZGVyIGNvbnRhaW5pbmcgdGhpcyBmaWxlIGlzIGVtcHR5LiBQbGVhc2Ugc2V0JyArXG4gICAgICAgICcgdGhlIGEgY29ycmVjdCBmb2xkZXIgcGF0aCBpbiBBcHBsaWNhdGlvblRoZW1lUGx1Z2luIGNvbnN0cnVjdG9yJyArXG4gICAgICAgICcgcGFyYW1ldGVycy4nXG4gICAgKTtcbiAgfVxuICBjb25zdCBnZW5lcmF0ZWRUaGVtZUZpbGUgPSByZXNvbHZlKGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLCAndGhlbWUuanMnKTtcbiAgaWYgKGV4aXN0c1N5bmMoZ2VuZXJhdGVkVGhlbWVGaWxlKSkge1xuICAgIC8vIHJlYWQgdGhlbWUgbmFtZSBmcm9tIHRoZSAnZ2VuZXJhdGVkL3RoZW1lLmpzJyBhcyB0aGVyZSB3ZSBhbHdheXNcbiAgICAvLyBtYXJrIHRoZSB1c2VkIHRoZW1lIGZvciB3ZWJwYWNrIHRvIGhhbmRsZS5cbiAgICBjb25zdCB0aGVtZU5hbWUgPSBuYW1lUmVnZXguZXhlYyhyZWFkRmlsZVN5bmMoZ2VuZXJhdGVkVGhlbWVGaWxlLCB7IGVuY29kaW5nOiAndXRmOCcgfSkpWzFdO1xuICAgIGlmICghdGhlbWVOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBwYXJzZSB0aGVtZSBuYW1lIGZyb20gJ1wiICsgZ2VuZXJhdGVkVGhlbWVGaWxlICsgXCInLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoZW1lTmFtZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuLyoqXG4gKiBGaW5kcyBhbGwgdGhlIHBhcmVudCB0aGVtZXMgbG9jYXRlZCBpbiB0aGUgcHJvamVjdCB0aGVtZXMgZm9sZGVycyBhbmQgaW5cbiAqIHRoZSBKQVIgZGVwZW5kZW5jaWVzIHdpdGggcmVzcGVjdCB0byB0aGUgZ2l2ZW4gY3VzdG9tIHRoZW1lIHdpdGhcbiAqIHtAY29kZSB0aGVtZU5hbWV9LlxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBnaXZlbiBjdXN0b20gdGhlbWUgbmFtZSB0byBsb29rIHBhcmVudHMgZm9yXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHJldHVybnMge3N0cmluZ1tdfSBhcnJheSBvZiBwYXRocyB0byBmb3VuZCBwYXJlbnQgdGhlbWVzIHdpdGggcmVzcGVjdCB0byB0aGVcbiAqIGdpdmVuIGN1c3RvbSB0aGVtZVxuICovXG5mdW5jdGlvbiBmaW5kUGFyZW50VGhlbWVzKHRoZW1lTmFtZSwgb3B0aW9ucykge1xuICBjb25zdCBleGlzdGluZ1RoZW1lRm9sZGVycyA9IFtvcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIsIC4uLm9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVyc10uZmlsdGVyKChmb2xkZXIpID0+XG4gICAgZXhpc3RzU3luYyhmb2xkZXIpXG4gICk7XG4gIHJldHVybiBjb2xsZWN0UGFyZW50VGhlbWVzKHRoZW1lTmFtZSwgZXhpc3RpbmdUaGVtZUZvbGRlcnMsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdFBhcmVudFRoZW1lcyh0aGVtZU5hbWUsIHRoZW1lRm9sZGVycywgaXNQYXJlbnQpIHtcbiAgbGV0IGZvdW5kUGFyZW50VGhlbWVzID0gW107XG4gIHRoZW1lRm9sZGVycy5mb3JFYWNoKChmb2xkZXIpID0+IHtcbiAgICBjb25zdCB0aGVtZUZvbGRlciA9IHJlc29sdmUoZm9sZGVyLCB0aGVtZU5hbWUpO1xuICAgIGlmIChleGlzdHNTeW5jKHRoZW1lRm9sZGVyKSkge1xuICAgICAgY29uc3QgdGhlbWVQcm9wZXJ0aWVzID0gZ2V0VGhlbWVQcm9wZXJ0aWVzKHRoZW1lRm9sZGVyKTtcblxuICAgICAgaWYgKHRoZW1lUHJvcGVydGllcy5wYXJlbnQpIHtcbiAgICAgICAgZm91bmRQYXJlbnRUaGVtZXMucHVzaCguLi5jb2xsZWN0UGFyZW50VGhlbWVzKHRoZW1lUHJvcGVydGllcy5wYXJlbnQsIHRoZW1lRm9sZGVycywgdHJ1ZSkpO1xuICAgICAgICBpZiAoIWZvdW5kUGFyZW50VGhlbWVzLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiQ291bGQgbm90IGxvY2F0ZSBmaWxlcyBmb3IgZGVmaW5lZCBwYXJlbnQgdGhlbWUgJ1wiICtcbiAgICAgICAgICAgICAgdGhlbWVQcm9wZXJ0aWVzLnBhcmVudCArXG4gICAgICAgICAgICAgIFwiJy5cXG5cIiArXG4gICAgICAgICAgICAgICdQbGVhc2UgdmVyaWZ5IHRoYXQgZGVwZW5kZW5jeSBpcyBhZGRlZCBvciB0aGVtZSBmb2xkZXIgZXhpc3RzLidcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBBZGQgYSB0aGVtZSBwYXRoIHRvIHJlc3VsdCBjb2xsZWN0aW9uIG9ubHkgaWYgYSBnaXZlbiB0aGVtZU5hbWVcbiAgICAgIC8vIGlzIHN1cHBvc2VkIHRvIGJlIGEgcGFyZW50IHRoZW1lXG4gICAgICBpZiAoaXNQYXJlbnQpIHtcbiAgICAgICAgZm91bmRQYXJlbnRUaGVtZXMucHVzaCh0aGVtZUZvbGRlcik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZvdW5kUGFyZW50VGhlbWVzO1xufVxuXG5leHBvcnQgeyBwcm9jZXNzVGhlbWVSZXNvdXJjZXMsIGV4dHJhY3RUaGVtZU5hbWUsIGZpbmRQYXJlbnRUaGVtZXMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQmFzaWxHSUJNXFxcXElkZWFQcm9qZWN0c1xcXFxjb250YWN0YXBwXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXGFwcGxpY2F0aW9uLXRoZW1lLXBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQmFzaWxHSUJNXFxcXElkZWFQcm9qZWN0c1xcXFxjb250YWN0YXBwXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXGFwcGxpY2F0aW9uLXRoZW1lLXBsdWdpblxcXFx0aGVtZS1nZW5lcmF0b3IuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0Jhc2lsR0lCTS9JZGVhUHJvamVjdHMvY29udGFjdGFwcC90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtZ2VuZXJhdG9yLmpzXCI7LypcbiAqIENvcHlyaWdodCAyMDAwLTIwMjQgVmFhZGluIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdFxuICogdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2ZcbiAqIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUXG4gKiBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGVcbiAqIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyXG4gKiB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgZmlsZSBoYW5kbGVzIHRoZSBnZW5lcmF0aW9uIG9mIHRoZSAnW3RoZW1lLW5hbWVdLmpzJyB0b1xuICogdGhlIHRoZW1lcy9bdGhlbWUtbmFtZV0gZm9sZGVyIGFjY29yZGluZyB0byBwcm9wZXJ0aWVzIGZyb20gJ3RoZW1lLmpzb24nLlxuICovXG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InO1xuaW1wb3J0IHsgcmVzb2x2ZSwgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGNoZWNrTW9kdWxlcyB9IGZyb20gJy4vdGhlbWUtY29weS5qcyc7XG5cbi8vIFNwZWNpYWwgZm9sZGVyIGluc2lkZSBhIHRoZW1lIGZvciBjb21wb25lbnQgdGhlbWVzIHRoYXQgZ28gaW5zaWRlIHRoZSBjb21wb25lbnQgc2hhZG93IHJvb3RcbmNvbnN0IHRoZW1lQ29tcG9uZW50c0ZvbGRlciA9ICdjb21wb25lbnRzJztcbi8vIFRoZSBjb250ZW50cyBvZiBhIGdsb2JhbCBDU1MgZmlsZSB3aXRoIHRoaXMgbmFtZSBpbiBhIHRoZW1lIGlzIGFsd2F5cyBhZGRlZCB0b1xuLy8gdGhlIGRvY3VtZW50LiBFLmcuIEBmb250LWZhY2UgbXVzdCBiZSBpbiB0aGlzXG5jb25zdCBkb2N1bWVudENzc0ZpbGVuYW1lID0gJ2RvY3VtZW50LmNzcyc7XG4vLyBzdHlsZXMuY3NzIGlzIHRoZSBvbmx5IGVudHJ5cG9pbnQgY3NzIGZpbGUgd2l0aCBkb2N1bWVudC5jc3MuIEV2ZXJ5dGhpbmcgZWxzZSBzaG91bGQgYmUgaW1wb3J0ZWQgdXNpbmcgY3NzIEBpbXBvcnRcbmNvbnN0IHN0eWxlc0Nzc0ZpbGVuYW1lID0gJ3N0eWxlcy5jc3MnO1xuXG5jb25zdCBDU1NJTVBPUlRfQ09NTUVOVCA9ICdDU1NJbXBvcnQgZW5kJztcbmNvbnN0IGhlYWRlckltcG9ydCA9IGBpbXBvcnQgJ2NvbnN0cnVjdC1zdHlsZS1zaGVldHMtcG9seWZpbGwnO1xuYDtcblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgW3RoZW1lTmFtZV0uanMgZmlsZSBmb3IgdGhlbWVGb2xkZXIgd2hpY2ggY29sbGVjdHMgYWxsIHJlcXVpcmVkIGluZm9ybWF0aW9uIGZyb20gdGhlIGZvbGRlci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhlbWVGb2xkZXIgZm9sZGVyIG9mIHRoZSB0aGVtZVxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBuYW1lIG9mIHRoZSBoYW5kbGVkIHRoZW1lXG4gKiBAcGFyYW0ge0pTT059IHRoZW1lUHJvcGVydGllcyBjb250ZW50IG9mIHRoZW1lLmpzb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIGJ1aWxkIG9wdGlvbnMgKGUuZy4gcHJvZCBvciBkZXYgbW9kZSlcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZW1lIGZpbGUgY29udGVudFxuICovXG5mdW5jdGlvbiB3cml0ZVRoZW1lRmlsZXModGhlbWVGb2xkZXIsIHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHByb2R1Y3Rpb25Nb2RlID0gIW9wdGlvbnMuZGV2TW9kZTtcbiAgY29uc3QgdXNlRGV2U2VydmVyT3JJblByb2R1Y3Rpb25Nb2RlID0gIW9wdGlvbnMudXNlRGV2QnVuZGxlO1xuICBjb25zdCBvdXRwdXRGb2xkZXIgPSBvcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyO1xuICBjb25zdCBzdHlsZXMgPSByZXNvbHZlKHRoZW1lRm9sZGVyLCBzdHlsZXNDc3NGaWxlbmFtZSk7XG4gIGNvbnN0IGRvY3VtZW50Q3NzRmlsZSA9IHJlc29sdmUodGhlbWVGb2xkZXIsIGRvY3VtZW50Q3NzRmlsZW5hbWUpO1xuICBjb25zdCBhdXRvSW5qZWN0Q29tcG9uZW50cyA9IHRoZW1lUHJvcGVydGllcy5hdXRvSW5qZWN0Q29tcG9uZW50cyA/PyB0cnVlO1xuICBjb25zdCBhdXRvSW5qZWN0R2xvYmFsQ3NzSW1wb3J0cyA9IHRoZW1lUHJvcGVydGllcy5hdXRvSW5qZWN0R2xvYmFsQ3NzSW1wb3J0cyA/PyBmYWxzZTtcbiAgY29uc3QgZ2xvYmFsRmlsZW5hbWUgPSAndGhlbWUtJyArIHRoZW1lTmFtZSArICcuZ2xvYmFsLmdlbmVyYXRlZC5qcyc7XG4gIGNvbnN0IGNvbXBvbmVudHNGaWxlbmFtZSA9ICd0aGVtZS0nICsgdGhlbWVOYW1lICsgJy5jb21wb25lbnRzLmdlbmVyYXRlZC5qcyc7XG4gIGNvbnN0IHRoZW1lRmlsZW5hbWUgPSAndGhlbWUtJyArIHRoZW1lTmFtZSArICcuZ2VuZXJhdGVkLmpzJztcblxuICBsZXQgdGhlbWVGaWxlQ29udGVudCA9IGhlYWRlckltcG9ydDtcbiAgbGV0IGdsb2JhbEltcG9ydENvbnRlbnQgPSAnLy8gV2hlbiB0aGlzIGZpbGUgaXMgaW1wb3J0ZWQsIGdsb2JhbCBzdHlsZXMgYXJlIGF1dG9tYXRpY2FsbHkgYXBwbGllZFxcbic7XG4gIGxldCBjb21wb25lbnRzRmlsZUNvbnRlbnQgPSAnJztcbiAgdmFyIGNvbXBvbmVudHNGaWxlcztcblxuICBpZiAoYXV0b0luamVjdENvbXBvbmVudHMpIHtcbiAgICBjb21wb25lbnRzRmlsZXMgPSBnbG9iU3luYygnKi5jc3MnLCB7XG4gICAgICBjd2Q6IHJlc29sdmUodGhlbWVGb2xkZXIsIHRoZW1lQ29tcG9uZW50c0ZvbGRlciksXG4gICAgICBub2RpcjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgaWYgKGNvbXBvbmVudHNGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb21wb25lbnRzRmlsZUNvbnRlbnQgKz1cbiAgICAgICAgXCJpbXBvcnQgeyB1bnNhZmVDU1MsIHJlZ2lzdGVyU3R5bGVzIH0gZnJvbSAnQHZhYWRpbi92YWFkaW4tdGhlbWFibGUtbWl4aW4vcmVnaXN0ZXItc3R5bGVzJztcXG5cIjtcbiAgICB9XG4gIH1cblxuICBpZiAodGhlbWVQcm9wZXJ0aWVzLnBhcmVudCkge1xuICAgIHRoZW1lRmlsZUNvbnRlbnQgKz0gYGltcG9ydCB7IGFwcGx5VGhlbWUgYXMgYXBwbHlCYXNlVGhlbWUgfSBmcm9tICcuL3RoZW1lLSR7dGhlbWVQcm9wZXJ0aWVzLnBhcmVudH0uZ2VuZXJhdGVkLmpzJztcXG5gO1xuICB9XG5cbiAgdGhlbWVGaWxlQ29udGVudCArPSBgaW1wb3J0IHsgaW5qZWN0R2xvYmFsQ3NzIH0gZnJvbSAnRnJvbnRlbmQvZ2VuZXJhdGVkL2phci1yZXNvdXJjZXMvdGhlbWUtdXRpbC5qcyc7XFxuYDtcbiAgdGhlbWVGaWxlQ29udGVudCArPSBgaW1wb3J0IHsgd2ViY29tcG9uZW50R2xvYmFsQ3NzSW5qZWN0b3IgfSBmcm9tICdGcm9udGVuZC9nZW5lcmF0ZWQvamFyLXJlc291cmNlcy90aGVtZS11dGlsLmpzJztcXG5gO1xuICB0aGVtZUZpbGVDb250ZW50ICs9IGBpbXBvcnQgJy4vJHtjb21wb25lbnRzRmlsZW5hbWV9JztcXG5gO1xuXG4gIHRoZW1lRmlsZUNvbnRlbnQgKz0gYGxldCBuZWVkc1JlbG9hZE9uQ2hhbmdlcyA9IGZhbHNlO1xcbmA7XG4gIGNvbnN0IGltcG9ydHMgPSBbXTtcbiAgY29uc3QgY29tcG9uZW50Q3NzSW1wb3J0cyA9IFtdO1xuICBjb25zdCBnbG9iYWxGaWxlQ29udGVudCA9IFtdO1xuICBjb25zdCBnbG9iYWxDc3NDb2RlID0gW107XG4gIGNvbnN0IHNoYWRvd09ubHlDc3MgPSBbXTtcbiAgY29uc3QgY29tcG9uZW50Q3NzQ29kZSA9IFtdO1xuICBjb25zdCBwYXJlbnRUaGVtZSA9IHRoZW1lUHJvcGVydGllcy5wYXJlbnQgPyAnYXBwbHlCYXNlVGhlbWUodGFyZ2V0KTtcXG4nIDogJyc7XG4gIGNvbnN0IHBhcmVudFRoZW1lR2xvYmFsSW1wb3J0ID0gdGhlbWVQcm9wZXJ0aWVzLnBhcmVudFxuICAgID8gYGltcG9ydCAnLi90aGVtZS0ke3RoZW1lUHJvcGVydGllcy5wYXJlbnR9Lmdsb2JhbC5nZW5lcmF0ZWQuanMnO1xcbmBcbiAgICA6ICcnO1xuXG4gIGNvbnN0IHRoZW1lSWRlbnRpZmllciA9ICdfdmFhZGludGhlbWVfJyArIHRoZW1lTmFtZSArICdfJztcbiAgY29uc3QgbHVtb0Nzc0ZsYWcgPSAnX3ZhYWRpbnRoZW1lbHVtb2ltcG9ydHNfJztcbiAgY29uc3QgZ2xvYmFsQ3NzRmxhZyA9IHRoZW1lSWRlbnRpZmllciArICdnbG9iYWxDc3MnO1xuICBjb25zdCBjb21wb25lbnRDc3NGbGFnID0gdGhlbWVJZGVudGlmaWVyICsgJ2NvbXBvbmVudENzcyc7XG5cbiAgaWYgKCFleGlzdHNTeW5jKHN0eWxlcykpIHtcbiAgICBpZiAocHJvZHVjdGlvbk1vZGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc3R5bGVzLmNzcyBmaWxlIGlzIG1pc3NpbmcgYW5kIGlzIG5lZWRlZCBmb3IgJyR7dGhlbWVOYW1lfScgaW4gZm9sZGVyICcke3RoZW1lRm9sZGVyfSdgKTtcbiAgICB9XG4gICAgd3JpdGVGaWxlU3luYyhcbiAgICAgIHN0eWxlcyxcbiAgICAgICcvKiBJbXBvcnQgeW91ciBhcHBsaWNhdGlvbiBnbG9iYWwgY3NzIGZpbGVzIGhlcmUgb3IgYWRkIHRoZSBzdHlsZXMgZGlyZWN0bHkgdG8gdGhpcyBmaWxlICovJyxcbiAgICAgICd1dGY4J1xuICAgICk7XG4gIH1cblxuICAvLyBzdHlsZXMuY3NzIHdpbGwgYWx3YXlzIGJlIGF2YWlsYWJsZSBhcyB3ZSB3cml0ZSBvbmUgaWYgaXQgZG9lc24ndCBleGlzdC5cbiAgbGV0IGZpbGVuYW1lID0gYmFzZW5hbWUoc3R5bGVzKTtcbiAgbGV0IHZhcmlhYmxlID0gY2FtZWxDYXNlKGZpbGVuYW1lKTtcblxuICAvKiBMVU1PICovXG4gIGNvbnN0IGx1bW9JbXBvcnRzID0gdGhlbWVQcm9wZXJ0aWVzLmx1bW9JbXBvcnRzIHx8IFsndHlwb2dyYXBoeScsICdjb2xvcicsICdzcGFjaW5nJywgJ2JhZGdlJywgJ3V0aWxpdHknXSA7XG4gIGlmIChsdW1vSW1wb3J0cykge1xuICAgIGx1bW9JbXBvcnRzLmZvckVhY2goKGx1bW9JbXBvcnQpID0+IHtcbiAgICAgIGltcG9ydHMucHVzaChgaW1wb3J0IHsgJHtsdW1vSW1wb3J0fSB9IGZyb20gJ0B2YWFkaW4vdmFhZGluLWx1bW8tc3R5bGVzLyR7bHVtb0ltcG9ydH0uanMnO1xcbmApO1xuICAgICAgaWYgKGx1bW9JbXBvcnQgPT09ICd1dGlsaXR5JyB8fCBsdW1vSW1wb3J0ID09PSAnYmFkZ2UnIHx8IGx1bW9JbXBvcnQgPT09ICd0eXBvZ3JhcGh5JyB8fCBsdW1vSW1wb3J0ID09PSAnY29sb3InKSB7XG4gICAgICAgIC8vIEluamVjdCBpbnRvIG1haW4gZG9jdW1lbnQgdGhlIHNhbWUgd2F5IGFzIG90aGVyIEx1bW8gc3R5bGVzIGFyZSBpbmplY3RlZFxuICAgICAgICAvLyBMdW1vIGltcG9ydHMgZ28gdG8gdGhlIHRoZW1lIGdsb2JhbCBpbXBvcnRzIGZpbGUgdG8gcHJldmVudCBzdHlsZSBsZWFrc1xuICAgICAgICAvLyB3aGVuIHRoZSB0aGVtZSBpcyBhcHBsaWVkIHRvIGFuIGVtYmVkZGVkIGNvbXBvbmVudFxuICAgICAgICBnbG9iYWxGaWxlQ29udGVudC5wdXNoKGBpbXBvcnQgJ0B2YWFkaW4vdmFhZGluLWx1bW8tc3R5bGVzLyR7bHVtb0ltcG9ydH0tZ2xvYmFsLmpzJztcXG5gKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGx1bW9JbXBvcnRzLmZvckVhY2goKGx1bW9JbXBvcnQpID0+IHtcbiAgICAgIC8vIEx1bW8gaXMgaW5qZWN0ZWQgdG8gdGhlIGRvY3VtZW50IGJ5IEx1bW8gaXRzZWxmXG4gICAgICBzaGFkb3dPbmx5Q3NzLnB1c2goYHJlbW92ZXJzLnB1c2goaW5qZWN0R2xvYmFsQ3NzKCR7bHVtb0ltcG9ydH0uY3NzVGV4dCwgJycsIHRhcmdldCwgdHJ1ZSkpO1xcbmApO1xuICAgIH0pO1xuICB9XG5cbiAgLyogVGhlbWUgKi9cbiAgZ2xvYmFsRmlsZUNvbnRlbnQucHVzaChwYXJlbnRUaGVtZUdsb2JhbEltcG9ydCk7XG4gIGlmICh1c2VEZXZTZXJ2ZXJPckluUHJvZHVjdGlvbk1vZGUpIHtcbiAgICBnbG9iYWxGaWxlQ29udGVudC5wdXNoKGBpbXBvcnQgJ3RoZW1lcy8ke3RoZW1lTmFtZX0vJHtmaWxlbmFtZX0nO1xcbmApO1xuXG4gICAgaW1wb3J0cy5wdXNoKGBpbXBvcnQgJHt2YXJpYWJsZX0gZnJvbSAndGhlbWVzLyR7dGhlbWVOYW1lfS8ke2ZpbGVuYW1lfT9pbmxpbmUnO1xcbmApO1xuICAgIHNoYWRvd09ubHlDc3MucHVzaChgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSwgJycsIHRhcmdldCkpO1xcbiAgICBgKTtcbiAgfVxuICBpZiAoZXhpc3RzU3luYyhkb2N1bWVudENzc0ZpbGUpKSB7XG4gICAgZmlsZW5hbWUgPSBiYXNlbmFtZShkb2N1bWVudENzc0ZpbGUpO1xuICAgIHZhcmlhYmxlID0gY2FtZWxDYXNlKGZpbGVuYW1lKTtcblxuICAgIGlmICh1c2VEZXZTZXJ2ZXJPckluUHJvZHVjdGlvbk1vZGUpIHtcbiAgICAgIGdsb2JhbEZpbGVDb250ZW50LnB1c2goYGltcG9ydCAndGhlbWVzLyR7dGhlbWVOYW1lfS8ke2ZpbGVuYW1lfSc7XFxuYCk7XG5cbiAgICAgIGltcG9ydHMucHVzaChgaW1wb3J0ICR7dmFyaWFibGV9IGZyb20gJ3RoZW1lcy8ke3RoZW1lTmFtZX0vJHtmaWxlbmFtZX0/aW5saW5lJztcXG5gKTtcbiAgICAgIHNoYWRvd09ubHlDc3MucHVzaChgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSwnJywgZG9jdW1lbnQpKTtcXG4gICAgYCk7XG4gICAgfVxuICB9XG5cbiAgbGV0IGkgPSAwO1xuICBpZiAodGhlbWVQcm9wZXJ0aWVzLmRvY3VtZW50Q3NzKSB7XG4gICAgY29uc3QgbWlzc2luZ01vZHVsZXMgPSBjaGVja01vZHVsZXModGhlbWVQcm9wZXJ0aWVzLmRvY3VtZW50Q3NzKTtcbiAgICBpZiAobWlzc2luZ01vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgIFwiTWlzc2luZyBucG0gbW9kdWxlcyBvciBmaWxlcyAnXCIgK1xuICAgICAgICAgIG1pc3NpbmdNb2R1bGVzLmpvaW4oXCInLCAnXCIpICtcbiAgICAgICAgICBcIicgZm9yIGRvY3VtZW50Q3NzIG1hcmtlZCBpbiAndGhlbWUuanNvbicuXFxuXCIgK1xuICAgICAgICAgIFwiSW5zdGFsbCBvciB1cGRhdGUgcGFja2FnZShzKSBieSBhZGRpbmcgYSBATnBtUGFja2FnZSBhbm5vdGF0aW9uIG9yIGluc3RhbGwgaXQgdXNpbmcgJ25wbS9wbnBtL2J1biBpJ1wiXG4gICAgICApO1xuICAgIH1cbiAgICB0aGVtZVByb3BlcnRpZXMuZG9jdW1lbnRDc3MuZm9yRWFjaCgoY3NzSW1wb3J0KSA9PiB7XG4gICAgICBjb25zdCB2YXJpYWJsZSA9ICdtb2R1bGUnICsgaSsrO1xuICAgICAgaW1wb3J0cy5wdXNoKGBpbXBvcnQgJHt2YXJpYWJsZX0gZnJvbSAnJHtjc3NJbXBvcnR9P2lubGluZSc7XFxuYCk7XG4gICAgICAvLyBEdWUgdG8gY2hyb21lIGJ1ZyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0zMzY4NzYgZm9udC1mYWNlIHdpbGwgbm90IHdvcmtcbiAgICAgIC8vIGluc2lkZSBzaGFkb3dSb290IHNvIHdlIG5lZWQgdG8gaW5qZWN0IGl0IHRoZXJlIGFsc28uXG4gICAgICBnbG9iYWxDc3NDb2RlLnB1c2goYGlmKHRhcmdldCAhPT0gZG9jdW1lbnQpIHtcbiAgICAgICAgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSwgJycsIHRhcmdldCkpO1xuICAgIH1cXG4gICAgYCk7XG4gICAgICBnbG9iYWxDc3NDb2RlLnB1c2goXG4gICAgICAgIGByZW1vdmVycy5wdXNoKGluamVjdEdsb2JhbENzcygke3ZhcmlhYmxlfS50b1N0cmluZygpLCAnJHtDU1NJTVBPUlRfQ09NTUVOVH0nLCBkb2N1bWVudCkpO1xcbiAgICBgXG4gICAgICApO1xuICAgIH0pO1xuICB9XG4gIGlmICh0aGVtZVByb3BlcnRpZXMuaW1wb3J0Q3NzKSB7XG4gICAgY29uc3QgbWlzc2luZ01vZHVsZXMgPSBjaGVja01vZHVsZXModGhlbWVQcm9wZXJ0aWVzLmltcG9ydENzcyk7XG4gICAgaWYgKG1pc3NpbmdNb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBcIk1pc3NpbmcgbnBtIG1vZHVsZXMgb3IgZmlsZXMgJ1wiICtcbiAgICAgICAgICBtaXNzaW5nTW9kdWxlcy5qb2luKFwiJywgJ1wiKSArXG4gICAgICAgICAgXCInIGZvciBpbXBvcnRDc3MgbWFya2VkIGluICd0aGVtZS5qc29uJy5cXG5cIiArXG4gICAgICAgICAgXCJJbnN0YWxsIG9yIHVwZGF0ZSBwYWNrYWdlKHMpIGJ5IGFkZGluZyBhIEBOcG1QYWNrYWdlIGFubm90YXRpb24gb3IgaW5zdGFsbCBpdCB1c2luZyAnbnBtL3BucG0vYnVuIGknXCJcbiAgICAgICk7XG4gICAgfVxuICAgIHRoZW1lUHJvcGVydGllcy5pbXBvcnRDc3MuZm9yRWFjaCgoY3NzUGF0aCkgPT4ge1xuICAgICAgY29uc3QgdmFyaWFibGUgPSAnbW9kdWxlJyArIGkrKztcbiAgICAgIGdsb2JhbEZpbGVDb250ZW50LnB1c2goYGltcG9ydCAnJHtjc3NQYXRofSc7XFxuYCk7XG4gICAgICBpbXBvcnRzLnB1c2goYGltcG9ydCAke3ZhcmlhYmxlfSBmcm9tICcke2Nzc1BhdGh9P2lubGluZSc7XFxuYCk7XG4gICAgICBzaGFkb3dPbmx5Q3NzLnB1c2goYHJlbW92ZXJzLnB1c2goaW5qZWN0R2xvYmFsQ3NzKCR7dmFyaWFibGV9LnRvU3RyaW5nKCksICcke0NTU0lNUE9SVF9DT01NRU5UfScsIHRhcmdldCkpO1xcbmApO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKGF1dG9JbmplY3RDb21wb25lbnRzKSB7XG4gICAgY29tcG9uZW50c0ZpbGVzLmZvckVhY2goKGNvbXBvbmVudENzcykgPT4ge1xuICAgICAgY29uc3QgZmlsZW5hbWUgPSBiYXNlbmFtZShjb21wb25lbnRDc3MpO1xuICAgICAgY29uc3QgdGFnID0gZmlsZW5hbWUucmVwbGFjZSgnLmNzcycsICcnKTtcbiAgICAgIGNvbnN0IHZhcmlhYmxlID0gY2FtZWxDYXNlKGZpbGVuYW1lKTtcbiAgICAgIGNvbXBvbmVudENzc0ltcG9ydHMucHVzaChcbiAgICAgICAgYGltcG9ydCAke3ZhcmlhYmxlfSBmcm9tICd0aGVtZXMvJHt0aGVtZU5hbWV9LyR7dGhlbWVDb21wb25lbnRzRm9sZGVyfS8ke2ZpbGVuYW1lfT9pbmxpbmUnO1xcbmBcbiAgICAgICk7XG4gICAgICAvLyBEb24ndCBmb3JtYXQgYXMgdGhlIGdlbmVyYXRlZCBmaWxlIGZvcm1hdHRpbmcgd2lsbCBnZXQgd29ua3khXG4gICAgICBjb25zdCBjb21wb25lbnRTdHJpbmcgPSBgcmVnaXN0ZXJTdHlsZXMoXG4gICAgICAgICcke3RhZ30nLFxuICAgICAgICB1bnNhZmVDU1MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSlcbiAgICAgICk7XG4gICAgICBgO1xuICAgICAgY29tcG9uZW50Q3NzQ29kZS5wdXNoKGNvbXBvbmVudFN0cmluZyk7XG4gICAgfSk7XG4gIH1cblxuICB0aGVtZUZpbGVDb250ZW50ICs9IGltcG9ydHMuam9pbignJyk7XG5cbiAgLy8gRG9uJ3QgZm9ybWF0IGFzIHRoZSBnZW5lcmF0ZWQgZmlsZSBmb3JtYXR0aW5nIHdpbGwgZ2V0IHdvbmt5IVxuICAvLyBJZiB0YXJnZXRzIGNoZWNrIHRoYXQgd2Ugb25seSByZWdpc3RlciB0aGUgc3R5bGUgcGFydHMgb25jZSwgY2hlY2tzIGV4aXN0IGZvciBnbG9iYWwgY3NzIGFuZCBjb21wb25lbnQgY3NzXG4gIGNvbnN0IHRoZW1lRmlsZUFwcGx5ID0gYFxuICBsZXQgdGhlbWVSZW1vdmVycyA9IG5ldyBXZWFrTWFwKCk7XG4gIGxldCB0YXJnZXRzID0gW107XG5cbiAgZXhwb3J0IGNvbnN0IGFwcGx5VGhlbWUgPSAodGFyZ2V0KSA9PiB7XG4gICAgY29uc3QgcmVtb3ZlcnMgPSBbXTtcbiAgICBpZiAodGFyZ2V0ICE9PSBkb2N1bWVudCkge1xuICAgICAgJHtzaGFkb3dPbmx5Q3NzLmpvaW4oJycpfVxuICAgICAgJHthdXRvSW5qZWN0R2xvYmFsQ3NzSW1wb3J0cyA/IGBcbiAgICAgICAgd2ViY29tcG9uZW50R2xvYmFsQ3NzSW5qZWN0b3IoKGNzcykgPT4ge1xuICAgICAgICAgIHJlbW92ZXJzLnB1c2goaW5qZWN0R2xvYmFsQ3NzKGNzcywgJycsIHRhcmdldCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgYCA6ICcnfVxuICAgIH1cbiAgICAke3BhcmVudFRoZW1lfVxuICAgICR7Z2xvYmFsQ3NzQ29kZS5qb2luKCcnKX1cblxuICAgIGlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgICAgIHRhcmdldHMucHVzaChuZXcgV2Vha1JlZih0YXJnZXQpKTtcbiAgICAgIHRoZW1lUmVtb3ZlcnMuc2V0KHRhcmdldCwgcmVtb3ZlcnMpO1xuICAgIH1cblxuICB9XG5cbmA7XG4gIGNvbXBvbmVudHNGaWxlQ29udGVudCArPSBgXG4ke2NvbXBvbmVudENzc0ltcG9ydHMuam9pbignJyl9XG5cbmlmICghZG9jdW1lbnRbJyR7Y29tcG9uZW50Q3NzRmxhZ30nXSkge1xuICAke2NvbXBvbmVudENzc0NvZGUuam9pbignJyl9XG4gIGRvY3VtZW50Wycke2NvbXBvbmVudENzc0ZsYWd9J10gPSB0cnVlO1xufVxuXG5pZiAoaW1wb3J0Lm1ldGEuaG90KSB7XG4gIGltcG9ydC5tZXRhLmhvdC5hY2NlcHQoKG1vZHVsZSkgPT4ge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgfSk7XG59XG5cbmA7XG5cbiAgdGhlbWVGaWxlQ29udGVudCArPSB0aGVtZUZpbGVBcHBseTtcbiAgdGhlbWVGaWxlQ29udGVudCArPSBgXG5pZiAoaW1wb3J0Lm1ldGEuaG90KSB7XG4gIGltcG9ydC5tZXRhLmhvdC5hY2NlcHQoKG1vZHVsZSkgPT4ge1xuXG4gICAgaWYgKG5lZWRzUmVsb2FkT25DaGFuZ2VzKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldHMuZm9yRWFjaCh0YXJnZXRSZWYgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSB0YXJnZXRSZWYuZGVyZWYoKTtcbiAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgIHRoZW1lUmVtb3ZlcnMuZ2V0KHRhcmdldCkuZm9yRWFjaChyZW1vdmVyID0+IHJlbW92ZXIoKSlcbiAgICAgICAgICBtb2R1bGUuYXBwbHlUaGVtZSh0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSk7XG5cbiAgaW1wb3J0Lm1ldGEuaG90Lm9uKCd2aXRlOmFmdGVyVXBkYXRlJywgKHVwZGF0ZSkgPT4ge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd2YWFkaW4tdGhlbWUtdXBkYXRlZCcsIHsgZGV0YWlsOiB1cGRhdGUgfSkpO1xuICB9KTtcbn1cblxuYDtcblxuICBnbG9iYWxJbXBvcnRDb250ZW50ICs9IGBcbiR7Z2xvYmFsRmlsZUNvbnRlbnQuam9pbignJyl9XG5gO1xuXG4gIHdyaXRlSWZDaGFuZ2VkKHJlc29sdmUob3V0cHV0Rm9sZGVyLCBnbG9iYWxGaWxlbmFtZSksIGdsb2JhbEltcG9ydENvbnRlbnQpO1xuICB3cml0ZUlmQ2hhbmdlZChyZXNvbHZlKG91dHB1dEZvbGRlciwgdGhlbWVGaWxlbmFtZSksIHRoZW1lRmlsZUNvbnRlbnQpO1xuICB3cml0ZUlmQ2hhbmdlZChyZXNvbHZlKG91dHB1dEZvbGRlciwgY29tcG9uZW50c0ZpbGVuYW1lKSwgY29tcG9uZW50c0ZpbGVDb250ZW50KTtcbn1cblxuZnVuY3Rpb24gd3JpdGVJZkNoYW5nZWQoZmlsZSwgZGF0YSkge1xuICBpZiAoIWV4aXN0c1N5bmMoZmlsZSkgfHwgcmVhZEZpbGVTeW5jKGZpbGUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkgIT09IGRhdGEpIHtcbiAgICB3cml0ZUZpbGVTeW5jKGZpbGUsIGRhdGEpO1xuICB9XG59XG5cbi8qKlxuICogTWFrZSBnaXZlbiBzdHJpbmcgaW50byBjYW1lbENhc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBzdHJpbmcgdG8gbWFrZSBpbnRvIGNhbWVDYXNlXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjYW1lbENhc2VkIHZlcnNpb25cbiAqL1xuZnVuY3Rpb24gY2FtZWxDYXNlKHN0cikge1xuICByZXR1cm4gc3RyXG4gICAgLnJlcGxhY2UoLyg/Ol5cXHd8W0EtWl18XFxiXFx3KS9nLCBmdW5jdGlvbiAod29yZCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBpbmRleCA9PT0gMCA/IHdvcmQudG9Mb3dlckNhc2UoKSA6IHdvcmQudG9VcHBlckNhc2UoKTtcbiAgICB9KVxuICAgIC5yZXBsYWNlKC9cXHMrL2csICcnKVxuICAgIC5yZXBsYWNlKC9cXC58XFwtL2csICcnKTtcbn1cblxuZXhwb3J0IHsgd3JpdGVUaGVtZUZpbGVzIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEJhc2lsR0lCTVxcXFxJZGVhUHJvamVjdHNcXFxcY29udGFjdGFwcFxcXFx0YXJnZXRcXFxccGx1Z2luc1xcXFxhcHBsaWNhdGlvbi10aGVtZS1wbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEJhc2lsR0lCTVxcXFxJZGVhUHJvamVjdHNcXFxcY29udGFjdGFwcFxcXFx0YXJnZXRcXFxccGx1Z2luc1xcXFxhcHBsaWNhdGlvbi10aGVtZS1wbHVnaW5cXFxcdGhlbWUtY29weS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQmFzaWxHSUJNL0lkZWFQcm9qZWN0cy9jb250YWN0YXBwL3RhcmdldC9wbHVnaW5zL2FwcGxpY2F0aW9uLXRoZW1lLXBsdWdpbi90aGVtZS1jb3B5LmpzXCI7LypcbiAqIENvcHlyaWdodCAyMDAwLTIwMjQgVmFhZGluIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdFxuICogdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2ZcbiAqIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUXG4gKiBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGVcbiAqIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyXG4gKiB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgY29udGFpbnMgZnVuY3Rpb25zIGFuZCBmZWF0dXJlcyB1c2VkIHRvIGNvcHkgdGhlbWUgZmlsZXMuXG4gKi9cblxuaW1wb3J0IHsgcmVhZGRpclN5bmMsIHN0YXRTeW5jLCBta2RpclN5bmMsIGV4aXN0c1N5bmMsIGNvcHlGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHJlc29sdmUsIGJhc2VuYW1lLCByZWxhdGl2ZSwgZXh0bmFtZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZ2xvYlN5bmMgfSBmcm9tICdnbG9iJztcblxuY29uc3QgaWdub3JlZEZpbGVFeHRlbnNpb25zID0gWycuY3NzJywgJy5qcycsICcuanNvbiddO1xuXG4vKipcbiAqIENvcHkgdGhlbWUgc3RhdGljIHJlc291cmNlcyB0byBzdGF0aWMgYXNzZXRzIGZvbGRlci4gQWxsIGZpbGVzIGluIHRoZSB0aGVtZVxuICogZm9sZGVyIHdpbGwgYmUgY29waWVkIGV4Y2x1ZGluZyBjc3MsIGpzIGFuZCBqc29uIGZpbGVzIHRoYXQgd2lsbCBiZVxuICogaGFuZGxlZCBieSB3ZWJwYWNrIGFuZCBub3QgYmUgc2hhcmVkIGFzIHN0YXRpYyBmaWxlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhlbWVGb2xkZXIgRm9sZGVyIHdpdGggdGhlbWUgZmlsZVxuICogQHBhcmFtIHtzdHJpbmd9IHByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIgcmVzb3VyY2VzIG91dHB1dCBmb2xkZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBsb2dnZXIgcGx1Z2luIGxvZ2dlclxuICovXG5mdW5jdGlvbiBjb3B5VGhlbWVSZXNvdXJjZXModGhlbWVGb2xkZXIsIHByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsIGxvZ2dlcikge1xuICBjb25zdCBzdGF0aWNBc3NldHNUaGVtZUZvbGRlciA9IHJlc29sdmUocHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciwgJ3RoZW1lcycsIGJhc2VuYW1lKHRoZW1lRm9sZGVyKSk7XG4gIGNvbnN0IGNvbGxlY3Rpb24gPSBjb2xsZWN0Rm9sZGVycyh0aGVtZUZvbGRlciwgbG9nZ2VyKTtcblxuICAvLyBPbmx5IGNyZWF0ZSBhc3NldHMgZm9sZGVyIGlmIHRoZXJlIGFyZSBmaWxlcyB0byBjb3B5LlxuICBpZiAoY29sbGVjdGlvbi5maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgbWtkaXJTeW5jKHN0YXRpY0Fzc2V0c1RoZW1lRm9sZGVyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAvLyBjcmVhdGUgZm9sZGVycyB3aXRoXG4gICAgY29sbGVjdGlvbi5kaXJlY3Rvcmllcy5mb3JFYWNoKChkaXJlY3RvcnkpID0+IHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlRGlyZWN0b3J5ID0gcmVsYXRpdmUodGhlbWVGb2xkZXIsIGRpcmVjdG9yeSk7XG4gICAgICBjb25zdCB0YXJnZXREaXJlY3RvcnkgPSByZXNvbHZlKHN0YXRpY0Fzc2V0c1RoZW1lRm9sZGVyLCByZWxhdGl2ZURpcmVjdG9yeSk7XG5cbiAgICAgIG1rZGlyU3luYyh0YXJnZXREaXJlY3RvcnksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgIH0pO1xuXG4gICAgY29sbGVjdGlvbi5maWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCByZWxhdGl2ZUZpbGUgPSByZWxhdGl2ZSh0aGVtZUZvbGRlciwgZmlsZSk7XG4gICAgICBjb25zdCB0YXJnZXRGaWxlID0gcmVzb2x2ZShzdGF0aWNBc3NldHNUaGVtZUZvbGRlciwgcmVsYXRpdmVGaWxlKTtcbiAgICAgIGNvcHlGaWxlSWZBYnNlbnRPck5ld2VyKGZpbGUsIHRhcmdldEZpbGUsIGxvZ2dlcik7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb2xsZWN0IGFsbCBmb2xkZXJzIHdpdGggY29weWFibGUgZmlsZXMgYW5kIGFsbCBmaWxlcyB0byBiZSBjb3BpZWQuXG4gKiBGb2xlZCB3aWxsIG5vdCBiZSBhZGRlZCBpZiBubyBmaWxlcyBpbiBmb2xkZXIgb3Igc3ViZm9sZGVycy5cbiAqXG4gKiBGaWxlcyB3aWxsIG5vdCBjb250YWluIGZpbGVzIHdpdGggaWdub3JlZCBleHRlbnNpb25zIGFuZCBmb2xkZXJzIG9ubHkgY29udGFpbmluZyBpZ25vcmVkIGZpbGVzIHdpbGwgbm90IGJlIGFkZGVkLlxuICpcbiAqIEBwYXJhbSBmb2xkZXJUb0NvcHkgZm9sZGVyIHdlIHdpbGwgY29weSBmaWxlcyBmcm9tXG4gKiBAcGFyYW0gbG9nZ2VyIHBsdWdpbiBsb2dnZXJcbiAqIEByZXR1cm4ge3tkaXJlY3RvcmllczogW10sIGZpbGVzOiBbXX19IG9iamVjdCBjb250YWluaW5nIGRpcmVjdG9yaWVzIHRvIGNyZWF0ZSBhbmQgZmlsZXMgdG8gY29weVxuICovXG5mdW5jdGlvbiBjb2xsZWN0Rm9sZGVycyhmb2xkZXJUb0NvcHksIGxvZ2dlcikge1xuICBjb25zdCBjb2xsZWN0aW9uID0geyBkaXJlY3RvcmllczogW10sIGZpbGVzOiBbXSB9O1xuICBsb2dnZXIudHJhY2UoJ2ZpbGVzIGluIGRpcmVjdG9yeScsIHJlYWRkaXJTeW5jKGZvbGRlclRvQ29weSkpO1xuICByZWFkZGlyU3luYyhmb2xkZXJUb0NvcHkpLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICBjb25zdCBmaWxlVG9Db3B5ID0gcmVzb2x2ZShmb2xkZXJUb0NvcHksIGZpbGUpO1xuICAgIHRyeSB7XG4gICAgICBpZiAoc3RhdFN5bmMoZmlsZVRvQ29weSkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICBsb2dnZXIuZGVidWcoJ0dvaW5nIHRocm91Z2ggZGlyZWN0b3J5JywgZmlsZVRvQ29weSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbGxlY3RGb2xkZXJzKGZpbGVUb0NvcHksIGxvZ2dlcik7XG4gICAgICAgIGlmIChyZXN1bHQuZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0b3JpZXMucHVzaChmaWxlVG9Db3B5KTtcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0FkZGluZyBkaXJlY3RvcnknLCBmaWxlVG9Db3B5KTtcbiAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdG9yaWVzLnB1c2guYXBwbHkoY29sbGVjdGlvbi5kaXJlY3RvcmllcywgcmVzdWx0LmRpcmVjdG9yaWVzKTtcbiAgICAgICAgICBjb2xsZWN0aW9uLmZpbGVzLnB1c2guYXBwbHkoY29sbGVjdGlvbi5maWxlcywgcmVzdWx0LmZpbGVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghaWdub3JlZEZpbGVFeHRlbnNpb25zLmluY2x1ZGVzKGV4dG5hbWUoZmlsZVRvQ29weSkpKSB7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnQWRkaW5nIGZpbGUnLCBmaWxlVG9Db3B5KTtcbiAgICAgICAgY29sbGVjdGlvbi5maWxlcy5wdXNoKGZpbGVUb0NvcHkpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBoYW5kbGVOb1N1Y2hGaWxlRXJyb3IoZmlsZVRvQ29weSwgZXJyb3IsIGxvZ2dlcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGNvbGxlY3Rpb247XG59XG5cbi8qKlxuICogQ29weSBhbnkgc3RhdGljIG5vZGVfbW9kdWxlcyBhc3NldHMgbWFya2VkIGluIHRoZW1lLmpzb24gdG9cbiAqIHByb2plY3Qgc3RhdGljIGFzc2V0cyBmb2xkZXIuXG4gKlxuICogVGhlIHRoZW1lLmpzb24gY29udGVudCBmb3IgYXNzZXRzIGlzIHNldCB1cCBhczpcbiAqIHtcbiAqICAgYXNzZXRzOiB7XG4gKiAgICAgXCJub2RlX21vZHVsZSBpZGVudGlmaWVyXCI6IHtcbiAqICAgICAgIFwiY29weS1ydWxlXCI6IFwidGFyZ2V0L2ZvbGRlclwiLFxuICogICAgIH1cbiAqICAgfVxuICogfVxuICpcbiAqIFRoaXMgd291bGQgbWVhbiB0aGF0IGFuIGFzc2V0IHdvdWxkIGJlIGJ1aWx0IGFzOlxuICogXCJAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtZnJlZVwiOiB7XG4gKiAgIFwic3Zncy9yZWd1bGFyLyoqXCI6IFwiZm9ydGF3ZXNvbWUvaWNvbnNcIlxuICogfVxuICogV2hlcmUgJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1mcmVlJyBpcyB0aGUgbnBtIHBhY2thZ2UsICdzdmdzL3JlZ3VsYXIvKionIGlzIHdoYXQgc2hvdWxkIGJlIGNvcGllZFxuICogYW5kICdmb3J0YXdlc29tZS9pY29ucycgaXMgdGhlIHRhcmdldCBkaXJlY3RvcnkgdW5kZXIgcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciB3aGVyZSB0aGluZ3NcbiAqIHdpbGwgZ2V0IGNvcGllZCB0by5cbiAqXG4gKiBOb3RlISB0aGVyZSBjYW4gYmUgbXVsdGlwbGUgY29weS1ydWxlcyB3aXRoIHRhcmdldCBmb2xkZXJzIGZvciBvbmUgbnBtIHBhY2thZ2UgYXNzZXQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBuYW1lIG9mIHRoZSB0aGVtZSB3ZSBhcmUgY29weWluZyBhc3NldHMgZm9yXG4gKiBAcGFyYW0ge2pzb259IHRoZW1lUHJvcGVydGllcyB0aGVtZSBwcm9wZXJ0aWVzIGpzb24gd2l0aCBkYXRhIG9uIGFzc2V0c1xuICogQHBhcmFtIHtzdHJpbmd9IHByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIgcHJvamVjdCBvdXRwdXQgZm9sZGVyIHdoZXJlIHdlIGNvcHkgYXNzZXRzIHRvIHVuZGVyIHRoZW1lL1t0aGVtZU5hbWVdXG4gKiBAcGFyYW0ge29iamVjdH0gbG9nZ2VyIHBsdWdpbiBsb2dnZXJcbiAqL1xuZnVuY3Rpb24gY29weVN0YXRpY0Fzc2V0cyh0aGVtZU5hbWUsIHRoZW1lUHJvcGVydGllcywgcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciwgbG9nZ2VyKSB7XG4gIGNvbnN0IGFzc2V0cyA9IHRoZW1lUHJvcGVydGllc1snYXNzZXRzJ107XG4gIGlmICghYXNzZXRzKSB7XG4gICAgbG9nZ2VyLmRlYnVnKCdubyBhc3NldHMgdG8gaGFuZGxlIG5vIHN0YXRpYyBhc3NldHMgd2VyZSBjb3BpZWQnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBta2RpclN5bmMocHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciwge1xuICAgIHJlY3Vyc2l2ZTogdHJ1ZVxuICB9KTtcbiAgY29uc3QgbWlzc2luZ01vZHVsZXMgPSBjaGVja01vZHVsZXMoT2JqZWN0LmtleXMoYXNzZXRzKSk7XG4gIGlmIChtaXNzaW5nTW9kdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgRXJyb3IoXG4gICAgICBcIk1pc3NpbmcgbnBtIG1vZHVsZXMgJ1wiICtcbiAgICAgICAgbWlzc2luZ01vZHVsZXMuam9pbihcIicsICdcIikgK1xuICAgICAgICBcIicgZm9yIGFzc2V0cyBtYXJrZWQgaW4gJ3RoZW1lLmpzb24nLlxcblwiICtcbiAgICAgICAgXCJJbnN0YWxsIHBhY2thZ2UocykgYnkgYWRkaW5nIGEgQE5wbVBhY2thZ2UgYW5ub3RhdGlvbiBvciBpbnN0YWxsIGl0IHVzaW5nICducG0vcG5wbS9idW4gaSdcIlxuICAgICk7XG4gIH1cbiAgT2JqZWN0LmtleXMoYXNzZXRzKS5mb3JFYWNoKChtb2R1bGUpID0+IHtcbiAgICBjb25zdCBjb3B5UnVsZXMgPSBhc3NldHNbbW9kdWxlXTtcbiAgICBPYmplY3Qua2V5cyhjb3B5UnVsZXMpLmZvckVhY2goKGNvcHlSdWxlKSA9PiB7XG4gICAgICAvLyBHbG9iIGRvZXNuJ3Qgd29yayB3aXRoIHdpbmRvd3MgcGF0aCBzZXBhcmF0b3Igc28gcmVwbGFjaW5nIGl0IGhlcmUuXG4gICAgICBjb25zdCBub2RlU291cmNlcyA9IHJlc29sdmUoJ25vZGVfbW9kdWxlcy8nLCBtb2R1bGUsIGNvcHlSdWxlKS5yZXBsYWNlKC9cXFxcL2csJy8nKTtcbiAgICAgIGNvbnN0IGZpbGVzID0gZ2xvYlN5bmMobm9kZVNvdXJjZXMsIHsgbm9kaXI6IHRydWUgfSk7XG4gICAgICBjb25zdCB0YXJnZXRGb2xkZXIgPSByZXNvbHZlKHByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsICd0aGVtZXMnLCB0aGVtZU5hbWUsIGNvcHlSdWxlc1tjb3B5UnVsZV0pO1xuXG4gICAgICBta2RpclN5bmModGFyZ2V0Rm9sZGVyLCB7XG4gICAgICAgIHJlY3Vyc2l2ZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvcHlUYXJnZXQgPSByZXNvbHZlKHRhcmdldEZvbGRlciwgYmFzZW5hbWUoZmlsZSkpO1xuICAgICAgICBjb3B5RmlsZUlmQWJzZW50T3JOZXdlcihmaWxlLCBjb3B5VGFyZ2V0LCBsb2dnZXIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjaGVja01vZHVsZXMobW9kdWxlcykge1xuICBjb25zdCBtaXNzaW5nID0gW107XG5cbiAgbW9kdWxlcy5mb3JFYWNoKChtb2R1bGUpID0+IHtcbiAgICBpZiAoIWV4aXN0c1N5bmMocmVzb2x2ZSgnbm9kZV9tb2R1bGVzLycsIG1vZHVsZSkpKSB7XG4gICAgICBtaXNzaW5nLnB1c2gobW9kdWxlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBtaXNzaW5nO1xufVxuXG4vKipcbiAqIENvcGllcyBnaXZlbiBmaWxlIHRvIGEgZ2l2ZW4gdGFyZ2V0IHBhdGgsIGlmIHRhcmdldCBmaWxlIGRvZXNuJ3QgZXhpc3Qgb3IgaWZcbiAqIGZpbGUgdG8gY29weSBpcyBuZXdlci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlVG9Db3B5IHBhdGggb2YgdGhlIGZpbGUgdG8gY29weVxuICogQHBhcmFtIHtzdHJpbmd9IGNvcHlUYXJnZXQgcGF0aCBvZiB0aGUgdGFyZ2V0IGZpbGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBsb2dnZXIgcGx1Z2luIGxvZ2dlclxuICovXG5mdW5jdGlvbiBjb3B5RmlsZUlmQWJzZW50T3JOZXdlcihmaWxlVG9Db3B5LCBjb3B5VGFyZ2V0LCBsb2dnZXIpIHtcbiAgdHJ5IHtcbiAgICBpZiAoIWV4aXN0c1N5bmMoY29weVRhcmdldCkgfHwgc3RhdFN5bmMoY29weVRhcmdldCkubXRpbWUgPCBzdGF0U3luYyhmaWxlVG9Db3B5KS5tdGltZSkge1xuICAgICAgbG9nZ2VyLnRyYWNlKCdDb3B5aW5nOiAnLCBmaWxlVG9Db3B5LCAnPT4nLCBjb3B5VGFyZ2V0KTtcbiAgICAgIGNvcHlGaWxlU3luYyhmaWxlVG9Db3B5LCBjb3B5VGFyZ2V0KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaGFuZGxlTm9TdWNoRmlsZUVycm9yKGZpbGVUb0NvcHksIGVycm9yLCBsb2dnZXIpO1xuICB9XG59XG5cbi8vIElnbm9yZXMgZXJyb3JzIGR1ZSB0byBmaWxlIG1pc3NpbmcgZHVyaW5nIHRoZW1lIHByb2Nlc3Npbmdcbi8vIFRoaXMgbWF5IGhhcHBlbiBmb3IgZXhhbXBsZSB3aGVuIGFuIElERSBjcmVhdGVzIGEgdGVtcG9yYXJ5IGZpbGVcbi8vIGFuZCB0aGVuIGltbWVkaWF0ZWx5IGRlbGV0ZXMgaXRcbmZ1bmN0aW9uIGhhbmRsZU5vU3VjaEZpbGVFcnJvcihmaWxlLCBlcnJvciwgbG9nZ2VyKSB7XG4gIGlmIChlcnJvci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgIGxvZ2dlci53YXJuKCdJZ25vcmluZyBub3QgZXhpc3RpbmcgZmlsZSAnICsgZmlsZSArICcuIEZpbGUgbWF5IGhhdmUgYmVlbiBkZWxldGVkIGR1cmluZyB0aGVtZSBwcm9jZXNzaW5nLicpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmV4cG9ydCB7IGNoZWNrTW9kdWxlcywgY29weVN0YXRpY0Fzc2V0cywgY29weVRoZW1lUmVzb3VyY2VzIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEJhc2lsR0lCTVxcXFxJZGVhUHJvamVjdHNcXFxcY29udGFjdGFwcFxcXFx0YXJnZXRcXFxccGx1Z2luc1xcXFx0aGVtZS1sb2FkZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEJhc2lsR0lCTVxcXFxJZGVhUHJvamVjdHNcXFxcY29udGFjdGFwcFxcXFx0YXJnZXRcXFxccGx1Z2luc1xcXFx0aGVtZS1sb2FkZXJcXFxcdGhlbWUtbG9hZGVyLXV0aWxzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9CYXNpbEdJQk0vSWRlYVByb2plY3RzL2NvbnRhY3RhcHAvdGFyZ2V0L3BsdWdpbnMvdGhlbWUtbG9hZGVyL3RoZW1lLWxvYWRlci11dGlscy5qc1wiO2ltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHJlc29sdmUsIGJhc2VuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InO1xuXG4vLyBDb2xsZWN0IGdyb3VwcyBbdXJsKF0gWyd8XCJdb3B0aW9uYWwgJy4vfC4uLycsIG90aGVyICcuLi8nIHNlZ21lbnRzIG9wdGlvbmFsLCBmaWxlIHBhcnQgYW5kIGVuZCBvZiB1cmxcbi8vIFRoZSBhZGRpdGlvbmFsIGRvdCBzZWdtZW50cyBjb3VsZCBiZSBVUkwgcmVmZXJlbmNpbmcgYXNzZXRzIGluIG5lc3RlZCBpbXBvcnRlZCBDU1Ncbi8vIFdoZW4gVml0ZSBpbmxpbmVzIENTUyBpbXBvcnQgaXQgZG9lcyBub3QgcmV3cml0ZSByZWxhdGl2ZSBVUkwgZm9yIG5vdC1yZXNvbHZhYmxlIHJlc291cmNlXG4vLyBzbyB0aGUgZmluYWwgQ1NTIGVuZHMgdXAgd2l0aCB3cm9uZyByZWxhdGl2ZSBVUkxzIChyLmcuIC4uLy4uL3BrZy9pY29uLnN2Zylcbi8vIElmIHRoZSBVUkwgaXMgcmVsYXRpdmUsIHdlIHNob3VsZCB0cnkgdG8gY2hlY2sgaWYgaXQgaXMgYW4gYXNzZXQgYnkgaWdub3JpbmcgdGhlIGFkZGl0aW9uYWwgZG90IHNlZ21lbnRzXG5jb25zdCB1cmxNYXRjaGVyID0gLyh1cmxcXChcXHMqKShcXCd8XFxcIik/KFxcLlxcL3xcXC5cXC5cXC8pKCg/OlxcMykqKT8oXFxTKikoXFwyXFxzKlxcKSkvZztcblxuZnVuY3Rpb24gYXNzZXRzQ29udGFpbnMoZmlsZVVybCwgdGhlbWVGb2xkZXIsIGxvZ2dlcikge1xuICBjb25zdCB0aGVtZVByb3BlcnRpZXMgPSBnZXRUaGVtZVByb3BlcnRpZXModGhlbWVGb2xkZXIpO1xuICBpZiAoIXRoZW1lUHJvcGVydGllcykge1xuICAgIGxvZ2dlci5kZWJ1ZygnTm8gdGhlbWUgcHJvcGVydGllcyBmb3VuZC4nKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgYXNzZXRzID0gdGhlbWVQcm9wZXJ0aWVzWydhc3NldHMnXTtcbiAgaWYgKCFhc3NldHMpIHtcbiAgICBsb2dnZXIuZGVidWcoJ05vIGRlZmluZWQgYXNzZXRzIGluIHRoZW1lIHByb3BlcnRpZXMnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gR28gdGhyb3VnaCBlYWNoIGFzc2V0IG1vZHVsZVxuICBmb3IgKGxldCBtb2R1bGUgb2YgT2JqZWN0LmtleXMoYXNzZXRzKSkge1xuICAgIGNvbnN0IGNvcHlSdWxlcyA9IGFzc2V0c1ttb2R1bGVdO1xuICAgIC8vIEdvIHRocm91Z2ggZWFjaCBjb3B5IHJ1bGVcbiAgICBmb3IgKGxldCBjb3B5UnVsZSBvZiBPYmplY3Qua2V5cyhjb3B5UnVsZXMpKSB7XG4gICAgICAvLyBpZiBmaWxlIHN0YXJ0cyB3aXRoIGNvcHlSdWxlIHRhcmdldCBjaGVjayBpZiBmaWxlIHdpdGggcGF0aCBhZnRlciBjb3B5IHRhcmdldCBjYW4gYmUgZm91bmRcbiAgICAgIGlmIChmaWxlVXJsLnN0YXJ0c1dpdGgoY29weVJ1bGVzW2NvcHlSdWxlXSkpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0RmlsZSA9IGZpbGVVcmwucmVwbGFjZShjb3B5UnVsZXNbY29weVJ1bGVdLCAnJyk7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gZ2xvYlN5bmMocmVzb2x2ZSgnbm9kZV9tb2R1bGVzLycsIG1vZHVsZSwgY29weVJ1bGUpLCB7IG5vZGlyOiB0cnVlIH0pO1xuXG4gICAgICAgIGZvciAobGV0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICBpZiAoZmlsZS5lbmRzV2l0aCh0YXJnZXRGaWxlKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXRUaGVtZVByb3BlcnRpZXModGhlbWVGb2xkZXIpIHtcbiAgY29uc3QgdGhlbWVQcm9wZXJ0eUZpbGUgPSByZXNvbHZlKHRoZW1lRm9sZGVyLCAndGhlbWUuanNvbicpO1xuICBpZiAoIWV4aXN0c1N5bmModGhlbWVQcm9wZXJ0eUZpbGUpKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIGNvbnN0IHRoZW1lUHJvcGVydHlGaWxlQXNTdHJpbmcgPSByZWFkRmlsZVN5bmModGhlbWVQcm9wZXJ0eUZpbGUpO1xuICBpZiAodGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge307XG4gIH1cbiAgcmV0dXJuIEpTT04ucGFyc2UodGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZyk7XG59XG5cbmZ1bmN0aW9uIHJld3JpdGVDc3NVcmxzKHNvdXJjZSwgaGFuZGxlZFJlc291cmNlRm9sZGVyLCB0aGVtZUZvbGRlciwgbG9nZ2VyLCBvcHRpb25zKSB7XG4gIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKHVybE1hdGNoZXIsIGZ1bmN0aW9uIChtYXRjaCwgdXJsLCBxdW90ZU1hcmssIHJlcGxhY2UsIGFkZGl0aW9uYWxEb3RTZWdtZW50cywgZmlsZVVybCwgZW5kU3RyaW5nKSB7XG4gICAgbGV0IGFic29sdXRlUGF0aCA9IHJlc29sdmUoaGFuZGxlZFJlc291cmNlRm9sZGVyLCByZXBsYWNlLCBhZGRpdGlvbmFsRG90U2VnbWVudHMgfHwgJycsIGZpbGVVcmwpO1xuICAgIGxldCBleGlzdGluZ1RoZW1lUmVzb3VyY2UgPSBhYnNvbHV0ZVBhdGguc3RhcnRzV2l0aCh0aGVtZUZvbGRlcikgJiYgZXhpc3RzU3luYyhhYnNvbHV0ZVBhdGgpO1xuICAgIGlmICghZXhpc3RpbmdUaGVtZVJlc291cmNlICYmIGFkZGl0aW9uYWxEb3RTZWdtZW50cykge1xuICAgICAgLy8gVHJ5IHRvIHJlc29sdmUgcGF0aCB3aXRob3V0IGRvdCBzZWdtZW50cyBhcyBpdCBtYXkgYmUgYW4gdW5yZXNvbHZhYmxlXG4gICAgICAvLyByZWxhdGl2ZSBVUkwgZnJvbSBhbiBpbmxpbmVkIG5lc3RlZCBDU1NcbiAgICAgIGFic29sdXRlUGF0aCA9IHJlc29sdmUoaGFuZGxlZFJlc291cmNlRm9sZGVyLCByZXBsYWNlLCBmaWxlVXJsKTtcbiAgICAgIGV4aXN0aW5nVGhlbWVSZXNvdXJjZSA9IGFic29sdXRlUGF0aC5zdGFydHNXaXRoKHRoZW1lRm9sZGVyKSAmJiBleGlzdHNTeW5jKGFic29sdXRlUGF0aCk7XG4gICAgfVxuICAgIGNvbnN0IGlzQXNzZXQgPSBhc3NldHNDb250YWlucyhmaWxlVXJsLCB0aGVtZUZvbGRlciwgbG9nZ2VyKTtcbiAgICBpZiAoZXhpc3RpbmdUaGVtZVJlc291cmNlIHx8IGlzQXNzZXQpIHtcbiAgICAgIC8vIEFkZGluZyAuLyB3aWxsIHNraXAgY3NzLWxvYWRlciwgd2hpY2ggc2hvdWxkIGJlIGRvbmUgZm9yIGFzc2V0IGZpbGVzXG4gICAgICAvLyBJbiBhIHByb2R1Y3Rpb24gYnVpbGQsIHRoZSBjc3MgZmlsZSBpcyBpbiBWQUFESU4vYnVpbGQgYW5kIHN0YXRpYyBmaWxlcyBhcmUgaW4gVkFBRElOL3N0YXRpYywgc28gLi4vc3RhdGljIG5lZWRzIHRvIGJlIGFkZGVkXG4gICAgICBjb25zdCByZXBsYWNlbWVudCA9IG9wdGlvbnMuZGV2TW9kZSA/ICcuLycgOiAnLi4vc3RhdGljLyc7XG5cbiAgICAgIGNvbnN0IHNraXBMb2FkZXIgPSBleGlzdGluZ1RoZW1lUmVzb3VyY2UgPyAnJyA6IHJlcGxhY2VtZW50O1xuICAgICAgY29uc3QgZnJvbnRlbmRUaGVtZUZvbGRlciA9IHNraXBMb2FkZXIgKyAndGhlbWVzLycgKyBiYXNlbmFtZSh0aGVtZUZvbGRlcik7XG4gICAgICBsb2dnZXIubG9nKFxuICAgICAgICAnVXBkYXRpbmcgdXJsIGZvciBmaWxlJyxcbiAgICAgICAgXCInXCIgKyByZXBsYWNlICsgZmlsZVVybCArIFwiJ1wiLFxuICAgICAgICAndG8gdXNlJyxcbiAgICAgICAgXCInXCIgKyBmcm9udGVuZFRoZW1lRm9sZGVyICsgJy8nICsgZmlsZVVybCArIFwiJ1wiXG4gICAgICApO1xuICAgICAgLy8gYXNzZXRzIGFyZSBhbHdheXMgcmVsYXRpdmUgdG8gdGhlbWUgZm9sZGVyXG4gICAgICBjb25zdCBwYXRoUmVzb2x2ZWQgPSBpc0Fzc2V0ID8gJy8nICsgZmlsZVVybFxuICAgICAgICAgIDogYWJzb2x1dGVQYXRoLnN1YnN0cmluZyh0aGVtZUZvbGRlci5sZW5ndGgpLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcblxuICAgICAgLy8ga2VlcCB0aGUgdXJsIHRoZSBzYW1lIGV4Y2VwdCByZXBsYWNlIHRoZSAuLyBvciAuLi8gdG8gdGhlbWVzL1t0aGVtZUZvbGRlcl1cbiAgICAgIHJldHVybiB1cmwgKyAocXVvdGVNYXJrID8/ICcnKSArIGZyb250ZW5kVGhlbWVGb2xkZXIgKyBwYXRoUmVzb2x2ZWQgKyBlbmRTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmRldk1vZGUpIHtcbiAgICAgIGxvZ2dlci5sb2coXCJObyByZXdyaXRlIGZvciAnXCIsIG1hdGNoLCBcIicgYXMgdGhlIGZpbGUgd2FzIG5vdCBmb3VuZC5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEluIHByb2R1Y3Rpb24sIHRoZSBjc3MgaXMgaW4gVkFBRElOL2J1aWxkIGJ1dCB0aGUgdGhlbWUgZmlsZXMgYXJlIGluIC5cbiAgICAgIHJldHVybiB1cmwgKyAocXVvdGVNYXJrID8/ICcnKSArICcuLi8uLi8nICsgZmlsZVVybCArIGVuZFN0cmluZztcbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoO1xuICB9KTtcbiAgcmV0dXJuIHNvdXJjZTtcbn1cblxuZXhwb3J0IHsgcmV3cml0ZUNzc1VybHMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQmFzaWxHSUJNXFxcXElkZWFQcm9qZWN0c1xcXFxjb250YWN0YXBwXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXHJlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQmFzaWxHSUJNXFxcXElkZWFQcm9qZWN0c1xcXFxjb250YWN0YXBwXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXHJlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpblxcXFxyZWFjdC1mdW5jdGlvbi1sb2NhdGlvbi1wbHVnaW4uanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0Jhc2lsR0lCTS9JZGVhUHJvamVjdHMvY29udGFjdGFwcC90YXJnZXQvcGx1Z2lucy9yZWFjdC1mdW5jdGlvbi1sb2NhdGlvbi1wbHVnaW4vcmVhY3QtZnVuY3Rpb24tbG9jYXRpb24tcGx1Z2luLmpzXCI7aW1wb3J0ICogYXMgdCBmcm9tICdAYmFiZWwvdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkRnVuY3Rpb25Db21wb25lbnRTb3VyY2VMb2NhdGlvbkJhYmVsKCkge1xuICBmdW5jdGlvbiBpc1JlYWN0RnVuY3Rpb25OYW1lKG5hbWUpIHtcbiAgICAvLyBBIFJlYWN0IGNvbXBvbmVudCBmdW5jdGlvbiBhbHdheXMgc3RhcnRzIHdpdGggYSBDYXBpdGFsIGxldHRlclxuICAgIHJldHVybiBuYW1lICYmIG5hbWUubWF0Y2goL15bQS1aXS4qLyk7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGVzIGRlYnVnIGluZm8gYXMgTmFtZS5fX2RlYnVnU291cmNlRGVmaW5lPXsuLi59IGFmdGVyIHRoZSBnaXZlbiBzdGF0ZW1lbnQgKFwicGF0aFwiKS5cbiAgICogVGhpcyBpcyB1c2VkIHRvIG1ha2UgdGhlIHNvdXJjZSBsb2NhdGlvbiBvZiB0aGUgZnVuY3Rpb24gKGRlZmluZWQgYnkgdGhlIGxvYyBwYXJhbWV0ZXIpIGF2YWlsYWJsZSBpbiB0aGUgYnJvd3NlciBpbiBkZXZlbG9wbWVudCBtb2RlLlxuICAgKiBUaGUgbmFtZSBfX2RlYnVnU291cmNlRGVmaW5lIGlzIHByZWZpeGVkIGJ5IF9fIHRvIG1hcmsgdGhpcyBpcyBub3QgYSBwdWJsaWMgQVBJLlxuICAgKi9cbiAgZnVuY3Rpb24gYWRkRGVidWdJbmZvKHBhdGgsIG5hbWUsIGZpbGVuYW1lLCBsb2MpIHtcbiAgICBjb25zdCBsaW5lTnVtYmVyID0gbG9jLnN0YXJ0LmxpbmU7XG4gICAgY29uc3QgY29sdW1uTnVtYmVyID0gbG9jLnN0YXJ0LmNvbHVtbiArIDE7XG4gICAgY29uc3QgZGVidWdTb3VyY2VNZW1iZXIgPSB0Lm1lbWJlckV4cHJlc3Npb24odC5pZGVudGlmaWVyKG5hbWUpLCB0LmlkZW50aWZpZXIoJ19fZGVidWdTb3VyY2VEZWZpbmUnKSk7XG4gICAgY29uc3QgZGVidWdTb3VyY2VEZWZpbmUgPSB0Lm9iamVjdEV4cHJlc3Npb24oW1xuICAgICAgdC5vYmplY3RQcm9wZXJ0eSh0LmlkZW50aWZpZXIoJ2ZpbGVOYW1lJyksIHQuc3RyaW5nTGl0ZXJhbChmaWxlbmFtZSkpLFxuICAgICAgdC5vYmplY3RQcm9wZXJ0eSh0LmlkZW50aWZpZXIoJ2xpbmVOdW1iZXInKSwgdC5udW1lcmljTGl0ZXJhbChsaW5lTnVtYmVyKSksXG4gICAgICB0Lm9iamVjdFByb3BlcnR5KHQuaWRlbnRpZmllcignY29sdW1uTnVtYmVyJyksIHQubnVtZXJpY0xpdGVyYWwoY29sdW1uTnVtYmVyKSlcbiAgICBdKTtcbiAgICBjb25zdCBhc3NpZ25tZW50ID0gdC5leHByZXNzaW9uU3RhdGVtZW50KHQuYXNzaWdubWVudEV4cHJlc3Npb24oJz0nLCBkZWJ1Z1NvdXJjZU1lbWJlciwgZGVidWdTb3VyY2VEZWZpbmUpKTtcbiAgICBjb25zdCBjb25kaXRpb24gPSB0LmJpbmFyeUV4cHJlc3Npb24oXG4gICAgICAnPT09JyxcbiAgICAgIHQudW5hcnlFeHByZXNzaW9uKCd0eXBlb2YnLCB0LmlkZW50aWZpZXIobmFtZSkpLFxuICAgICAgdC5zdHJpbmdMaXRlcmFsKCdmdW5jdGlvbicpXG4gICAgKTtcbiAgICBjb25zdCBpZkZ1bmN0aW9uID0gdC5pZlN0YXRlbWVudChjb25kaXRpb24sIHQuYmxvY2tTdGF0ZW1lbnQoW2Fzc2lnbm1lbnRdKSk7XG4gICAgcGF0aC5pbnNlcnRBZnRlcihpZkZ1bmN0aW9uKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdmlzaXRvcjoge1xuICAgICAgVmFyaWFibGVEZWNsYXJhdGlvbihwYXRoLCBzdGF0ZSkge1xuICAgICAgICAvLyBGaW5kcyBkZWNsYXJhdGlvbnMgc3VjaCBhc1xuICAgICAgICAvLyBjb25zdCBGb28gPSAoKSA9PiA8ZGl2Lz5cbiAgICAgICAgLy8gZXhwb3J0IGNvbnN0IEJhciA9ICgpID0+IDxzcGFuLz5cblxuICAgICAgICAvLyBhbmQgd3JpdGVzIGEgRm9vLl9fZGVidWdTb3VyY2VEZWZpbmU9IHsuLn0gYWZ0ZXIgaXQsIHJlZmVycmluZyB0byB0aGUgc3RhcnQgb2YgdGhlIGZ1bmN0aW9uIGJvZHlcbiAgICAgICAgcGF0aC5ub2RlLmRlY2xhcmF0aW9ucy5mb3JFYWNoKChkZWNsYXJhdGlvbikgPT4ge1xuICAgICAgICAgIGlmIChkZWNsYXJhdGlvbi5pZC50eXBlICE9PSAnSWRlbnRpZmllcicpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbmFtZSA9IGRlY2xhcmF0aW9uPy5pZD8ubmFtZTtcbiAgICAgICAgICBpZiAoIWlzUmVhY3RGdW5jdGlvbk5hbWUobmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHN0YXRlLmZpbGUub3B0cy5maWxlbmFtZTtcbiAgICAgICAgICBpZiAoZGVjbGFyYXRpb24/LmluaXQ/LmJvZHk/LmxvYykge1xuICAgICAgICAgICAgYWRkRGVidWdJbmZvKHBhdGgsIG5hbWUsIGZpbGVuYW1lLCBkZWNsYXJhdGlvbi5pbml0LmJvZHkubG9jKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgRnVuY3Rpb25EZWNsYXJhdGlvbihwYXRoLCBzdGF0ZSkge1xuICAgICAgICAvLyBGaW5kcyBkZWNsYXJhdGlvbnMgc3VjaCBhc1xuICAgICAgICAvLyBmdW5jdGlvIEZvbygpIHsgcmV0dXJuIDxkaXYvPjsgfVxuICAgICAgICAvLyBleHBvcnQgZnVuY3Rpb24gQmFyKCkgeyByZXR1cm4gPHNwYW4+SGVsbG88L3NwYW4+O31cblxuICAgICAgICAvLyBhbmQgd3JpdGVzIGEgRm9vLl9fZGVidWdTb3VyY2VEZWZpbmU9IHsuLn0gYWZ0ZXIgaXQsIHJlZmVycmluZyB0byB0aGUgc3RhcnQgb2YgdGhlIGZ1bmN0aW9uIGJvZHlcbiAgICAgICAgY29uc3Qgbm9kZSA9IHBhdGgubm9kZTtcbiAgICAgICAgY29uc3QgbmFtZSA9IG5vZGU/LmlkPy5uYW1lO1xuICAgICAgICBpZiAoIWlzUmVhY3RGdW5jdGlvbk5hbWUobmFtZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBzdGF0ZS5maWxlLm9wdHMuZmlsZW5hbWU7XG4gICAgICAgIGlmIChub2RlLmJvZHkubG9jKSB7XG4gICAgICAgICAgYWRkRGVidWdJbmZvKHBhdGgsIG5hbWUsIGZpbGVuYW1lLCBub2RlLmJvZHkubG9jKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiIsICJ7XG4gIFwiZnJvbnRlbmRGb2xkZXJcIjogXCJDOi9Vc2Vycy9CYXNpbEdJQk0vSWRlYVByb2plY3RzL2NvbnRhY3RhcHAvLi9zcmMvbWFpbi9mcm9udGVuZFwiLFxuICBcInRoZW1lRm9sZGVyXCI6IFwidGhlbWVzXCIsXG4gIFwidGhlbWVSZXNvdXJjZUZvbGRlclwiOiBcIkM6L1VzZXJzL0Jhc2lsR0lCTS9JZGVhUHJvamVjdHMvY29udGFjdGFwcC8uL3NyYy9tYWluL2Zyb250ZW5kL2dlbmVyYXRlZC9qYXItcmVzb3VyY2VzXCIsXG4gIFwic3RhdGljT3V0cHV0XCI6IFwiQzovVXNlcnMvQmFzaWxHSUJNL0lkZWFQcm9qZWN0cy9jb250YWN0YXBwL3RhcmdldC9jbGFzc2VzL01FVEEtSU5GL1ZBQURJTi93ZWJhcHAvVkFBRElOL3N0YXRpY1wiLFxuICBcImdlbmVyYXRlZEZvbGRlclwiOiBcImdlbmVyYXRlZFwiLFxuICBcInN0YXRzT3V0cHV0XCI6IFwiQzpcXFxcVXNlcnNcXFxcQmFzaWxHSUJNXFxcXElkZWFQcm9qZWN0c1xcXFxjb250YWN0YXBwXFxcXHRhcmdldFxcXFxjbGFzc2VzXFxcXE1FVEEtSU5GXFxcXFZBQURJTlxcXFxjb25maWdcIixcbiAgXCJmcm9udGVuZEJ1bmRsZU91dHB1dFwiOiBcIkM6XFxcXFVzZXJzXFxcXEJhc2lsR0lCTVxcXFxJZGVhUHJvamVjdHNcXFxcY29udGFjdGFwcFxcXFx0YXJnZXRcXFxcY2xhc3Nlc1xcXFxNRVRBLUlORlxcXFxWQUFESU5cXFxcd2ViYXBwXCIsXG4gIFwiZGV2QnVuZGxlT3V0cHV0XCI6IFwiQzovVXNlcnMvQmFzaWxHSUJNL0lkZWFQcm9qZWN0cy9jb250YWN0YXBwL3RhcmdldC9kZXYtYnVuZGxlL3dlYmFwcFwiLFxuICBcImRldkJ1bmRsZVN0YXRzT3V0cHV0XCI6IFwiQzovVXNlcnMvQmFzaWxHSUJNL0lkZWFQcm9qZWN0cy9jb250YWN0YXBwL3RhcmdldC9kZXYtYnVuZGxlL2NvbmZpZ1wiLFxuICBcImphclJlc291cmNlc0ZvbGRlclwiOiBcIkM6L1VzZXJzL0Jhc2lsR0lCTS9JZGVhUHJvamVjdHMvY29udGFjdGFwcC8uL3NyYy9tYWluL2Zyb250ZW5kL2dlbmVyYXRlZC9qYXItcmVzb3VyY2VzXCIsXG4gIFwidGhlbWVOYW1lXCI6IFwiXCIsXG4gIFwiY2xpZW50U2VydmljZVdvcmtlclNvdXJjZVwiOiBcIkM6XFxcXFVzZXJzXFxcXEJhc2lsR0lCTVxcXFxJZGVhUHJvamVjdHNcXFxcY29udGFjdGFwcFxcXFx0YXJnZXRcXFxcc3cudHNcIixcbiAgXCJwd2FFbmFibGVkXCI6IGZhbHNlLFxuICBcIm9mZmxpbmVFbmFibGVkXCI6IGZhbHNlLFxuICBcIm9mZmxpbmVQYXRoXCI6IFwiJ29mZmxpbmUuaHRtbCdcIlxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQmFzaWxHSUJNXFxcXElkZWFQcm9qZWN0c1xcXFxjb250YWN0YXBwXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXHJvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQtY3VzdG9tXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCYXNpbEdJQk1cXFxcSWRlYVByb2plY3RzXFxcXGNvbnRhY3RhcHBcXFxcdGFyZ2V0XFxcXHBsdWdpbnNcXFxccm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC1jdXN0b21cXFxccm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQmFzaWxHSUJNL0lkZWFQcm9qZWN0cy9jb250YWN0YXBwL3RhcmdldC9wbHVnaW5zL3JvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQtY3VzdG9tL3JvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQuanNcIjsvKipcbiAqIE1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAxOSBVbWJlcnRvIFBlcGF0b1xuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG4gKi9cbi8vIFRoaXMgaXMgaHR0cHM6Ly9naXRodWIuY29tL3VtYm9wZXBhdG8vcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdCAyLjAuMCArIGh0dHBzOi8vZ2l0aHViLmNvbS91bWJvcGVwYXRvL3JvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQvcHVsbC81NFxuLy8gdG8gbWFrZSBpdCB3b3JrIHdpdGggVml0ZSAzXG4vLyBPbmNlIC8gaWYgaHR0cHM6Ly9naXRodWIuY29tL3VtYm9wZXBhdG8vcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC9wdWxsLzU0IGlzIG1lcmdlZCB0aGlzIHNob3VsZCBiZSByZW1vdmVkIGFuZCByb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0IHNob3VsZCBiZSB1c2VkIGluc3RlYWRcblxuaW1wb3J0IHsgY3JlYXRlRmlsdGVyIH0gZnJvbSAnQHJvbGx1cC9wbHVnaW51dGlscyc7XG5pbXBvcnQgdHJhbnNmb3JtQXN0IGZyb20gJ3RyYW5zZm9ybS1hc3QnO1xuXG5jb25zdCBhc3NldFVybFJFID0gL19fVklURV9BU1NFVF9fKFtcXHckXSspX18oPzpcXCRfKC4qPylfXyk/L2dcblxuY29uc3QgZXNjYXBlID0gKHN0cikgPT5cbiAgc3RyXG4gICAgLnJlcGxhY2UoYXNzZXRVcmxSRSwgJyR7dW5zYWZlQ1NTVGFnKFwiX19WSVRFX0FTU0VUX18kMV9fJDJcIil9JylcbiAgICAucmVwbGFjZSgvYC9nLCAnXFxcXGAnKVxuICAgIC5yZXBsYWNlKC9cXFxcKD8hYCkvZywgJ1xcXFxcXFxcJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBvc3Rjc3NMaXQob3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGluY2x1ZGU6ICcqKi8qLntjc3Msc3NzLHBjc3Msc3R5bCxzdHlsdXMsc2FzcyxzY3NzLGxlc3N9JyxcbiAgICBleGNsdWRlOiBudWxsLFxuICAgIGltcG9ydFBhY2thZ2U6ICdsaXQnXG4gIH07XG5cbiAgY29uc3Qgb3B0cyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcbiAgY29uc3QgZmlsdGVyID0gY3JlYXRlRmlsdGVyKG9wdHMuaW5jbHVkZSwgb3B0cy5leGNsdWRlKTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdwb3N0Y3NzLWxpdCcsXG4gICAgZW5mb3JjZTogJ3Bvc3QnLFxuICAgIHRyYW5zZm9ybShjb2RlLCBpZCkge1xuICAgICAgaWYgKCFmaWx0ZXIoaWQpKSByZXR1cm47XG4gICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlKGNvZGUsIHt9KTtcbiAgICAgIC8vIGV4cG9ydCBkZWZhdWx0IGNvbnN0IGNzcztcbiAgICAgIGxldCBkZWZhdWx0RXhwb3J0TmFtZTtcblxuICAgICAgLy8gZXhwb3J0IGRlZmF1bHQgJy4uLic7XG4gICAgICBsZXQgaXNEZWNsYXJhdGlvbkxpdGVyYWwgPSBmYWxzZTtcbiAgICAgIGNvbnN0IG1hZ2ljU3RyaW5nID0gdHJhbnNmb3JtQXN0KGNvZGUsIHsgYXN0OiBhc3QgfSwgKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbicpIHtcbiAgICAgICAgICBkZWZhdWx0RXhwb3J0TmFtZSA9IG5vZGUuZGVjbGFyYXRpb24ubmFtZTtcblxuICAgICAgICAgIGlzRGVjbGFyYXRpb25MaXRlcmFsID0gbm9kZS5kZWNsYXJhdGlvbi50eXBlID09PSAnTGl0ZXJhbCc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWRlZmF1bHRFeHBvcnROYW1lICYmICFpc0RlY2xhcmF0aW9uTGl0ZXJhbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBtYWdpY1N0cmluZy53YWxrKChub2RlKSA9PiB7XG4gICAgICAgIGlmIChkZWZhdWx0RXhwb3J0TmFtZSAmJiBub2RlLnR5cGUgPT09ICdWYXJpYWJsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgIGNvbnN0IGV4cG9ydGVkVmFyID0gbm9kZS5kZWNsYXJhdGlvbnMuZmluZCgoZCkgPT4gZC5pZC5uYW1lID09PSBkZWZhdWx0RXhwb3J0TmFtZSk7XG4gICAgICAgICAgaWYgKGV4cG9ydGVkVmFyKSB7XG4gICAgICAgICAgICBleHBvcnRlZFZhci5pbml0LmVkaXQudXBkYXRlKGBjc3NUYWdcXGAke2VzY2FwZShleHBvcnRlZFZhci5pbml0LnZhbHVlKX1cXGBgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNEZWNsYXJhdGlvbkxpdGVyYWwgJiYgbm9kZS50eXBlID09PSAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJykge1xuICAgICAgICAgIG5vZGUuZGVjbGFyYXRpb24uZWRpdC51cGRhdGUoYGNzc1RhZ1xcYCR7ZXNjYXBlKG5vZGUuZGVjbGFyYXRpb24udmFsdWUpfVxcYGApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1hZ2ljU3RyaW5nLnByZXBlbmQoYGltcG9ydCB7Y3NzIGFzIGNzc1RhZywgdW5zYWZlQ1NTIGFzIHVuc2FmZUNTU1RhZ30gZnJvbSAnJHtvcHRzLmltcG9ydFBhY2thZ2V9JztcXG5gKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IG1hZ2ljU3RyaW5nLnRvU3RyaW5nKCksXG4gICAgICAgIG1hcDogbWFnaWNTdHJpbmcuZ2VuZXJhdGVNYXAoe1xuICAgICAgICAgIGhpcmVzOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEJhc2lsR0lCTVxcXFxJZGVhUHJvamVjdHNcXFxcY29udGFjdGFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQmFzaWxHSUJNXFxcXElkZWFQcm9qZWN0c1xcXFxjb250YWN0YXBwXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9CYXNpbEdJQk0vSWRlYVByb2plY3RzL2NvbnRhY3RhcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBVc2VyQ29uZmlnRm4gfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IG92ZXJyaWRlVmFhZGluQ29uZmlnIH0gZnJvbSAnLi92aXRlLmdlbmVyYXRlZCc7XG5cbmNvbnN0IGN1c3RvbUNvbmZpZzogVXNlckNvbmZpZ0ZuID0gKGVudikgPT4gKHtcbiAgLy8gSGVyZSB5b3UgY2FuIGFkZCBjdXN0b20gVml0ZSBwYXJhbWV0ZXJzXG4gIC8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgb3ZlcnJpZGVWYWFkaW5Db25maWcoY3VzdG9tQ29uZmlnKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFNQSxPQUFPLFVBQVU7QUFDakIsU0FBUyxjQUFBQSxhQUFZLGFBQUFDLFlBQVcsZUFBQUMsY0FBYSxnQkFBQUMsZUFBYyxpQkFBQUMsc0JBQTRCO0FBQ3ZGLFNBQVMsa0JBQWtCO0FBQzNCLFlBQVksU0FBUzs7O0FDV3JCLFNBQVMsY0FBQUMsYUFBWSxnQkFBQUMscUJBQW9CO0FBQ3pDLFNBQVMsV0FBQUMsZ0JBQWU7OztBQ0R4QixTQUFTLFlBQUFDLGlCQUFnQjtBQUN6QixTQUFTLFdBQUFDLFVBQVMsWUFBQUMsaUJBQWdCO0FBQ2xDLFNBQVMsY0FBQUMsYUFBWSxjQUFjLHFCQUFxQjs7O0FDRnhELFNBQVMsYUFBYSxVQUFVLFdBQVcsWUFBWSxvQkFBb0I7QUFDM0UsU0FBUyxTQUFTLFVBQVUsVUFBVSxlQUFlO0FBQ3JELFNBQVMsZ0JBQWdCO0FB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QUs7QUFBQSxnQkFDTCxPQUFPLEVBQUUsTUFBTSxVQUFVLEtBQUssOEJBQThCLFNBQVMsNkJBQTZCO0FBQUEsZ0JBQ2xHLFVBQVU7QUFBQSxjQUNaLENBQUM7QUFBQSxZQUNIO0FBQ0Esb0JBQVEsS0FBSztBQUFBLGNBQ1gsS0FBSztBQUFBLGNBQ0wsT0FBTyxFQUFFLE1BQU0sVUFBVSxLQUFLLHVCQUF1QjtBQUFBLGNBQ3JELFVBQVU7QUFBQSxZQUNaLENBQUM7QUFDRCxtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sWUFBWTtBQUFBLE1BQ2QsQ0FBQztBQUFBLE1BQ0Qsa0JBQWtCLFdBQVcsRUFBRSxZQUFZLE1BQU0sVUFBVSxlQUFlLENBQUM7QUFBQSxJQUU3RTtBQUFBLEVBQ0Y7QUFDRjtBQUVPLElBQU0sdUJBQXVCLENBQUNDLGtCQUErQjtBQUNsRSxTQUFPLGFBQWEsQ0FBQyxRQUFRLFlBQVksYUFBYSxHQUFHLEdBQUdBLGNBQWEsR0FBRyxDQUFDLENBQUM7QUFDaEY7QUFDQSxTQUFTLFdBQVcsUUFBd0I7QUFDMUMsUUFBTSxjQUFjLEtBQUssUUFBUSxtQkFBbUIsUUFBUSxjQUFjO0FBQzFFLFNBQU8sS0FBSyxNQUFNUixjQUFhLGFBQWEsRUFBRSxVQUFVLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEU7QUFDQSxTQUFTLFlBQVksUUFBd0I7QUFDM0MsUUFBTSxjQUFjLEtBQUssUUFBUSxtQkFBbUIsUUFBUSxjQUFjO0FBQzFFLFNBQU8sS0FBSyxNQUFNQSxjQUFhLGFBQWEsRUFBRSxVQUFVLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEU7OztBUXAyQkEsSUFBTSxlQUE2QixDQUFDLFNBQVM7QUFBQTtBQUFBO0FBRzdDO0FBRUEsSUFBTyxzQkFBUSxxQkFBcUIsWUFBWTsiLAogICJuYW1lcyI6IFsiZXhpc3RzU3luYyIsICJta2RpclN5bmMiLCAicmVhZGRpclN5bmMiLCAicmVhZEZpbGVTeW5jIiwgIndyaXRlRmlsZVN5bmMiLCAiZXhpc3RzU3luYyIsICJyZWFkRmlsZVN5bmMiLCAicmVzb2x2ZSIsICJnbG9iU3luYyIsICJyZXNvbHZlIiwgImJhc2VuYW1lIiwgImV4aXN0c1N5bmMiLCAidGhlbWVGb2xkZXIiLCAidGhlbWVGb2xkZXIiLCAicmVzb2x2ZSIsICJnbG9iU3luYyIsICJleGlzdHNTeW5jIiwgImJhc2VuYW1lIiwgInZhcmlhYmxlIiwgImZpbGVuYW1lIiwgImV4aXN0c1N5bmMiLCAicmVzb2x2ZSIsICJ0aGVtZUZvbGRlciIsICJyZWFkRmlsZVN5bmMiLCAiZXhpc3RzU3luYyIsICJyZWFkRmlsZVN5bmMiLCAicmVzb2x2ZSIsICJiYXNlbmFtZSIsICJnbG9iU3luYyIsICJ0aGVtZUZvbGRlciIsICJnZXRUaGVtZVByb3BlcnRpZXMiLCAiZ2xvYlN5bmMiLCAicmVzb2x2ZSIsICJleGlzdHNTeW5jIiwgInJlYWRGaWxlU3luYyIsICJyZXBsYWNlIiwgImJhc2VuYW1lIiwgInBhdGgiLCAicmVxdWlyZSIsICJleGlzdHNTeW5jIiwgInJlYWRGaWxlU3luYyIsICJta2RpclN5bmMiLCAiYnVuZGxlIiwgInJlYWRkaXJTeW5jIiwgInRoZW1lRm9sZGVyIiwgIndyaXRlRmlsZVN5bmMiLCAiZSIsICJwYXRoIiwgImN1c3RvbUNvbmZpZyJdCn0K
