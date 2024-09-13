const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    value: Number
});

module.exports = mongoose.model('Data', DataSchema);
