$(document).ready(() => {
    $.get({
        url: '/library/chiplist',
        dataType: 'json',
        success: (data, textStatus, jqXHR) => {
            let tbody = $('#tbl-chip-list > tbody:last-child')[0];

            for (let key in data.rows) {
                let dataRow = data.rows[key];
                let tableRow = tbody.insertRow();

                let imgCell = tableRow.insertCell();
                let img = constructElement('IMG', {
                    href: `/assets/images/chips/${dataRow.url}`,
                    alt: dataRow.name,
                });
                img.style.width = '100px';
                img.style.height = '100px';
                imgCell.appendChild(img);

                for (let key in dataRow) {
                    let value = dataRow[key];
                    let cell = tableRow.insertCell();
                    cell.innerText = (value !== null && value !== undefined) ? value : 'Null';
                } 
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(errorThrown);
        },
    });
});