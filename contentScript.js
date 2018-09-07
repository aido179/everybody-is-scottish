var doTranslate = true;//if sync.get fails, we translate by default.

chrome.storage.sync.get({
  doTranslate: true
}, function(items) {
  doTranslate = items.doTranslate;
});

//deal with newly loaded tweets
function DOMModificationHandler(){
    $(this).unbind('DOMSubtreeModified.event1');
    setTimeout(function(){
        modify();
        $('#timeline').bind('DOMSubtreeModified.event1',DOMModificationHandler);
    },10);
}
$('#timeline').bind('DOMSubtreeModified.event1',DOMModificationHandler);

function modify(){
  //early return if user has turned off the extension through the popup.
  if (!doTranslate) return
  //modify tweets
  $('.tweet-text').each(function(index){
    // Don't double translate tweets.
    if(!$(this).hasClass("scottished") /*&& index === 0*/){
      var text = $(this).text();
      var t = $(this).html();
      var textArray = text.split(" ")
      // We could just to a string.replace for each word in the dictionary,
      // but while the dictionary may grow, tweets will always have a realtively
      // small number of words. So it'll be more efficient to look up each word
      // in the tweet.
      var changes = 0
      textArray.forEach((word, index)=> {
        // handle punctuation at the end (fullstops, commas etc.)
        searchTerm = word.replace(/[^a-z]$/gi, '').toLowerCase()
        if (dictionary[searchTerm] !== undefined){
          changes+=1
          // use string.replace here to keep existing punctuation
          textArray[index] = textArray[index].replace(searchTerm, dictionary[searchTerm])
        }
      })
      $(this).addClass("scottished"); // don't check this tweet again
      if(changes>0){ // only update tweets with translatable text
        // scottish flag emoji - currently not used...because it can't get it to
        // display correctly on twitter.
        var flag = String.fromCodePoint(0x1F3F4, 0xE0067, 0xE0062, 0xE0073, 0xE0063, 0xE0074, 0xE007f)
        //$(this).text(textArray.join(" ")+"\n<translated to Scottish People Twitter>")
        $(this).html(textArray.join(" ")+`<br><a class="untranslate-button js-nav show-thread-link" data-original-content="${encodeURI(t)}">Unscottish</button>`);
        //if we add a new button, we have to add listeners again...
        chrome.runtime.sendMessage({message: "listeners"}, function(response) {
      });
      }
    }
  });
}
