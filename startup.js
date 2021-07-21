let settings = require('./fesettings.json');
const { readDirectory } = require("./files");

function startup() { //does a check of the settings JSON and other start up things
    readDirectory(settings.parentDirectoryPath).then(contents => {
        if (!contents) {
            console.log("Settings.json \"parentDirectoryPath\" invalid!");
        }
    });
    if ((settings.search.useIFT == true) && (settings.search.useSFT == true)) {
        console.log("Settings.json \"useIFT\" and \"useSFT\" warning!\nIf \"useSFT\" is set to true, useIFT is overridden!");
    }
}

module.exports.startup = startup;