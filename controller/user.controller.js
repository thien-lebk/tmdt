//Import lowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
var md5 = require('md5');
var randomid = require('randomid');
const { log } = require('debug');

//End of Import lowDB
//Date time
var d = new Date();


module.exports.index = function (req, res) {
    var find = db.get('Chuyenmuc').value();
    var mathang = db.get('MatHang').value();
    var name = "";
    var role = "";

    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
        } 
        if (req.cookies.info.role) {
            role = req.cookies.info.role;
        } 
    }

    res.render('index', { title: 'Express', find: find, listsp: mathang, name: name, role:role});
}
module.exports.dangki = function (req, res) {
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
            giohang = db.get('MatHang').find({ username: name }).value();
        } else {
            name = "";
        }
    }
    else {
        name = "";

    }
    res.render('dangki', { title: 'Express', status: '', name: name , role:""});
}
module.exports.xacthucdangki = function (req, res) {
    var usr = req.body.usr;
    var pass = md5(req.body.pass);
    var giohang = randomid();
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;

            giohang = db.get('MatHang').find({ username: name }).value();

        } else {
            name = "";

        }
    }
    else {
        name = "";

    }
    var find = db.get('User').find({ username: usr }).value();

    if (find) {
        res.render('dangki', { title: 'Express', status: 'Tai khoan da duoc dang ki' });


    } else {
        db.get('User')
            .push({ username: usr, password: pass, giohang: giohang })
            .write();
        db.get('GioHang')
            .push({ username: usr, idgiohang: giohang, mathang: [] })
            .write();

        res.render('dangnhap', { title: 'Express', status: 'Dang ki thanh cong', name: name, role:""});

    }
}
module.exports.dangnhap = function (req, res, next) {
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;

            giohang = db.get('MatHang').find({ username: name }).value();

        } else {
            name = "";

        }
    }
    else {
        name = "";

    }
    res.render('dangnhap', { title: 'Express', status: '', name: name, role:"" });
}

//Them chuyen muc GET
module.exports.themchuyenmuc = function (req, res, next) {
    var name = req.cookies.info.username;
    var role = "";
    if( req.cookies.info.role){
        role = req.cookies.info.role;
        res.render('themchuyenmuc', { title: 'Express', status: '', name: name,role:role });
    } else {
        res.redirect('/');
    }
}
//Them chuyen muc POST
module.exports.postthemchuyenmuc = function (req, res, next) {
    var ten = req.body.ten;
    var url = req.body.url;
    var id = randomid();

    db.get('Chuyenmuc')
        .push({ ten: ten, id: id, url: url })
        .write()
    var find = db.get('Chuyenmuc').value();

    res.redirect('/');
}
//Them mat hang GET
module.exports.themmathang = function (req, res, next) {
    var name = req.cookies.info.username;
    var role = "";
    
    if( req.cookies.info.role){
        role = req.cookies.info.role;
        var chuyenmuc = db.get('Chuyenmuc').value();
        res.render('themmathang', { title: "Them mat hang", chuyenmuc: chuyenmuc, name: name,role:role });
    } else {
        res.redirect('/');
    }
        
   

}
//Them mat hang POST
module.exports.postthemmathang = function (req, res, next) {
    var ten = req.body.ten;
    var mota = req.body.mota;
    var gia = req.body.gia;
    var anh = req.body.anh;
    var soluong = req.body.soluong;
    var chuyenmuc = req.body.chuyenmuc;
    var giakm = req.body.giakm;
    var hankm = req.body.hankm;
    var id = randomid();

    db.get('MatHang')
        .push({ ten: ten, id: id, mota: mota, gia: gia, anh: anh, soluong: soluong, chuyenmuc: chuyenmuc , giakm: giakm, hankm: hankm})
        .write()
    var find = db.get('Chuyenmuc').value();
    res.redirect('/');

}
//Chi tiet mat hang
//Them mat hang POST
module.exports.chitietmathang = function (req, res, next) {
    var name = req.cookies.info.username;
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    var id = req.body.id;

    var mathang = db.get('MatHang').find({ id: id }).value();
    var chuyenmuc = db.get('Chuyenmuc').value();

    res.render('chitietmathang', { chuyenmuc: chuyenmuc, mathang: mathang, name: name ,role:role});

}

