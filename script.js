/*
 * Website Blocker - Chrome Extension
 * 05-03-2020
 * Aniket Kudale
 */

let urls = []; // Global variable to store URLs

// Load init when the content is loaded.
window.addEventListener('DOMContentLoaded', init);
window.addEventListener('DOMContentLoaded', loadList);


//Init Function - Initialize, load, addEventListeners
function init() {
    const addButton = document.getElementById('add');
    const deleteButton = document.getElementsByClassName('delete');
    const noWebsiteMsg = document.getElementById('no-website-msg');
    chrome.storage.local.getBytesInUse(['websites'], function (bytes) {
        if (bytes) {
            chrome.storage.local.get("websites", function (res) {
                if (res != {}) {
                    urls = JSON.parse(res.websites);
                    if (urls == undefined || urls.length == 0) {
                        noWebsiteMsg.style.display = "";
                    } else {
                        noWebsiteMsg.style.display = "none";
                    }
                    if (deleteButton) {
                        for (let i = 0; i < deleteButton.length; i++) {
                            deleteButton[i].addEventListener('click', function (e) {
                                deleteWebsite(e);
                            });
                        }
                    }
                }
            });

        } else {
            urls = [];
        }
    });
    addButton.addEventListener('click', function () {
        const url = document.getElementsByClassName('add-website')[0].value;
        if (url.length > 0) {
            noWebsiteMsg.style.display = "none";
            urls.push(url + "/*");
            chrome.storage.local.set({
                "websites": JSON.stringify(urls)
            }, function (value) {
                console.log(value);
            });
            save();
            loadList();
            document.getElementsByClassName('add-website')[0].value = "";
        }
    });
}

function loadList() {
    const deleteButton = document.getElementsByClassName('delete');
    const tblNode = document.getElementsByTagName('body')[0];
    let tblRow = document.createElement('tr');
    let tblData = document.createElement('td');
    let tblButton = document.createElement('button');
    let storedURLs = [];
    chrome.storage.local.getBytesInUse(['websites'], function (bytes) {
        if (bytes) {
            chrome.storage.local.get("websites", function (res) {
                if (res != {}) {
                    storedURLs = JSON.parse(res.websites);

                    if (storedURLs != undefined || storedURLs != []) {
                        for (let i = 0; i < storedURLs.length; i++) {
                            tblButton.innerText = "-";
                            tblButton.setAttribute('class', 'delete');
                            tblRow.setAttribute('id', "row" + i);
                            tblButton.setAttribute('id', i);
                            tblData.innerText = storedURLs[i];
                            tblRow.appendChild(tblData);
                            tblRow.appendChild(tblButton);
                            document.getElementsByTagName('table')[0].appendChild(tblRow);
                            if (deleteButton) {

                                deleteButton[i].addEventListener('click', function (e) {
                                    deleteWebsite(e);
                                });

                            }
                        }
                    }

                }
            });

        } else {
            storedURLs = [];
        }
    });

}

function deleteWebsite(e) {
    urls.splice(e.target.id, 1);
    chrome.storage.local.set({
        "websites": JSON.stringify(urls)
    }, function () {});
    if (document.getElementById("row" + e.target.id))
        document.getElementById("row" + e.target.id).remove();
    save();
    init();
}

function save() {
    chrome.extension.sendRequest({
        urls: "save"
    }, function (response) {

    });
}