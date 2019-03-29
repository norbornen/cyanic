const fs = require('fs-extra');
const path = require('path');

const dbdir = path.join(__dirname, '../db');

module.exports.create = async (dbname) => {
    const dbpath = path.join(dbdir, `${dbname}.json`);
    await fs.ensureFile(dbpath);

    const x = new db(dbpath);
    await x.initialize();
    return x;
};
class db {
    constructor(dbpath) {
        this.dbpath = dbpath;
    }
    async initialize() {
        try {
            this.data = await fs.readJson(this.dbpath);
        } catch (err) {
            this.data = [];
        }
    }
    find(id) {
        return this.data.indexOf(id) > -1;
    }
    async concat(idx) {
        this.data = this.data.concat(idx);
        return this.save();
    }
    async save() {
        await fs.writeJson(this.dbpath, this.data);
    }
}
