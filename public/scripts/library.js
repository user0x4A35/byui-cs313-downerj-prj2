const thead = $('#tbl-chip-list > thead')[0];
const tbody = $('#tbl-chip-list > tbody:last-child')[0];
const $frmFilters = $('#frm-filters');
const frmFilters = $frmFilters[0];

const theadToKeyMap = {
    'ID': 'id',
    'Name': 'name',
    'Dmg': 'damage',
    'Mem': 'memory',
    'Rarity': 'rarity',
    'Elem': 'element',
    'Type': 'chiptype',
};

let dataRows = [];
let dataTemp = [];
let sortingKey = 'id';
let imageElems = {};
let filtersVisible = false;

$(document).ready(() => {
    $.get({
        url: '/library/chiplist',
        dataType: 'json',
        success: (data, textStatus, jqXHR) => {
            dataRows = Object.keys(data.rows).map((key) => {
                return data.rows[key];
            });

            getImages(dataRows);
            frmFilters.reset();
            resetTableFilter();
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(errorThrown);
        },
    });

    toggleFilterContainer(false);

    // prevent submit-on-enter
    $frmFilters.submit(() => {
        return false;
    });
});

function clearTable() {
    while (tbody.rows.length > 0) {
        tbody.rows[0].remove();
    }
}

function getImages(dataRows) {
    for (let dataRow of dataRows) {
        let img = constructElement('IMG', {
            src: `./assets/images/chips/${dataRow.filename}`,
            alt: '—',
            title: dataRow.name,
        });
        img.style.width = '64px';
        img.style.height = '56px';
        imageElems[dataRow.id] = img;
    }
}

function populateTable(tempDataRows) {
    for (let dataRow of tempDataRows) {
        let tableRow = tbody.insertRow();

        let imgCell = tableRow.insertCell();
        imgCell.appendChild(imageElems[dataRow.id]);

        for (let key in dataRow) {
            let value = dataRow[key];

            switch (key) {
                case 'filename':
                    continue;
                case 'codes':
                    value = value
                        .replace(/[\{\}]*/g, '')
                        .split(/\,\s*/)
                        .sort()
                        .join('');
                    dataRow[key] = value;
                    break;
                case 'id':
                    if (value >= 300 && value < 400) {
                        value = `M&mdash;${value - 300}`;
                    } else if (value >= 400) {
                        value = `G&mdash;${value - 400}`;
                    } else {
                        value = `S&mdash;${value}`;
                    }
                    break;
                case 'rarity':
                    value = parseInt(value);
                    break;
                case 'chiptype':
                    if (value === 'STANDARD') {
                        value = 'STND';
                    }
                    break;
            }

            let cell = tableRow.insertCell();
            if (key === 'codes') {
                cell.style.fontFamily = 'monospace';
            }
            cell.innerHTML = (value) ? value : '&mdash;';
        } 
    }
}

function sortTableBy(key) {
    function comparator(lhs, rhs) {
        if (lhs[key] > rhs[key]) {
            return +1;
        } else if (lhs[key] < rhs[key]) {
            return -1;
        } else {
            if (lhs.id > rhs.id) {
                return +1;
            } else if (lhs.id < rhs.id) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    dataTemp.sort(comparator);

    sortingKey = key;
    let theadRow = thead.rows[0];
    for (let cell of theadRow.cells) {
        if (theadToKeyMap[cell.innerHTML] === key) {
            cell.classList.add('u-th-selected');
        } else {
            cell.classList.remove('u-th-selected');
        }
    }
    clearTable();
    populateTable(dataTemp);
}

function filterTableByConditionals(conditionals) {
    function filterFunc(row) {
        for (let conditional of conditionals) {
            if (!conditional(row)) {
                return false;
            }
        }
        return true;
    }

    dataTemp = dataRows.filter(filterFunc);
    clearTable();
    sortTableBy('id');
}

function resetTableFilter() {
    dataTemp = dataRows;
    clearTable();
    sortTableBy(sortingKey);
}

function toggleFilterContainer(overrideValue) {
    if (overrideValue !== null && overrideValue !== undefined) {
        filtersVisible = !!overrideValue;
    } else {
        filtersVisible = !filtersVisible;
    }

    if (filtersVisible) {
        $frmFilters.css('display', '');
    } else {
        $frmFilters.css('display', 'none');
    }
}

function generateStringRegexComparator(key, regex) {
    return (dataRow) => {
        let value = dataRow[key];
        return value.toString().search(regex) >= 0;
    };
}

function generateNumberBoundsComparator(key, minim, maxim) {
    return (dataRow) => {
        let value = dataRow[key];
        minim = minim || 0;
        maxim = maxim || 1000;
        if (isSet(minim) && isSet(maxim)) {
            return Number(value) >= minim && Number(value) <= maxim;
        } else if (isSet(minim)) {
            return Number(value) >= minim;
        } else if (isSet(maxim)) {
            return Number(value) <= maxim;
        } else {
            return true;
        }
    };
}

function generateStringEqualityComparator(key, rhs, falseValue) {
    return (dataRow) => {
        let value = dataRow[key];
        if (rhs === falseValue) {
            return !value;
        } else {
            return value === rhs;
        }
    };
}

function generateStringByCharsZipComparator(key, rhs, regex) {
    return (dataRow) => {
        let values = dataRow[key].split('');
        rhs = rhs.toString().split(regex);
        for (let value of values) {
            if (rhs.indexOf(value) >= 0) {
                return true;
            }
        }
        return false;
    };
}

function applyFilters() {
    let data = new FormData(frmFilters);
    let nameRegex = data.get('name-regex').trim();
    let damageFrom = data.get('damage-from').trim();
    let damageTo = data.get('damage-to').trim();
    let memoryFrom = data.get('memory-from').trim();
    let memoryTo = data.get('memory-to').trim();
    let rarity = data.get('rarity');
    let element = data.get('element');
    let chipType = data.get('chiptype');
    let codes = data.get('codes').trim();
    let filters = [];

    if (nameRegex) {
        filters.push(generateStringRegexComparator('name', nameRegex));
    }
    if (damageFrom || damageTo) {
        filters.push(generateNumberBoundsComparator('damage', damageFrom, damageTo));
    }
    if (memoryFrom || memoryTo) {
        filters.push(generateNumberBoundsComparator('memory', memoryFrom, memoryTo));
    }
    if (rarity && rarity !== '*') {
        filters.push(generateStringEqualityComparator('rarity', rarity, 0));
    }
    if (element && element !== '*') {
        filters.push(generateStringEqualityComparator('element', element, 'none'));
    }
    if (chipType && chipType !== '*') {
        filters.push((dataRow) => {
            let value = dataRow.chiptype;
            return value === chipType;
        });
    }
    if (codes) {
        filters.push(generateStringByCharsZipComparator('codes', codes, /[\s,]*/));
    }

    filterTableByConditionals(filters);
}
