var https = require('https');

module.exports = {
    search: function(query, callback) {
        var url = 'https://medium.com/search?q=' + query;
        https.get(url, (res) => {
            var output = '';
            res.on('data', (d) => output+=d.toString())
            res.on('end', () => {
                var ind = output.indexOf('{"posts"')
                var posts = output.substring(ind)
                ind = posts.indexOf('}})') + 2
                posts = posts.substring(0,ind)
                var obj = JSON.parse(posts)
                var posts_list = obj['posts']
                function build_url(x) {
                    var medium = 'https://medium.com'
                    if (!x.homeCollection) {
                        return medium + '/' + x.creator.username + '/' + x.uniqueSlug;
                    } else {
                        return medium + '/' + x.homeCollection.slug +'/' + x.uniqueSlug;
                    }
                }
                var results = posts_list.map(function(x) {
                    return {
                        'title': x.title,
                        'author': x.creator.name,
                        'url': build_url(x)
                    };
                });
                callback(results);
            });
        })        
    }
};
