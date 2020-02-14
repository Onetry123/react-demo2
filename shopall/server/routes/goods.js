var express = require("express");
var router = express.Router();
var goods = require("../model/goods");

router.get("/list", (req, res, next) => {
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
  let userid = req.cookies.userId, productId = req.body.productId;
  let user = require('../model/user')
  user.findOne({ userId: userid }, (err,data) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
      })
    } else {
      if (data) {
        goods.findOne({ productId: productId },(err1, date) => {
          if (err1) {
            res.json({
              status: "1",
              msg: err1.message,
            })
          } else {
            if (date) {
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
                    return v.productId==date.productId
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
