
class AppendElement {
    constructor() {
        this.parent = document.getElementById('container');
    }

    _span(text) {
        const span       = document.createElement('span');
        span.textContent = text;
        span.className   = AppendElement.spanClassname;
        this.parent.appendChild(span);
    }

    message(message) {
        this._span(message);
    }

    slash() {
        this._span(' / ');
    }

    anchor(href, text) {
        const a       = document.createElement('a');
        a.href        = href;
        a.textContent = text;
        a.className   = AppendElement.anchorClassname;
        this.parent.appendChild(a);
    }
}
AppendElement.anchorClassname = 'anchor';
AppendElement.spanClassname   = 'span';

const queryInfo = {
    active : true,
    currentWindow : true
};

const getTab = callback =>
    chrome.tabs.query(queryInfo, tabs => callback(tabs[0]));

const checkbox = document.getElementsByClassName('checkbox')[0];

const onClicked = e => {
    e.preventDefault();
    const element = e.target;
    if (element.className.lastIndexOf(AppendElement.anchorClassname) == -1) {
        return;
    }

    let callback = null;
    if (checkbox.checked) {
        callback = window.close;
    }

    getTab(tab => {
        const ctrlkey  = e.ctrlKey;
        const shiftkey = e.shiftKey;
        let props      = {url : element.href};
        if (ctrlkey) {
            props.index  = tab.index + 1;
            props.active = shiftkey;
            chrome.tabs.create(props, callback);
        } else if (shiftkey) {
            chrome.windows.create(props, callback);
        } else {
            chrome.tabs.update(tab.id, props, callback);
        }
    });
};

const openPopup = tab => {
    checkbox.checked =
        (localStorage.getItem('checked') == 'true') ? true : false;

    const rawurl = tab.url;
    const append = new AppendElement();
    if (!(rawurl.startsWith('https://') || rawurl.startsWith('http://'))) {
        append.message('(not supported) - ');
        append.anchor(rawurl, rawurl);
        return;
    }

    const url    = new URL(rawurl);
    const path   = url.pathname.split('/');
    const prefix = url.origin;
    append.anchor(prefix + '/', url.hostname);
    append.slash();

    const l = path.length - 1;
    for (let i = 0; i <= l; i++) {
        const text = path[i];
        if (text == '') continue;
        const href =
            prefix + path.slice(0, i + 1).join('/') + ((i < l) ? '/' : '');

        append.anchor(href, text);
        if (i < l) append.slash();
    }
    container.addEventListener('click', onClicked);
    document.getElementsByClassName(AppendElement.anchorClassname)[0].focus();
};

getTab(openPopup);

const onChange = e => {
    localStorage.setItem('checked', checkbox.checked ? 'true' : 'false');
};

checkbox.addEventListener('change', onChange);