//Thanh toan
//POST trang thanh toan
module.exports.thanhtoan = function (req, res, next) {
    var name = req.cookies.info.username;
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    var id = req.body.id;
    var find = db.get('Chuyenmuc').value();
    var mathang = db.get('MatHang').find({ id: id }).cloneDeep().value();

    // Kiểm tra coi có giá km ko
    var date1 = new Date(mathang.hankm)
    var date2 = new Date()
    if ((date1.getTime() >= date2.getTime()) && (mathang.giakm != "")) { 
        mathang.gia = mathang.giakm;
    }

    var chuyenmuc = db.get('Chuyenmuc').value();

    res.render('thanhtoan', { chuyenmuc: chuyenmuc, mathang: mathang, name: name, find: find,role:role});

}
//Xac nhan thanh toan
//POST trang hoadon
module.exports.hoadon = function (req, res, next) {
    var id = req.body.id;
    var soluongdat = req.body.soluongdat;
    var usr = req.cookies.info.username;
    var mathang = db.get('MatHang').find({ id: id }).cloneDeep().value();
    var find = db.get('Chuyenmuc').value();
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    // Kiểm tra coi có giá km ko
    var date1 = new Date(mathang.hankm)
    var date2 = new Date()
    if ((date1.getTime() >= date2.getTime()) && (mathang.giakm != "")) { 
        mathang.gia = mathang.giakm;
    }

    var chuyenmuc = db.get('Chuyenmuc').value();
    var donhang = { id: id, soluongdat: soluongdat, usr: usr, mathang: mathang, }
    console.log(soluongdat);
    
    res.render('hoadon', { chuyenmuc: chuyenmuc, mathang: mathang, donhang: donhang, name: usr ,soluongdat:soluongdat, find: find,role:role});
}
//POST xac nhan thanh toan
module.exports.xacnhanthanhtoan = function (req, res, next) {
    var id = req.body.id;
    var idhoadon = randomid();
    var magiaodich = randomid();
    var thanhtoan = req.body.thanhtoan;
    var thanhtien = req.body.thanhtien;
    var soluongdat = req.body.soluongdat;
    var usr = req.cookies.info.username;
    // var thoigian = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "-" + d.getHours() + "h" + d.getMinutes() + "p";
    var thoigian = d;
    var mathang = db.get('MatHang').find({ id: id }).value();
    var find = db.get('Chuyenmuc').value();

    // Kiểm tra coi có giá km ko
    var date1 = new Date(mathang.hankm)
    var date2 = new Date()
    var gia;
    if ((date1.getTime() >= date2.getTime()) && (mathang.giakm < mathang.gia)) { 
        gia = mathang.giakm
    }else{
        gia = mathang.gia
    }

    var chuyenmuc = db.get('Chuyenmuc').value();

    var donhang = { idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: usr, hang: [{ ten: mathang.ten, gia: gia, id: id, soluongdat: soluongdat }], thanhtien: thanhtien, idgiohang: 0, thoigian: thoigian };
    db.get('HoaDon')
        .push(donhang)
        .write()
    var name = req.cookies.info.username;
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    res.render('thongtinhoadon', { chuyenmuc: chuyenmuc, mathang: mathang, donhang: donhang, name: name,role:role , find: find});
}
//Test
//GET Lich su giao dich
module.exports.lichsudathang = function (req, res, next) {

    var usr = req.cookies.info.username;
    var role ;
    if(req.cookies.info.username){
        role = req.cookies.info.role;
    }
    
    var chuyenmuc = db.get('Chuyenmuc').value();
    var hoadon = db.get('HoaDon')
        .value()
    var danhsach = []
    hoadon.forEach(element => {
        if (element.usr == usr) {
            danhsach.push(element);
        }
    });
    console.log("role la "+ role);
    
    res.render('lichsudathang', { hoadon: danhsach, name: usr,role:role });
}
//Post Chi tiet lich su don hang
module.exports.chitietlichsudonhang = function (req, res, next) {
    var name = req.cookies.info.username;

    var idhoadon = req.body.idhoadon;
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    var donhang = db.get('HoaDon')
        .find({ idhoadon: idhoadon })
        .value();

    res.render('chitietlichsudonhang', { donhang: donhang, name: name,role:role });
}
//Logout
module.exports.logout = function (req, res, next) {
    //    res.cookie('info',{'username':usr, 'password':pass});

    res.cookie('info', { expires: Date.now() });
    res.redirect('/');
}

