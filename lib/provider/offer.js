module.exports.Offer = class Offer {
    constructor(data) {
        if (data) {
            Object.assign(this, data);
        }
    }
    toHtml() {
        throw 'Abstract class method "toHtml"!';
    }
};
