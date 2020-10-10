const observers = {};

module.exports = {

    on: (event, command) => {
        try {
            
            observers[event] = command;

        } catch (error) {
            console.error(error);
        }
    },

    emit: (event, ...content) => {
        try {
            
            observers[event](...content);

        } catch (error) {
            console.error(error);
        }
    }

}
