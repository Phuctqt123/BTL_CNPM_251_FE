// data3.js – mô phỏng API trả về danh sách sự kiện
import StudentApi from "../api/StudentAPI.js";

function convertStatus(item) {
  if (!item) return "available";

  if (item.Da_day_cho === true) return "full";

  if (item.So_luong_dang_ky >= item.So_luong_toi_da) return "full";

  if (item.Thoi_gian_ket_thuc) {
    const now = new Date();
    const endTime = new Date(item.Thoi_gian_ket_thuc);
    if (now > endTime) return "ended";
  }

  return "available";
}

async function getEvents() {
  try {
    const data = await StudentApi.getUpComing();
    const list = Array.isArray(data) ? data : [];

    let registeredList = [];
    try {
      const registeredData = await StudentApi.getRegisteredList(window.thongtin.keyuser);
      if(Array.isArray(registeredData)) registeredList = registeredData.map(r => String(r.BuoiTuVan_id));
    } catch (error) {
      console.error("Không lấy được danh sách đã đăng ký để đối chiếu", error);
    }

    const mappedList = list.map(item => {
      let locationDisplay = item.Dia_chi;
      if (!locationDisplay || locationDisplay.trim() === "") {
          locationDisplay = item.Hinh_thuc || "Online"; 
      }

      // Xử lý giờ: Cắt chuỗi ISO "2026-01-10T11:00:00" -> lấy "11:00"
      const startTime = item.Thoi_gian_bat_dau ? item.Thoi_gian_bat_dau.split('T')[1].substring(0, 5) : "--";
      const endTime = item.Thoi_gian_ket_thuc ? item.Thoi_gian_ket_thuc.split('T')[1].substring(0, 5) : "--";
      const dateDisplay = item.Thoi_gian_bat_dau ? item.Thoi_gian_bat_dau.split('T')[0] : "--";

      let finalStatus = convertStatus(item);

      if (registeredList.includes(String(item.BuoiTuVan_id))) finalStatus = "registered";

      return {
        id: item.BuoiTuVan_id,
        title: item.Ten_buoi_van,
        instructor: item.GiangVien_Ho_ten,
        date: dateDisplay,
        location: locationDisplay,
        time: `${startTime} - ${endTime}`,
        status: finalStatus
      };
    });
    return mappedList.filter(item => item.status !== 'registered');
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sự kiện:", error);
    return [];
  }
}
// Hàm giả lập gọi API (có delay 300ms để giống thật)
// function getEvents() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const eventsData = [
//         {
//           id: "e1",
//           title: "HƯỚNG DẪN BTL CNPM",
//           instructor: "Lê Đình Thuận",
//           date: "30/10/2025",
//           location: "cơ sở 1 H6-201",
//           time: "9h-10h",
//           status: "registered"
//         },
//         {
//           id: "e2",
//           title: "HỖ TRỢ BTL CNX",
//           instructor: "Đặng Kiều Diễm",
//           date: "22/11/2025",
//           location: "Cơ sở 2 B2-305",
//           time: "14h-16h",
//           status: "available"
//         },
//         {
//           id: "e3",
//           title: "XỬ LÝ NGÔN NGỮ TỰ NHIÊN",
//           instructor: "Dương Hồ Nam",
//           date: "24/11/2025",
//           location: "cơ sở 1 C1-102",
//           time: "18h-20h",
//           status: "ended"
//         },
//         {
//           id: "e4",
//           title: "MỞ RỘNG MẠNG MÁY TÍNH",
//           instructor: "Nguyễn Phương Duy",
//           date: "19/11/2025",
//           location: "cơ sở 3 D3-401",
//           time: "13h-15h",
//           status: "full"
//         }
//       ];
//       resolve(eventsData);
//     }, 300); // delay 300ms giống gọi API thật
//   });
// }

function checkTime(targetEvent, allEvents) {
  if(!targetEvent.Thoi_gian_bat_dau || !targetEvent.Thoi_gian_ket_thuc) return false;

  const newStart = new Date(targetEvent.Thoi_gian_bat_dau).getTime();
  const newEnd = new Date(targetEvent.Thoi_gian_ket_thuc).getTime();

  if (isNaN(newStart) || isNaN(newEnd)) return null;

  const registeredEvents = allEvents.filter(e => e.status === 'registered');

  for (const event of registeredEvents) {
    if (event.id === targetEvent.id) continue;

    if (!event.Thoi_gian_bat_dau || !event.Thoi_gian_ket_thuc) continue;

    const existingStart = new Date(event.Thoi_gian_bat_dau).getTime();
    const existingEnd = new Date(event.Thoi_gian_ket_thuc).getTime();

    if (newStart < existingEnd && newEnd > existingStart) {
      return event;
    }
  }
  return null;
}

async function signupEvent(eventId) {
  const currentEvents = window.eventsData || [];
  const targetEvent = currentEvents.find(e => e.id == eventId);

  if (!targetEvent) {
    alert('Không tìm thấy thông tin buổi tư vấn.');
    return;
  }

  const  conflictEvent = checkTime(targetEvent, currentEvents);
  if (conflictEvent) {
    alert(`Không thể đăng ký!\n\nBạn bị trùng lịch với buổi: "${conflictEvent}"\n(Thời gian: ${conflictEvent.time} ngày ${conflictEvent.date})`)
    return;
  }
  if (!confirm('Bạn có muốn đăng ký buổi tư vấn này không?')) {
    return;
  }
    
  try {
    const data = await StudentApi.registerSession(window.thongtin.keyuser, eventId);
    const list = Array.isArray(data) ? data[0] : data;

    if (!list || list.status === 'success') {
      alert('Đăng ký thành công! (ID: ' + eventId + ')');
      targetEvent.status = 'registered';
      const index = window.eventsData.findIndex(e => e.id == eventId);
      if (index !== -1) {
          window.eventsData.splice(index, 1);
      }
      if(typeof window.renderEvents === 'function') {
        window.renderEvents();
      }
      return;
    } else {
      const errorMessage = list.message || "Đăng ký không thành công (Lỗi không xác định)";
      throw new Error(errorMessage);
    }
  } catch(error) {
    console.error("Lỗi khi đăng ký:", error);
    const msg = error.message || error.response?.data?.message || "Lỗi hệ thống hoặc lớp đã đầy";
    alert('Đăng ký thất bại:' + msg)
  }
};

window.getEvents = getEvents;
window.signupEvent = signupEvent;