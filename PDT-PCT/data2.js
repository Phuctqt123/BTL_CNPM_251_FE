// data2.js – API giả lập chi tiết buổi tư vấn (Phòng Đào Tạo)
import PDTApi from "../api/PDTAPI.js";

async function getEventDetailById(eventId) {
  try {
    // Gọi API của PDTApi
    const result = await PDTApi.getDetailSession(eventId);

    if (!result || result.length === 0) {
      throw new Error("Không tìm thấy buổi tư vấn");
    }

    // Lấy thông tin chính của buổi
    const sessionData = result[0];

    const buoiInfo = sessionData.Buoi_info;
    const taiLieu = sessionData.Tai_lieu || [];
    const danhSachSV = sessionData.Danh_sach_SV || [];

    // Chuyển dữ liệu về dạng thuận tiện cho render
    const details = [
      { icon: "fas fa-user-tie",        label: "Giảng viên",      value: buoiInfo.GiangVien_Ho_ten },
      { icon: "fas fa-calendar-alt",    label: "Ngày diễn ra",    value: new Date(buoiInfo.thoi_gian_bat_dau).toLocaleDateString("vi-VN") },
      { icon: "fas fa-clock",           label: "Thời gian",       value: `${new Date(buoiInfo.thoi_gian_bat_dau).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(buoiInfo.thoi_gian_ket_thuc).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` },
      { icon: "fas fa-map-marker-alt",  label: "Địa điểm",        value: buoiInfo.dia_chi || "Online"},
      { icon: "fas fa-users",           label: "Số lượng đăng ký", value: `${danhSachSV.length}/${buoiInfo.so_luong_toi_da}` },
      { icon: "fas fa-check-circle",    label: "Trạng thái",      value: buoiInfo.trang_thai }
    ];

    // Tài liệu buổi học
    const documents = taiLieu.map(doc => ({
      name: doc.filename,
      ngay_tao: doc.ngay_tao,
      tailieu_id: doc.tailieu_id
    }));

    // Trả về object chuẩn cho frontend
    return {
      title: buoiInfo.ten_buoi_van,
      details,
      documents,
      danhSachSV
    };

  } catch (err) {
    console.error("Lỗi khi lấy chi tiết buổi tư vấn:", err);
    throw err;
  }
}

// function getEventDetailById(eventId) {
//   return PDTApi.getDetailSession(eventId);
//   // return new Promise((resolve, reject) => {
//   //   setTimeout(() => {
//   //     const events = {
//   //       e1: {
//   //         title: "HƯỚNG DẪN BTL CNPM1",
//   //         details: [
//   //           { icon: "fas fa-user-tie",        label: "Giảng viên",      value: "ThS. Lê Đình Thuận" },
//   //           { icon: "fas fa-calendar-alt",   label: "Ngày diễn ra",    value: "30/10/2025" },
//   //           { icon: "fas fa-clock",          label: "Thời gian",       value: "09:00 - 10:30" },
//   //           { icon: "fas fa-map-marker-alt", label: "Địa điểm",        value: "Cơ sở 1 - H6-201" },
//   //           { icon: "fas fa-users",          label: "Số lượng đăng ký", value: "38/50" },
//   //           { icon: "fas fa-check-circle",   label: "Trạng thái",      value: "Còn chỗ" }
//   //         ],
//   //         documents: [
//   //           { name: "Hướng dẫn BTL CNPM1.pdf" },
//   //           { name: "Mẫu báo cáo nhóm.docx" },
//   //           { name: "Slide hướng dẫn.pptx" },
//   //           { name: "Danh sách nhóm.xlsx" },
//   //           { name: "Tài liệu tham khảo.zip" },
//   //           { name: "Ảnh minh họa dự án.png" },
//   //           { name: "Video hướng dẫn.mp4" },
//   //           { name: "Ghi chú quan trọng.txt" },
//   //           { name: "Thư mục mẫu dự án", isFolder: true }
//   //         ]
//   //       },
//   //       e2: {
//   //         title: "HỖ TRỢ BTL CÔNG NGHỆ PHẦN MỀM",
//   //         details: [
//   //           { icon: "fas fa-user-tie",        label: "Giảng viên",      value: "TS. Đặng Kiều Diễm" },
//   //           { icon: "fas fa-calendar-alt",   label: "Ngày diễn ra",    value: "22/11/2025" },
//   //           { icon: "fas fa-clock",          label: "Thời gian",       value: "14:00 - 16:00" },
//   //           { icon: "fas fa-map-marker-alt", label: "Địa điểm",        value: "Cơ sở 2 - B2-305" },
//   //           { icon: "fas fa-users",          label: "Số lượng đăng ký", value: "45/60" },
//   //           { icon: "fas fa-clock",          label: "Trạng thái",      value: "Còn chỗ" }
//   //         ],
//   //         documents: [
//   //           { name: "Hướng dẫn BTL CNX.pdf" },
//   //           { name: "Template báo cáo.docx" },
//   //           { name: "Slide hỗ trợ.pptx" },
//   //           { name: "Danh sách sinh viên tham gia.xlsx" }
//   //         ]
//   //       },
//   //       e3: {
//   //         title: "XỬ LÝ NGÔN NGỮ TỰ NHIÊN VÀ AI",
//   //         details: [
//   //           { icon: "fas fa-user-tie",        label: "Giảng viên",      value: "TS. Dương Hồ Nam" },
//   //           { icon: "fas fa-calendar-alt",   label: "Ngày diễn ra",    value: "24/11/2025" },
//   //           { icon: "fas fa-clock",          label: "Thời gian",       value: "18:00 - 20:30" },
//   //           { icon: "fas fa-map-marker-alt", label: "Địa điểm",        value: "Cơ sở 1 - C1-102" },
//   //           { icon: "fas fa-users",          label: "Số lượng đăng ký", value: "72/80" },
//   //           { icon: "fas fa-check-circle",   label: "Trạng thái",      value: "Đã kết thúc" }
//   //         ],
//   //         documents: [
//   //           { name: "Slide NLP & AI 2025.pptx" },
//   //           { name: "Code mẫu.ipynb" },
//   //           { name: "Dataset xử lý tiếng Việt.zip" },
//   //           { name: "Video buổi học.mp4" }
//   //         ]
//   //       }
//   //       // Thêm các buổi khác ở đây sau này...
//   //     };

//   //     if (events[eventId]) {
//   //       resolve(events[eventId]);
//   //     } else {
//   //       reject(new Error("Không tìm thấy buổi tư vấn"));
//   //     }
//   //   }, 600);
//   // });
// }
window.getEventDetailById=getEventDetailById;