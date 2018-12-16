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
                    let value;

                    switch (key) {
                        case 'filename':
                            continue;
                        case 'codes':
                            let codes = dataRow[key];
                            value = codes
                                .replace(/[\{\}]*/g, '')
                                .split(/\,\s*/)
                                .sort()
                                .join(' ');
                            break;
                        case 'id':
                            let id = dataRow[key];
                            if (id >= 300 && id < 400) {
                                value = `M&mdash;${id - 300}`;
                            } else if (id >= 400) {
                                value = `G&mdash;${id - 400}`;
                            } else {
                                value = `S&mdash;${id}`;
                            }
                            break;
                        case 'rarity':
                            value = parseInt(dataRow[key]);
                            break;
                        default:
                            value = dataRow[key];
                    }

                    let cell = tableRow.insertCell();
                    cell.innerHTML = (value) ? value : '&mdash;';
                } 
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(errorThrown);
        },
    });
});