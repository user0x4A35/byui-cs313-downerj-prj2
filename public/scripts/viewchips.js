$(document).ready(() => {
    $.get({
        url: '/chiplist',
        dataType: 'json',
        success: (data, textStatus, jqXHR) => {
            let tbody = $('#tbl-chip-list > tbody:last-child')[0];

            for (let dataRow in data) {
                let tableRow = tbody.insertRow();
                for (let key in dataRow) {
                    let value = dataRow[key];
                    let cell = tableRow.insertCell();
                    cell.innerText = value;
                } 
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(errorThrown);
        },
    });
});