//Them gio hang
module.exports.themgiohang = function (req, res, next) {
    //    res.cookie('info',{'username':usr, 'password':pass});
    var usr = req.cookies.info.username;
    var idhang = req.body.id;
    var hang = db.get('MatHang').find({ id: idhang }).value();
    var giohang = db.get("User").find({ username: usr }).value().giohang;
    var mathang = db.get("GioHang").find({ idgiohang: giohang }).value().mathang;
    // Sửa chỗ số lượng này
    hang["soluongdat"] = 1;
    console.log(hang);

    if (!(mathang.filter(str => str.id == idhang)[0])) {
        mathang.push(hang);
        db.get("GioHang").find({ idgiohang: giohang }).assign({ mathang }).write();
    }
    res.redirect('/');
}
//Xem gio hang
module.exports.giohang = function (req, res, next) {
    var username = req.cookies.info.username;
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
  
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ username: username }).value();
    res.render('giohang', { chuyenmuc: chuyenmuc, name: username, giohang: giohang ,role:role});
}

//Xoa san pham khoi gio
module.exports.xoasanphamkhoigio = function (req, res, next) {
    var username = req.cookies.info.username;
    var idsanpham = req.body.id;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ username: username }).value();
    var mathang = [];
    giohang.mathang.forEach(element => {
        if (element.id != idsanpham) {
            mathang.push(element);
        }
    });
    db.get("GioHang").find({ username: username }).assign({ mathang }).write();
    giohang = db.get('GioHang').find({ username: username }).value();
    res.render('giohang', { chuyenmuc: chuyenmuc, name: username, giohang: giohang,role:"" });
}
//AJAX cap nhat gio hang
module.exports.capnhatgiohang = function (req, res, next) {
    var idgiohang = req.body.idgiohang;
    var idmathang = req.body.idmathang;
    var soluongdat = req.body.soluong;
    var giohang = db.get('GioHang').find({ idgiohang: idgiohang }).value();
    
    giohang.mathang.forEach(element => {
        if (element.id == idmathang) {

            element.soluongdat = soluongdat;
        }
    });
    var mathang = giohang.mathang;    
    db.get("GioHang").find({ idgiohang: idgiohang }).assign({ mathang }).write();

    res.send();
}
//Thanh toan gio hang
module.exports.thanhtoangiohang = function (req, res, next) {
    var idgiohang = req.body.idgiohang;
    var username = req.cookies.info.username;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ idgiohang: idgiohang }).cloneDeep().value();
    var find = db.get('Chuyenmuc').value();
    var tongtien = 0;
    giohang.mathang.forEach(element=>{
        // Kiểm tra coi có giá km ko
        var date1 = new Date(element.hankm)
        var date2 = new Date()
        if ((date1.getTime() >= date2.getTime()) && (element.giakm != "")) { 
            element.gia = element.giakm;
        }

        tongtien += element.gia*element.soluongdat;
    })
    res.render('thanhtoangiohang', { chuyenmuc: chuyenmuc, name: username, giohang: giohang, tongtien:tongtien, find: find,role:"" });
}
//Xac nhan thanh toan gio hang
module.exports.xacnhanthanhtoangiohang = function (req, res, next) {    
    var idgiohang = req.body.idgiohang;
    var username = req.cookies.info.username;
    var thanhtoan = req.body.thanhtoan;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ idgiohang: idgiohang }).value();
    var find = db.get('Chuyenmuc').value();
    var tongtien = 0;
    var hang = [];
    giohang.mathang.forEach(element=>{
        var hang_temp = {};
        hang_temp.ten = element.ten;
        hang_temp.id = element.id;
        hang_temp.soluongdat = element.soluongdat;

        // Kiểm tra coi có giá km ko
        var date1 = new Date(element.hankm)
        var date2 = new Date()
        if ((date1.getTime() >= date2.getTime()) && (element.giakm != "")) { 
            tongtien += element.giakm*element.soluongdat;
            hang_temp.gia = element.giakm;
        }else{
            tongtien += element.gia*element.soluongdat;
            hang_temp.gia = element.gia;
        }
        hang.push(hang_temp);
        
    })

    var idhoadon = randomid();
    var magiaodich = randomid();
   
    
    // var thoigian = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "-" + d.getHours() + "h" + d.getMinutes() + "p";
    var thoigian = d;
    // console.log("here");

    var donhang = { idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: username, hang: hang, thanhtien: tongtien, idgiohang: idgiohang, thoigian: thoigian };
    db.get('HoaDon')
        .push(donhang)
        .write()

    // Sau khi hoàn thành thì empty cái giỏ hàng
    db.get('GioHang').find({ idgiohang: idgiohang }).assign({mathang: []}).write();

    var donhang = db.get('HoaDon').find({ idhoadon: idhoadon }).value();
    res.render('thongtinhoadon', { chuyenmuc: chuyenmuc, donhang: donhang, name: username, find: find,role:""});
}

