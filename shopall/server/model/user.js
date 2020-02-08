var mongoose = require("mongoose")
var userSchema = new mongoose.Schema({
  "userId": String,
  "userName": String,
  "userpwd": String,
  "orderList": Array,
  "cartList": [
    {
      "productId": String,
      "productName": String,
      "salePrice": Number,
      "productImage": String,
      "checked": Number,
      "productNum":Number,
    }
  ],
  "addressList": Array,

});
module.exports = mongoose.model("users", userSchema);
