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
  "addressList": [
    {
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": Number,
      "tel": Number,
      "isDefault":Boolean,
    }
  ],

});
module.exports = mongoose.model("users", userSchema,'users');
