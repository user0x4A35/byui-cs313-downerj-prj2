const { Pool, Client } = require('pg');

module.exports = {
    doGet: (req, res) => {
        
    },

    doPost: (req, res) => {
        if (!('chips' in req.body)) {
            sendError('Missing "chips" argument in body');
            return;
        }

        let chips;
        try {
            chips = JSON.parse(req.body.chips);
        } catch (err) {
            console.error(err);
            sendError('Malformed "chips" JSON');
            return;
        }

        if ('elements' in chips) {
            let elems = chips.elements;
            for (let elem of elems) {
               // TODO
            }
        }

        for (let key in chips) {
            if (key === 'standard' || key === 'mega' || key === 'giga') {
                addChips(key, chips[key]);
            }
        }
    },

    doPut: (req, res) => {

    },
};

function sendError(res, msg) {
    res
    .status(400)
    .end(msg);
};

function addChips(sectionName, chipList) {
    for (let id in chipList) {
        let chip = chipList[id];
        let id = parseInt(id);
        let damage = parseInt(chip.damage);
        let description = chip.description;
        let element = chip.element;
        let memory = parseInt(chip.memory);
        let name = chip.name;
    }
}

function dbInsertChip(chipData) {

}