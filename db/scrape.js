const https = require('https');
const fs = require('fs');

const { JSDOM } = require('jsdom');

const URL = 'https://megaman.fandom.com/wiki/List_of_Mega_Man_Battle_Network_3_Battle_Chips';

https.get(URL, scrape);

function addChipFromRow(row, chipList, chipType) {
    let id = Number(row.cells.item(0).innerHTML);
    let url = row.cells.item(1).children.item(0).href.trim();
    let name = row.cells.item(2).innerHTML.trim();
    let damage = Number(row.cells.item(3).innerHTML) || null;
    let codes = row.cells.item(4).innerHTML.trim().split(', ');
    let memory = Number(row.cells.item(5).innerHTML.trim().split(' ')[0]);
    let description = row.cells.item(6).innerHTML.trim();

    switch (chipType) {
        case 'mega':
            id += 300;
            break;
        case 'giga':
            id += 400;
            break;
    }
    
    chipList.chips[chipType][id] = {
        id: id,
        url: url,
        name: name,
        damage: damage,
        codes: codes,
        memory: memory,
        description: description,
        element: null,
        rarity: 0
    };
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
                standard: {},
            },
        };

        let chipListMega = {
            chips: {
                mega: {},
            },
        };

        let chipListGiga = {
            chips: {
                giga: {},
            },
        };

        let tables = dom.window.document.getElementsByTagName('table');
        let rows;

        // PASS 1: Standard Chips
        let tblStandardChips = tables[0];
        rows = tblStandardChips.tBodies[0].rows;
        for (let r = 1; r < rows.length; r++) {
            addChipFromRow(rows[r], chipListStandard, 'standard');
        }

        // PASS 2: Mega Chips
        let tblMegaChips = tables[1];
        rows = tblMegaChips.tBodies[0].rows;
        for (let r = 1; r < rows.length; r++) {
            addChipFromRow(rows[r], chipListMega, 'mega');
        }

        // PASS 3: Giga Chips
        let tblGigaChips = tables[2];
        rows = tblGigaChips.tBodies[0].rows;
        for (let r = 1; r < 23; r++) {
            if (r === 17) {
                continue;
            }
            addChipFromRow(rows[r], chipListGiga, 'giga');
        }

        fs.writeFile('./json/chipsStandard.json', JSON.stringify(chipListStandard), (err) => {
            if (err) {
                return console.error(err);
            }
        });

        fs.writeFile('./json/chipsMega.json', JSON.stringify(chipListMega), (err) => {
            if (err) {
                return console.error(err);
            }
        });

        fs.writeFile('./json/chipsGiga.json', JSON.stringify(chipListGiga), (err) => {
            if (err) {
                return console.error(err);
            }
        });
    });
}