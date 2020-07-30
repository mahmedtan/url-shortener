var mongoose = require("mongoose");
var uuid = require("uuid");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var urlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  identifier: { type: String, required: true },
});
var urlModel = mongoose.model("urlModel", urlSchema);

const addNewUrl = (url, done) => {
  var newUrl = new urlModel({
    url,
    identifier: uuid.v4().slice(0,6),
  });
  newUrl.save((err, data) => {
    if (err) done(err);
    done(null,data);
  });
};
const getUrl=(urlId, done)=>{
    urlModel.findOne({identifier: urlId},(err,data)=>{
        if(err) done(err);
        else
        done(null,data);
    })
};
 
module.exports.addNewUrl = addNewUrl;
module.exports.getUrl = getUrl;