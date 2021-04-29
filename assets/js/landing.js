var pageContainer = $('#site-container');
var searchForm = $('#search-form');
var bookmarkContainer = $('#bookmarks .row');
var body = $('body');

var bookmarks = [];

// Send search field contents to results page in the URL
function handleSearchFormSubmit(event) {
  event.preventDefault();
  var searchValue = $('#search-input').val();
     //   If input is empty
  if (!searchValue) {
    return;
  }
  // append search terms to URL and redirect to results page
  var queryString = './results.html?q=' + searchValue;
  location.assign(queryString);
}

// Bookmark event listener 
pageContainer.on('click', '.icon', function(event){
    // toggle bookmark icon
    var icon = $(this).find('i');
    //  determine if bookmark was added or removed
    var isBookmark = icon.hasClass('fas'); 
    icon.removeClass('fas far').addClass(isBookmark ? 'far' : 'fas');
    
    // determine if video or question
    var isQuestion = false;
    var isVideo = false;
    var card = $(this).closest('.card');
    if (card.hasClass('card-question')){
       isQuestion = true;
    } else {
        isVideo = true;
    } 

    if (isQuestion){
      var questionDate = card.find('.create-date').text();
      var questionQuestion = card.find('.card-title').text();
      var questionURL = card.find('a.btn').attr('href');
      var questionAnswers = card.find('.answers').text();
      var questionViews = card.find('.views').text();
    }

    if (!isBookmark) {
        // Add item to array
        if (isQuestion){
            bookmarks.push({
               type: 'question',
               qDate: questionDate,
               qTitle: questionQuestion,
               qUrl:  questionURL,
               qAnswers: questionAnswers,
               qViews: questionViews
            });
        } else {
           bookmarks.push({
               type: 'video'
            });
        } 

    } else {
       if (isQuestion){
          // Return matching object from array bookmarks, get its index
          var getMatchingIndex = bookmarks.findIndex(x => x.qTitle === questionQuestion);
        } else {
          //  TODO: Return matching video from bookmarks array
        }
        // Remove bookmark object that was clicked from array
        if (getMatchingIndex > -1) {
          bookmarks.splice(getMatchingIndex, 1);
        }
    }
    
    //  push to local storage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    renderBookmarks();
});

//Write bookmarks from storage to the page
function renderBookmarks() {
     // TODO: First clear the display 
      $('.results-card').remove();
      // Get search phrases from the array of objects and print them onto the page
    for (var i = 0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        var bookmarkType = bookmark.type;
        if (bookmarkType === "question"){
            // Render question card
            var question = bookmark.qTitle;
            var link = bookmark.qUrl;
            var createDate = bookmark.qDate;

            var questionHeader = $('<h5/>').text('Question');
            var questionCard = $('<div class="card results-card card-question medium" />');
            var questionContainer = $('<span class="card-title" />');
            var createDateContainer = $('<span class="create-date" />');
            var linkButton = $('<a class="btn purple darken-3" target="_blank" />');
            var favoriteIcon = $('<span class="icon"><i class="fas fa-bookmark"></i></span>');
            var divWrapper = $('<div class="col s12 m4"/>');
            var div1 = $('<div class="image-holder" />');
            var div2 = $('<div />');
            var div3 = $('<div />');
            //  Put data into the elements
            questionContainer.text(question);
            linkButton.text('View').attr('href', link);
            createDateContainer.text(createDate);
            //  Create structure
            div2.append(favoriteIcon).append(questionHeader);
            div3.append(createDateContainer).append(questionContainer);
            questionCard.append(div2).append(div1).append(div3).append(linkButton);
            divWrapper.append(questionCard);
            //  Assemble card
            bookmarkContainer.append(divWrapper);
        } else {

        }
    }   
}

// Search form submit event
searchForm.on('submit', handleSearchFormSubmit);

function init() {
    // Get bookmarks from localStorage
    var storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    // If bookmarks exist in localStorage, update the bookmarks array
    if (storedBookmarks.length !== 0) {
        bookmarks = storedBookmarks;
    } else {
      var bookmarkMessage = $('<h5/>');
      bookmarkMessage.text('No bookmarks exist.');
      pageContainer.append(bookmarkMessage);
    }
    // render bookmarks to the page
   renderBookmarks();
}

init();