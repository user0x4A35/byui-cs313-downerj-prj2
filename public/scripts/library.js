let dataRows = {};

$(document).ready(() => {
    $.get({
        url: '/library/chiplist',
        dataType: 'json',
        success: (data, textStatus, jqXHR) => {
            let tbody = $('#tbl-chip-list > tbody:last-child')[0];
            let dataRows = data.rows;

            for (let key in dataRows) {
                let dataRow = dataRows[key];
                let tableRow = tbody.insertRow();

                let imgCell = tableRow.insertCell();
                let img = constructElement('IMG', {
                    src: `./assets/images/chips/${dataRow.filename}`,
                    alt: 'N/A',
                    title: dataRow.name,
                });
                img.style.width = '64px';
                img.style.height = '56px';
                imgCell.appendChild(img);

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
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(errorThrown);
        },
    });
});