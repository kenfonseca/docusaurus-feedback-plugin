const {Joi} = require('@docusaurus/utils-validation');
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
                console.log('Feedback plugin settings', options)
            })
        }
    };
}

// Takes the 'options' parameter and validates them
// 'validate' is a 'Joi' object (imported at the top) to validate the 'options' parameter 
//      using a custom schema made in this function
module.exports.validateOptions = ({options, validate}) => {
    // Joi object schema that will validate our options
    const joiSchema = Joi.object({
        // Validate the setting
        settings: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
            // required to be a string of minimum 10 char?
            api: Joi.string().required(),
            keys: Joi.string().min(10).required(),
            id: Joi.string().required(),
        }
    );

    // Throw an error if the options are incorrect
    const validateOptions = validate(joiSchema, options)

    return validateOptions;
};