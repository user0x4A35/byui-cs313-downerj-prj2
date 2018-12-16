const https = require('https');
const fs = require('fs');

const { JSDOM } = require('jsdom');

const URL = 'https://megaman.fandom.com/wiki/List_of_Mega_Man_Battle_Network_3_Battle_Chips';

https.get(URL, scrape);

function addChipFromRow(row, chipList, chipType) {
    let id = Number(row.cells.item(0).innerHTML);
    let tempURL = row.cells.item(1).children.item(0).href.trim();
    url = tempURL.match(/[\w\-\_]+\.((png)|(gif)|(jp(e){0,1}g))/)[0];
    // url = url.replace('.png', '.gif');
    let name = row.cells.item(2);
    if ('children' in name) {
        let child = name.children.item(0);
        if (child) {
            name = child.innerHTML.trim();
        } else {
            name = name.innerHTML.trim();
        }
    } else {
        name = name.innerHTML.trim();
    }
    let damage = Number(row.cells.item(3).innerHTML) || null;
    let codes = row.cells.item(4).innerHTML.trim().split(', ');
    let memory = Number(row.cells.item(5).innerHTML.trim().split(' ')[0]);
    let description = row.cells.item(6).innerHTML.trim();

    switch (chipType) {
        case 'MEGA':
            id += 300;
            break;
        case 'GIGA':
            id += 400;
            break;
    }
    
    chipList.chips[chipType][id] = {
        id: id,
        url: url,
        tempURL: tempURL,
        name: name,
        damage: damage,
        codes: codes,
        memory: memory,
        description: description,
        element: null,
        rarity: 0
    };
}

function retrieveImage(res, fileName) {
    data = '';

    res.on('data', (chunk) => {
        data = chunk;
    });

    res.on('end', () => {
        fs.writeFile(`../public/assets/images/chips/${fileName}`, data, (err) => {
            if (err) {
                return console.error(err);
            }
        });
    });
}

function scrape(res) {
    res.setEncoding('utf8');
    data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        const dom = new JSDOM(data, {
            contentType: 'text/html',
        });
        let chipListStandard = {
            chips: {
                STANDARD: {},
            },
        };

        let chipListMega = {
            chips: {
                MEGA: {},
            },
        };

        let chipListGiga = {
            chips: {
                GIGA: {},
            },
        };

        let tables = dom.window.document.getElementsByTagName('table');
        let rows;

        // PASS 1.1: Standard Chips
        let tblStandardChips = tables[0];
        rows = tblStandardChips.tBodies[0].rows;
        for (let r = 1; r < rows.length; r++) {
            addChipFromRow(rows[r], chipListStandard, 'STANDARD');
        }

        // PASS 1.2: Mega Chips
        let tblMegaChips = tables[1];
        rows = tblMegaChips.tBodies[0].rows;
        for (let r = 1; r < rows.length; r++) {
            addChipFromRow(rows[r], chipListMega, 'MEGA');
        }

        // PASS 1.3: Giga Chips
        let tblGigaChips = tables[2];
        rows = tblGigaChips.tBodies[0].rows;
        for (let r = 1; r < 23; r++) {
            if (r === 17) {
                continue;
            }
            addChipFromRow(rows[r], chipListGiga, 'GIGA');
        }

        let chipList;

        // PASS 2.1: Standard Chip Images
        chips = chipListStandard.chips.STANDARD;
        for (let chipID in chips) {
            let chip = chips[chipID];
            let fileName = chip.url;
            let tempURL = chip.tempURL;

            https.get(tempURL, (res) => {
                retrieveImage(res, fileName);
            }).on('error', (err) => {
                console.error(err);
            });;
        }
        
        // PASS 2.2: Mega Chip Images
        chips = chipListMega.chips.MEGA;
        for (let chipID in chips) {
            let chip = chips[chipID];
            let fileName = chip.url;
            let tempURL = chip.tempURL;

            https.get(tempURL, (res) => {
                retrieveImage(res, fileName);
            }).on('error', (err) => {
                console.error(err);
            });;
        }

        // PASS 2.3: Giga Chip Images
        chips = chipListGiga.chips.GIGA;
        for (let chipID in chips) {
            let chip = chips[chipID];
            let fileName = chip.url;
            let tempURL = chip.tempURL;

            https.get(tempURL, (res) => {
                retrieveImage(res, fileName);
            }).on('error', (err) => {
                console.error(err);
            });
        }

        // fs.writeFile('./json/chipsStandard.json', JSON.stringify(chipListStandard), (err) => {
        //     if (err) {
        //         return console.error(err);
        //     }
        // });

        // fs.writeFile('./json/chipsMega.json', JSON.stringify(chipListMega), (err) => {
        //     if (err) {
        //         return console.error(err);
        //     }
        // });

        // fs.writeFile('./json/chipsGiga.json', JSON.stringify(chipListGiga), (err) => {
        //     if (err) {
        //         return console.error(err);
        //     }
        // });
    });
}