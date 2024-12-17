class expressError extends Error {
    constructor(stausCode, message) {
        super();
        this.stausCode = stausCode;
        this.message = message;
    }
}

module.exports = expressError;