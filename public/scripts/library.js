let dataRows = [];
let dataTemp = [];
let thead = $('#tbl-chip-list > thead')[0];
let tbody = $('#tbl-chip-list > tbody:last-child')[0];
const theadToKeyMap = {
    'ID': 'id',
    'Name': 'name',
    'Dmg': 'damage',
    'Mem': 'memory',
    'Rarity': 'rarity',
    'Elem': 'element',
    'Type': 'chiptype',
};
let sortingKey = 'id';
let imageElems = {};
let $divFilters = $('#div-filters');
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
            resetTableFilter();
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(errorThrown);
        },
    });

    toggleFilterContainer(false);

    $()
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
    sortingKey = key;
}

function filterTableBy(key, conditional) {
    function filterFunc(row) {
        return conditional(row[key]);
    }

    dataTemp = dataTemp.filter(filterFunc);
    clearTable();
    populateTable(dataTemp);
}

function resetTableFilter() {
    dataTemp = dataRows;
    clearTable();
    sortTableBy(sortingKey);
}

function filterTableByStringContaining(key, regex) {
    filterTableBy(key, (value) => {
        return value.toString().search(regex) >= 0;
    });
}

function filterTableByNumberEqualTo(key, target) {
    filterTableBy(key, (value) => {
        return Number(value) === target;
    });
}

function filterTableByNumberNotEqualTo(key, target) {
    filterTableBy(key, (value) => {
        return Number(value) !== target;
    });
}

function filterTableByNumberGreaterThanOrEqualTo(key, minim) {
    filterTableBy(key, (value) => {
        return Number(value) >= minim;
    });
}

function filterTableByNumberLessThanOrEqualTo(key, maxim) {
    filterTableBy(key, (value) => {
        return Number(value) <= maxim;
    });
}

function toggleFilterContainer(overrideValue) {
    if (overrideValue !== null && overrideValue !== undefined) {
        filtersVisible = !!overrideValue;
    } else {
        filtersVisible = !filtersVisible;
    }

    if (filtersVisible) {
        $divFilters.css('display', '');
    } else {
        $divFilters.css('display', 'none');
    }
}