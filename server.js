const express = require("express");
const path = require("path");
const app = express();
const port = 8083;

// --- Cấu hình Server ---

// 1. Cho phép truy cập các file tĩnh (CSS, JS, ảnh, v.v.)
// LƯU Ý: Mặc dù chúng ta định tuyến tường minh các file JS bên dưới, 
// express.static vẫn được giữ lại để phục vụ CSS, ảnh và các tài nguyên tĩnh khác.
app.use(express.static(path.join(__dirname)));

// Middleware để log request (Tùy chọn)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- Định tuyến cho Phòng Đào tạo (PDT-PCT) ---
// Thư mục: PDT-PCT
app.get("/pdt/home", (req, res) => {
    res.sendFile(path.join(__dirname, "PDT-PCT/index.html"));
});

app.get("/pdt/danhsachsinhvien", (req, res) => {
    res.sendFile(path.join(__dirname, "PDT-PCT/PDT_Xemdssinhvien.html"));
});

app.get("/pdt/danhsachtuvan", (req, res) => {
    res.sendFile(path.join(__dirname, "PDT-PCT/PDT_Xemdstuvan.html"));
});

app.get("/pdt/chitietbuoituvan", (req, res) => {
    res.sendFile(path.join(__dirname, "PDT-PCT/PDT_Xemthongtinchitietbuoituvan.html"));
});

// --- Định tuyến cho Sinh viên (Sinhvien) ---
// Thư mục: Sinhvien
app.get("/sv/home", (req, res) => {
    res.sendFile(path.join(__dirname, "Sinhvien/index.html"));
});

app.get("/sv/dangkybuoituvan", (req, res) => {
    res.sendFile(path.join(__dirname, "Sinhvien/SVHS_dangkybuoituvan.html"));
});

app.get("/sv/lichsudangky", (req, res) => {
    res.sendFile(path.join(__dirname, "Sinhvien/SVHS_lichsudangky.html"));
});

app.get("/sv/thongtincanhan", (req, res) => {
    res.sendFile(path.join(__dirname, "Sinhvien/SVHS_thongtincanhan.html"));
});


// --- Định tuyến cho Tư vấn viên (Tutor) ---
// Thư mục: Tutor
app.get("/tutor/home", (req, res) => {
    res.sendFile(path.join(__dirname, "Tutor/index.html"));
});

app.get("/tutor/taobuoituvan", (req, res) => {
    res.sendFile(path.join(__dirname, "Tutor/tutor_taobuoituvan.html"));
});

app.get("/tutor/thongtincanhan", (req, res) => {
    res.sendFile(path.join(__dirname, "Tutor/tutor_thongtincanhan.html"));
});

app.get("/tutor/xemlichsu", (req, res) => {
    res.sendFile(path.join(__dirname, "Tutor/tutor_xemlichsu.html"));
});


// --- Định tuyến TƯỜNG MINH cho các file JavaScript (JS) ---

// PDT-PCT JS files
app.get("/pdt/data", (req, res) => {
    res.sendFile(path.join(__dirname, "PDT-PCT/data.js"));
});

app.get("/pdt/data2", (req, res) => {
    res.sendFile(path.join(__dirname, "PDT-PCT/data2.js"));
});

app.get("/pdt/data3", (req, res) => {
    res.sendFile(path.join(__dirname, "PDT-PCT/data3.js"));
});

app.get("/pdt/data4", (req, res) => {
    res.sendFile(path.join(__dirname, "PDT-PCT/data4.js"));
});

// Sinhvien JS files
app.get("/sv/data", (req, res) => {
    res.sendFile(path.join(__dirname, "Sinhvien/data.js"));
});

app.get("/sv/data2", (req, res) => {
    res.sendFile(path.join(__dirname, "Sinhvien/data2.js"));
});

app.get("/sv/data3", (req, res) => {
    res.sendFile(path.join(__dirname, "Sinhvien/data3.js"));
});

app.get("/sv/data4", (req, res) => {
    res.sendFile(path.join(__dirname, "Sinhvien/data4.js"));
});

// Tutor JS files
app.get("/tutor/data", (req, res) => {
    res.sendFile(path.join(__dirname, "Tutor/data.js"));
});

app.get("/tutor/data2", (req, res) => {
    res.sendFile(path.join(__dirname, "Tutor/data2.js"));
});


app.use('/Video_m3u8', express.static(path.join(__dirname, 'Sinhvien/Video_m3u8')));



// --- Khởi động Server ---
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
    console.log(`Các đường dẫn mẫu (HTML):`);
    console.log(`- PDT: http://localhost:${port}/pdt/home`);
    console.log(`- Sinh viên: http://localhost:${port}/sv/home`);
    console.log(`- Tư vấn viên: http://localhost:${port}/tutor/home`);
});