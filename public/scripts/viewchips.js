$(document).ready(() => {
    let $tblChipList = $('#tbl-chip-list');

    $.get({
        url: '/chiplist',
        dataType: 'json',
        success: (data, textStatus, jqXHR) => {

        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(errorThrown);
        },
    });
});