var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var goods = require("../model/goods");


mongoose.connect("mongodb://127.0.0.1:27017/demo")
mongoose.connection.on("connected", () => {
    console.log("mongodb connected success")
})
mongoose.connection.on("error", () => {
  console.log("mongodb connected fail")
})
mongoose.connection.on("disconnected", () => {
  console.log("mongodb connected disconnected")
})
router.get("/", (req, res, next) => {
  let sort = req.param("sort");
  let page = parseInt(req.param("page"))
  let priceLevel = req.param("priceLevel")
  let pageSize = parseInt(req.param('pageSize'))
  let skip = (page - 1) * pageSize;
  let pricegt = "", pricelte = '';
  let params = {};
  if (priceLevel != "all") {
    switch (priceLevel) {
      case "0": pricegt = 0; pricelte = 100; break;
      case "1": pricegt = 100; pricelte = 500; break;
      case "2": pricegt = 500; pricelte = 1000; break;
      case "3": pricegt = 1000; pricelte = 5000; break;
    }
    params = {
      salePrice: {
        $gt: pricegt,
        $lte:pricelte,
      }
    }
  }
  let goodsmodel = goods.find(params).skip(skip).limit(pageSize);
  goodsmodel.sort({"salePrice":sort})
  goodsmodel.exec((err, data) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      res.json({
        status: "0",
        msg: "",
        result: {
          count: data.length,
          list:data
        }
      })
    }
  })

})
router.post("/addCart", (req,res,next) => {
  let userid = 10086, productId = req.body.productId;
  let user = require('../model/user')
  user.findOne({ userId: userid }, (err,data) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
      })
    } else {
      console.log(data)
      if (data) {
        goods.findOne({ productId: productId },(err1, date) => {
          if (err1) {
            res.json({
              status: "1",
              msg: err1.message,
            })
          } else {
            if (date) {
              date.productNum = 1;
              date.checked = 1;
              let obj = {
                _id:date._id,
                productId: date.productId,
                productName: date.productName,
                salePrice: date.salePrice,
                productImage: date.productImage,
                productNum: 1,
                checked:1,
              }
              let index = data.cartList.findIndex((v) => {
                    return v.checked
              })
              if (index ==-1) {
              data.cartList.push(obj)
              } else {
                data.cartList[index].productNum++
              }
              data.save((err2, doc) => {
                if (err2) {
                  res.json({
                    status: "1",
                    msg: err2.message,
                  })
                } else {
                  res.json({
                    status: "0",
                    msg: "",
                    result:doc,
                  })
                }
              })
            }
          }
        })
      }
    }
  })
})
module.exports=router
