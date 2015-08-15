$(function() {
    var $url = $('#url');
    var $submit = $('#submit');

    var url = OCBookmarksSettings.get('url');
    url &&($url.val(url));

    $('form').on('submit', function(e) {
        e.preventDefault();

        var url = $url.val();
        if (url[url.length - 1] != '/') {
            url = url + '/';
        }

        OCBookmarksSettings.set('url', url);

        $submit.prop('disabled', true);
    }).on('change', function() {
        $submit.prop('disabled', false);
    });
});
