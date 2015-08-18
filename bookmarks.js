(function() {
    $(function() {
        var $tags = $('#list-tags');
        var $items = $('#list-items');
        var $add = $('#add');
        var $stats = $('#stats');

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
                        .attr('title', bookmarks.url)
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

        $add.click(function(e) {
            e.preventDefault();
            OCBookmarks.getAddURL(function(url) {
                var dialog = window.open(
                    url,
                    'OCBookmarksPopup',
                    'top=' + ((window.screenY || window.screenTop) + 15) + ',left=' + ((window.screenX || window.screenLeft) + 0) + ',height=360px,width=560px,resizable=0,alwaysRaised=1');

                window.setTimeout(function(){dialog.focus()}, 0);
                window.close();


            });
        });

        OCBookmarks.onStatusChange(function(date, online) {
            var text = 'last sync: ';
            text += date ? date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' +  date.getHours() + ':' + date.getMinutes() : ' n/a ';
            text += ', ';
            $stats.text(text);

            if (online) {
                $stats.append('online');
            } else {
                var loginURL = OCBookmarksSettings.get('url');
                $stats.append('<a href="' + loginURL + '" target="_blank">offline</a>');
            }
        });
    });

    var getFavIconURL = function(url) {
        return 'chrome://favicon/' + url;
    };
})();