/*
Popup.js
This file is run when the popup.html file is rendered.
ie. When the user clicks on the extension icon.
*/
// Saves options to chrome.storage
function save_options() {
  var doTranslate = document.getElementById('translateCheck').checked;
  chrome.storage.sync.set({
    doTranslate: doTranslate
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    doTranslate: true
  }, function(){});
}

$(document).ready(function(){
  restore_options();
});
document.getElementById('save').addEventListener('click',
    save_options);
