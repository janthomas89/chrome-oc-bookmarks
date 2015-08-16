(function(scope, $) {
    var OCBookmarksSettings = scope.OCBookmarksSettings = {
        get: function(key) {
            return localStorage['ocb_' + key];
        },
        getBoolean: function(key) {
            return localStorage['ocb_' + key] == 'true';
        },
        getObject: function(key) {
            try {
                return JSON.parse(localStorage['ocb_' + key])
            } catch(e) {
                return null;
            }
        },
        set: function(key, value) {
            localStorage['ocb_' + key] = value;
        },
        setObject: function(key, obj) {
            localStorage['ocb_' + key] = JSON.stringify(obj);
        }
    };

    var OCBookmarks = scope.OCBookmarks = {
        getTags: function(callback) {
            var cachedData = OCBookmarksSettings.getObject('cached_data');
            cachedData && callback && callback(cachedData.tags);

            var url = OCBookmarksSettings.get('url');
            if (url == null || !url.length) {
                openTab('config.html');
                return;
            }

            loadData(function(data) {
                !cachedData && callback && callback(data.tags);
            });
        },
        getBookmarks: function(tag, callback) {
            var data = OCBookmarksSettings.getObject('cached_data');
            var bookmarks = data.bookmarks.filter(function(bookmark) {
                return bookmark.tags.indexOf(tag) === 0;
            });

            callback && callback(bookmarks);
        }
    };

    var loadData = function(callback, failOnInvalidToken) {
        requireToken(function(token) {
            var path = 'index.php/apps/bookmarks/bookmark/export?requesttoken=';
            var url = OCBookmarksSettings.get('url') + path + token;

            console.log(token, url);

            $.get(url).done(function(html) {
                var tags = {};
                var bookmarks = [];
                var $html = $('<div>').html(html);

                $html.find('a').each(function() {
                    var $elm = $(this);
                    var tmpTags = $elm.attr('tags').split(',');
                    bookmarks[bookmarks.length] = {
                        url: $elm.attr('href'),
                        text: $elm.text(),
                        tags: tmpTags
                    };

                    tmpTags.forEach(function(tag) {
                        tags[tag] = true;
                    });
                });

                var data = {
                    tags: Object.keys(tags).sort(tagsSort),
                    bookmarks: bookmarks.sort(bookmarksSort)
                };

                OCBookmarksSettings.setObject('cached_data', data);
                callback && callback(data);
            }).fail(function(resp) {
                OCBookmarksSettings.set('token', null);

                if (resp.status == 412 && !failOnInvalidToken) { // Invalid CSRF Token
                    loadData(callback, true);
                } else {
                    alert('Error while requesting the owncloud bookmarks. Please check your settings!');
                }
            });
        });
    };

    var requireToken = function(callback) {
        var token = OCBookmarksSettings.get('token');
        if (token && token !=='null' && token !=='undefined') {
            callback && callback(token);
            return;
        }

        var url = OCBookmarksSettings.get('url');
        $.get(url).done(function(html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');
            var token = doc.head.getAttribute('data-requesttoken');

            OCBookmarksSettings.set('token', token);

            callback && callback(token);
        });
    };

    var openTab = function(url) {
        chrome.tabs.create({url: url});
    };

    var tagsSort = function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    };

    var bookmarksSort = function(a, b) {
        return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
    };

})(this, jQuery);