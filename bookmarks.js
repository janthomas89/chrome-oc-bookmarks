(function() {
    $(function() {
        var $tags = $('#list-tags');
        var $items = $('#list-items');

        $tags.on('click', 'li', function() {
            var $elm = $(this);
            $elm.siblings().removeClass('active');
            $elm.addClass('active');

            OCBookmarks.getBookmarks($elm.data('tag'), function(bookmarks) {
                $items.empty();
                bookmarks.forEach(function(bookmarks) {
                    var $favicon = $('<img>').attr('src', getFavIconURL(bookmarks.url));
                    var $a = $('<a target="_blank">')
                        .attr('href', bookmarks.url)
                        .text(bookmarks.text)
                        .prepend($favicon);
                    var $li = $('<li>').append($a);
                    $items.append($li);
                });
            });
        });

        OCBookmarks.getTags(function(tags) {
            $tags.empty();
            tags.forEach(function(tag) {
                var $a = $('<a>').text(tag).prepend('<span class="glyphicon glyphicon-tag"></span></i>');
                var $li = $('<li>').data('tag', tag).append($a);
                $tags.append($li);
            });

            $tags.find('li').first().trigger('click');
        });


    });

    var getFavIconURL = function(url) {
        return 'chrome://favicon/' + url;
    };
})();