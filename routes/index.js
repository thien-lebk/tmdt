var express = require('express');
var router = express.Router();
var controller = require('../controller/user.controller') //import controller
//Import auth.middleware
var auth = require('../controller/auth.middleware');

//Random id
var randomid = require('randomid')
//Get from ajax
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })




//Import lowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

//End of Import lowDB

/* GET home page. */
router.get('/', controller.index);
/* GET Dang ki page. */
router.get('/dangki', controller.dangki);
/* POST home page. */
router.post('/post', controller.xacthucdangki);
// //Parameter
// router.get('/search', function (req, rest) {
//   var q = req.query.q;
//   var matchUser = user.filter(function (user) {
//     return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
//   })
//   console.log("success");

// })
// //Cookie
// router.get('/cookie', function (req, res, next) {
//   console.log(req.cookies.info);
//   res.send();
// });

//Login
router.get('/dangnhap', controller.dangnhap);
//Xac thuc dang nhap
router.post('/xacthucdangnhap', auth.xacthucdangnhap);
//Them chuyen muc
router.get('/themchuyenmuc', auth.authen, controller.themchuyenmuc);
router.post('/themchuyenmuc', auth.authen, controller.postthemchuyenmuc);

//Them mat hang
router.get('/themmathang', auth.authen, controller.themmathang);
router.post('/themmathang', auth.authen, controller.postthemmathang);
//Chi tiet mat hang
router.post('/chitietmathang', auth.authen, controller.chitietmathang);
//Thanh toan
router.post('/thanhtoan', auth.authen, controller.thanhtoan);
//Hoadon
router.post('/hoadon', auth.authen, controller.hoadon);
//Xac nhan thanh toan
router.post('/xacnhanthanhtoan', auth.authen, controller.xacnhanthanhtoan);
//Lich su giao dich
router.get('/lichsudathang', auth.authen, controller.lichsudathang);
//Chi tiet Lich su don hang
router.post('/chitietlichsudonhang', auth.authen, controller.chitietlichsudonhang);
//Đăng xuất
router.get('/logout', controller.logout);
//Thêm giỏ hàng
router.post('/themgiohang', controller.themgiohang);
//Xem gio hang
router.get('/giohang', auth.authen, controller.giohang);
//Post xoa san pham khoi gio hang
router.post('/xoasanphamkhoigio', auth.authen, controller.xoasanphamkhoigio);
//Cap nhat lai gio hang sau khi them san pham
router.post('/capnhatgiohang', jsonParser, controller.capnhatgiohang);
//Thanh toan gio hang
router.post('/thanhtoangiohang', auth.authen, controller.thanhtoangiohang);
//Thanh toan gio hang
router.post('/xacnhanthanhtoangiohang', auth.authen, controller.xacnhanthanhtoangiohang);

// Tới trang chỉnh sửa thông tin sản phẩm. theo id
router.get('/themnguoidung', auth.authen, controller.themnguoidung);
router.post('/themnguoidung', auth.authen, controller.postthemnguoidung);      





////////////////////////// TINNNNNNNN //////////////////////////////
router.get('/danhmuc/:tendanhmuc', controller.xemtheodanhmuc);

// Tới trang chỉnh sửa thông tin sản phẩm. theo id
router.get('/chinhsua/:id', auth.authen, controller.chinhsuamathang);
router.post('/chinhsua/:id', auth.authen, controller.postchinhsuamathang);      // Xử lí form chỉnh sửa
router.post('/xoa/:id', auth.authen, controller.xoasanpham);      // Xử lí form chỉnh sửa


module.exports = router;