//Thêm người dùng
module.exports.themnguoidung = function (req, res, next) {
    var role = "";
    var name = ""

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    if(req.cookies.info.username){
        name = req.cookies.info.username;
    }
    res.render('themnguoidung', {  name:name, username:name,role:role,title:"Thêm người dùng",status:"" });
}
module.exports.postthemnguoidung = function (req, res, next) {
    var usr = req.body.usr;
    var pass = md5(req.body.pass);
    var giohang = randomid();
    var role = req.body.role;
    var name;
  
   
    var find = db.get('User').find({ username: usr }).value();

    if (find) {
        res.render('themnguoidung', { title: 'Express', status: 'Tai khoan da duoc dang ki' });


    } else {
        
        if(role == "admin"){
            db.get('User')
            .push({ username: usr, password: pass, giohang: giohang,role:"admin" })
            .write();
        } else{
            db.get('User')
            .push({ username: usr, password: pass, giohang: giohang })
            .write();
        }
        


        db.get('GioHang')
            .push({ username: usr, idgiohang: giohang, mathang: [] })
            .write();

        res.render('dangnhap', { title: 'Express', status: 'Dang ki thanh cong', name: name, role:""});

    }
}






///////////////////////// TIN //////////////////////////////
module.exports.xemtheodanhmuc = function(req, res, next){

    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
        } else {
            name = "";

        }
    }
    else {
        name = "";

    }

    var dsSanpham = db.get("MatHang").filter({chuyenmuc: req.params.tendanhmuc}).value();
    var find = db.get('Chuyenmuc').value();
    // console.log(dsSanpham);
    // console.log("Params la gi: ", req.params);
    res.render('xemtheodanhmuc', {name: name, listsp: dsSanpham, find: find,role:""});
}

// 
module.exports.chinhsuamathang = function(req, res, next){

    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
        } else {
            name = "";
        }
    }
    else {
        name = "";
    }
    //console.log("Triggered!");
    var sanpham = db.get("MatHang").filter({id: req.params.id}).value()[0];
    console.log(sanpham);

    var chuyenmuc = db.get('Chuyenmuc').value();
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    res.render('chinhsuamathang', {title: "Triggered :v", sanpham: sanpham, chuyenmuc: chuyenmuc, name: name, role:role});
}

module.exports.postchinhsuamathang = function(req, res, next){
    // console.log("Triggered!");
    db.get("MatHang").find({id: req.params.id}).assign({ten: req.body.ten, mota: req.body.mota, gia: req.body.gia, anh: req.body.anh, soluong: req.body.soluong, chuyenmuc: req.body.chuyenmuc, giakm: req.body.giakm, hankm: req.body.hankm}).write();

    // Update xong thì trở về trang danh mục sản phẩm
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
        } else {
            name = "";
        }
    }
    else {
        name = "";
    }
    var dsSanpham = db.get("MatHang").filter({chuyenmuc: req.body.chuyenmuc}).value();
    var find = db.get('Chuyenmuc').value();
    // console.log(dsSanpham);
    // console.log("Params la gi: ", req.params);
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    res.render('xemtheodanhmuc', {name: name, listsp: dsSanpham, find: find, role:role});
}

module.exports.xoasanpham = function(req, res, next){
    console.log("Triggered!");
    var chuyenmuc = db.get("MatHang").find({id: req.params.id}).value().chuyenmuc;
    db.get("MatHang").remove({id: req.params.id}).write();

    // Xóa xong thì trở về trang danh mục sản phẩm
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
        } else {
            name = "";
        }
    }
    else {
        name = "";
    }
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    var dsSanpham = db.get("MatHang").filter({chuyenmuc: chuyenmuc}).value();
    var find = db.get('Chuyenmuc').value();
    res.render('xemtheodanhmuc', {name: name, listsp: dsSanpham, find: find, role:role});
}