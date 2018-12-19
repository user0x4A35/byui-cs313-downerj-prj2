const TBL_CHIP = 'mm_chips';
const TBL_LINK = 'mm_chip_code_links';

module.exports = {
    chipsGet: `SELECT `
        + `  chip.id `
        + `, chip.name `
        + `, chip.damage `
        + `, chip.memory `
        + `, chip.description `
        + `, chip.filename `
        + `, chip.rarity `
        + `, chip.element `
        + `, chip.chiptype `
        + `, array_agg(link.code) AS codes `
        + `FROM ${TBL_CHIP} AS chip `
        + `INNER JOIN ${TBL_LINK} AS link `
        + `ON link.chip = chip.id `
        + `GROUP BY chip.id `
        + `ORDER BY chip.id;`,

    chipsPost: `INSERT INTO ${TBL_CHIP} `
        + `(id, name, damage, memory, description, filename, rarity, element, chiptype) `
        + `VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,

    chipLinksPost: `INSERT INTO ${TBL_LINK} `
        + `(chip, code) `
        + `VALUES ($1, $2);`,

    chipPut: `UPDATE ${TBL_CHIP} `
        + `SET $0 = $1 `
        + `WHERE id = $2;`,

    chipLinkPut: ``,
    chipsDelete: ``,

    navicustGet: ``,
    navicustPost: ``,
    navicustPut: ``,
    navicustDelete: ``,
};