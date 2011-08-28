(function() {
var linkTemplate = '<li><a class="bookmark_link"></a></li>';
function openBookmark() {
    var $self = $(this);
    var url = $self.attr('href');
    var rangeInfo = $self.data('content_range');

    chrome.tabs.create({url: url, selected: true});
    chrome.tabs.getSelected(null , function(tab) {
    	alert(tab.id);
        chrome.tabs.sendRequest(tab.id, {
            action: 'highlightSelection',
            rangeInfo: rangeInfo,
            color: 'color'
        });
    });
    return false;
};

function renderBookmarks() {
	var $list = $('#links_list');
    for (var i = 0; i < localStorage.length; i++) {
        var obj = JSON.parse(localStorage[i]);
        var title = obj.title;
        if (obj.title.length > 50)
            title = title.substr(0, 50) + '...';
        
        var $li = $(linkTemplate);
        var $a = $li.find('a').text(title)
                              .attr('href', obj.url)
                              .attr('title', obj.title)
                              .data('content_range', obj.rangeInfo);
        $list.append($li);
    }
};

function clearStorage() {
    localStorage.clear()
    chrome.browserAction.setBadgeText({'text': '0'}); 
    $('#links_list').empty();
}

$(document).ready(function() {
	renderBookmarks();
    $('a.bookmark_link').live('click', openBookmark);
    $('#clear_storage').click(clearStorage);
});
})();
