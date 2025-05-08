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
        },

        // extendCli takes in a cli object (command.js type object)
        extendCli(cli){
            // To run this command in terminal: 'npm run docusaurus feedback-plugin'
            cli.command('feedback-plugin')
            // idek
            .description('this is a custom command')
            // what executes when the command is called
            .action(() => {
                console.log('Hello from the plugin');
            })
        }
    };
}