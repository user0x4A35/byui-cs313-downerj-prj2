function byId(id) {
    return document.getElementById(id);
}

function byClassName(className) {
    return document.getElementsByClassName(className);
}

function byName(name) {
    return document.getElementsByName(name);
}

function byTagName(tagName) {
    return document.getElementsByTagName(tagName);
}

function constructElement(tagName, props) {
    if (!tagName) {
        throw 'constructElement() -> Undefined tag name';
    }

    let elem = document.createElement(tagName);

    if (!props) {
        return elem;
    }

    for (let key in props) {
        elem[key] = props[key];
    }

    return elem;
}