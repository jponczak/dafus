module.exports = (mongoose, mongoosePaginate) => {
var schema = mongoose.Schema(
    {
        location: String,
        district: String,
        volume: String,
        pages: Array,
        link: String,
        combined: String
    },
    { timestamp: true }
);

schema.method("toJSON", function() {
    const {__v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

schema.plugin(mongoosePaginate);

const Declaration = mongoose.model("declaration", schema);
return Declaration;

};
