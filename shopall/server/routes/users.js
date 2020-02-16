var express = require('express');
var router = express.Router();
let user = require('./../model/user')
require('./../util/util');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post("/login", (req, res, next) => {
  let param = {
    userName: req.body.userName,
    userpwd: req.body.userPwd,
  }
  user.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        let obj = {
          path: '/',
          maxAge: 1000 * 60 * 60
        }
        res.cookie('userId', doc.userId, obj)
        res.cookie("userName", doc.userName, obj)
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })

      }
    }
  })
});
router.post('/logOut', (req, res, next) => {
  res.cookie('userId', '', { path: '/', maxAge: -1 })
  res.json({ status: '0', msg: '', result: '' })
})
router.get("/cartList", (req, res, next) => {
  var userId = req.cookies.userId
  user.findOne({ userId: userId }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ""
      })
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: "",
          result: doc.cartList
        })
      }
    }
  })
})
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ""
    })
  }
})
router.post('/cartdel', (req, res, next) => {
  let userId = req.cookies.userId
  let productId = req.body.productId
  user.updateOne({
    userId: userId
  },
    {
      $pull: {
        "cartList": {
          'productId': productId
        }
      }
    }, (err, data) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: '',
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: '删除成功',
        })
      }
    })
})
router.post('/cartEdit', (req, res, next) => {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    checked = req.body.checked,
    productNum = req.body.productNum;
  console.log(req.body)
  user.updateOne({ 'userId': userId, "cartList.productId": productId }, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})
router.post('/checkAll', (req, res, next) => {
  let userId = req.cookies.userId,
    checked = req.body.checkAll ? '1' : '0';
  user.findOne({ 'userId': userId }, (err, data) => {
    if (err) {
      res.json({
        status: '1',
        msg: res.message,
        result: ''
      })
    } else {
      if (data) {
        data.cartList.forEach((item) => {
          item.checked = checked
        })
        user.updateOne({'userId':userId,'cartList':data.cartList},(err,doc)=>{})
      }
    }
  })
})
router.get('/address', (req, res, next) => {
  let userId = req.cookies.userId;
  user.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      })
    }
  })
})
router.post('/setdefault', (req, res, next) => {
  let userId = req.cookies.userId,
      addressId = req.body.addressId;
  user.findOne({ userId: userId }, (err, data) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      let addressList = data.addressList;
      addressList.forEach((item) => {
        if (item.addressId == addressId) {
          item.isDefault = true
        } else {
          item.isDefault = false
        }
      })
      user.updateOne({ 'userId': userId, 'addressList': data.addressList }, (err, doc) => { })
    }
  })
})
router.post("/deladdress", (req,res,next) => {
  let userId = req.cookies.userId,
      addressId = req.body.addressId;
  user.updateOne({
    userId: userId
  },
    {
      $pull: {
        "addressList": {
          'addressId': addressId
        }
      }
    }, (err, data) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: '',
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: '删除成功',
        })
      }
  })
})
router.post('/payment', (req,res,next) => {
  let userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal;
  user.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      let key = doc.addressList.findIndex((item) => {
        return item.addressId == addressId
      })
      let address = doc.addressList[key];
      let userList=[]
      doc.cartList.map((item) => {
        if (item.checked == '1') {
            userList.push(item)
        }
      })
      let platform='622'
      let r1 = Math.floor(Math.random() * 10);
      let r2 = Math.floor(Math.random() * 10);
      let sysData = new Date().Format('yyyyMMddhhmmss')
      let createDate= new Date().Format('yyyy-MM-dd hh:mm:ss')
      let orderId=platform+r1+sysData+r2
      let order = {
        orderId:orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: userList,
        orderStatus: '1',
        createDate:createDate
      }
      doc.orderList.push(order)
      user.updateOne({ 'userId': userId, 'ordeerList': doc.orderList }, (err, doc) => {
        res.json({
          status: '0',
          msg: '',
          result: {
            orderId:order.orderId,
            orderTotal:order.orderTotal,
          }
        })
      })

    }
  })
})
module.exports = router;
