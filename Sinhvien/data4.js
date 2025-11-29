// data4.js – Mô phỏng API trả về lịch sử đăng ký
import StudentApi from "../api/StudentAPI.js";

function convertHistoryStatus(item) {
  if (!item.Thoi_gian_ket_thuc) return "upcoming";

  const now = new Date();
  const endTime = new Date(item.Thoi_gian_ket_thuc);

  if (now > endTime) return "completed";

  return "upcoming";
}

async function getHistoryData(studentId) {
  try {
    const data = await StudentApi.getRegisteredList(studentId);
    const list = Array.isArray(data) ? data : (data.data || []);

    const mappedSession = list.map(item => {
      let locationDisplay = item.Dia_chi;
      if (!locationDisplay || locationDisplay.trim() === "") {
          locationDisplay = item.Hinh_thuc || "Online"; 
      }

      const startTime = item.Thoi_gian_bat_dau ? item.Thoi_gian_bat_dau.split('T')[1].substring(0, 5) : "--";
      const endTime = item.Thoi_gian_ket_thuc ? item.Thoi_gian_ket_thuc.split('T')[1].substring(0, 5) : "--";
      const dateDisplay = item.Thoi_gian_bat_dau ? item.Thoi_gian_bat_dau.split('T')[0] : "--";

      return {
        id: item.BuoiTuVan_id,
        title: item.Ten_buoi_van,
        status: convertHistoryStatus(item),
        lecturer: item.GiangVien_Ho_ten,
        date: dateDisplay,
        time: `${startTime} - ${endTime}`,
        location: locationDisplay,
        attendees: `${item.So_luong_dang_ky || 0} sinh viên`,
        documents: []
      };
    });

    return {sessions: mappedSession};
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử đăng ký:", error);
    return {sessions: []}
  }
}
// function getHistoryData() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const historyData = {
//         sessions: [
//           {
//             id: 1,
//             title: "Hội thảo Lập trình Web",
//             status: "completed",
//             lecturer: "Nguyễn Văn A",
//             date: "30/10/2025",
//             time: "10:00 - 13:00",
//             location: "H3 - 205",
//             attendees: "120 sinh viên",
//             documents: ["Slide_Web.pdf", "Code_mẫu.zip", "Hướng dẫn.docx"]
//           },
//           {
//             id: 2,
//             title: "Tư vấn Tuyển sinh 2026",
//             status: "upcoming",
//             lecturer: "Nguyễn Văn A",
//             date: "25/11/2025",
//             time: "14:00 - 16:00",
//             location: "H3 - 205",
//             attendees: "150 sinh viên",
//             documents: ["Thông tin tuyển sinh.pdf", "Học bổng.xlsx"]
//           },
//           {
//             id: 3,
//             title: "Hướng dẫn đồ án tốt nghiệp",
//             status: "completed",
//             lecturer: "Trần Thị B",
//             date: "15/10/2025",
//             time: "09:00 - 11:30",
//             location: "C1-301",
//             attendees: "85 sinh viên",
//             documents: ["Mẫu đề cương.docx", "Quy định đồ án.pdf", "Video hướng dẫn.mp4"]
//           },
//           {
//             id: 4,
//             title: "Hội thảo AI & Machine Learning",
//             status: "upcoming",
//             lecturer: "Phạm Văn C",
//             date: "28/11/2025",
//             time: "18:00 - 20:30",
//             location: "Phòng Hội thảo lớn - Tầng 10",
//             attendees: "200+ sinh viên",
//             documents: []
//           }
//         ]
//       };
//       resolve(historyData);
//     }, 400); // delay nhẹ để thấy loading
//   });
// }

async function cancelRegistration(sessionId)  {
  if (!confirm('Bạn có chắc chắn muốn hủy đăng ký buổi tư vấn này?')) return;

  const svKey = window.thongtin ? window.thongtin.keyuser : null;
  if (!svKey) {
    alert("Lỗi xác thực. Vui lòng tải lại trang.")
    return;
  }

  try {
    await StudentApi.cancelSession(svKey, sessionId);
    alert('Hủy đăng ký thành công! (Buổi ID: ' + sessionId + ')')
    
    if (window.historyData && window.historyData.sessions) {
      const sessionsArray = window.historyData.sessions;
      const idToRemove = String(sessionId);

      const indexToRemove = sessionsArray.findIndex(session => String(session.id) === idToRemove);

      if (indexToRemove !== -1) {
        sessionsArray.splice(indexToRemove, 1);
      }
    
      if (typeof window.renderSessions === 'function') {
        window.renderSessions(sessionsArray);
      }
    }
  } catch(error) {
    console.error("Lỗi khi hủy đăng ký:", error);
    const msg = error.response?.data?.message || "Lỗi hệ thống";
    alert('Hủy đăng ký thất bại:' + msg)
  }
}

window.getHistoryData = getHistoryData;
window.cancelRegistration = cancelRegistration;