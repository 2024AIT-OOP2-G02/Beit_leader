document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const modal = document.getElementById("modal");

    // カレンダーの初期化
    const calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: "Asia/Tokyo",
        initialView: "dayGridMonth",
        headerToolbar: {
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,listMonth",
        },
        events: [], // イベントは空で初期化
        showNonCurrentDates: false,
        fixedWeekCount: false,
        editable: false,
        displayEventEnd: true,
        selectable: true,
        timeZone: "Asia/Tokyo",
        height: "100%",
        eventTimeFormat: {
            hour: "numeric",
            minute: "2-digit",
            meridiem: false,
        },
        dateClick: function (info) {
            console.log("クリックした日付:", info.dateStr);
            modal.showModal();
            const dateInput = document.getElementById("shift-date");
            if (dateInput) {
                dateInput.value = info.dateStr;
            }
        },
    });

    calendar.render();

    // モーダルの閉じるボタンのイベントリスナー
    modal.querySelector("button").addEventListener("click", function () {
        modal.close();
    });
});