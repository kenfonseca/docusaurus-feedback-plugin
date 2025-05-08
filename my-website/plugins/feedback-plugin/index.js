module.exports = function (context, options){
    return {
        name: 'feedback-plugin',

        // Lifecycle methods
        
        // Inject HTML tags in the DOM of the element
        injectHtmlTags(){
            return {
                headTags: [{
                    tagName: 'meta',
                    attributes: {
                        'og:description': 'My custom description og:description-tag'
                    }
                }]
            };
        }
    };
}