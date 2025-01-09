let shiftArray = [
    {
        title: "My Event",
        start: "2024-12-20T14:30:00",
        end: "2024-12-20T15:30:00",
        allDay: false,
    },
    {
        title: "Meeting",
        start: "2024-12-10T14:30:00",
        end: "2024-12-10T15:30:00",
        extendedProps: {
            status: "done",
        },
    },
    {
        title: "Birthday Party",
        start: "2024-12-12T14:30:00",
        end: "2024-12-12T15:30:00",
        backgroundColor: "green",
    },
];

let calendar; // カレンダーをグローバルに定義

function buttonClick() {
    const elem_warn_text = document.getElementById("warn-text");
    const elem_date = document.getElementById("shift-date");
    const elem_shift_in = document.getElementById("shift-in");
    const elem_shift_out = document.getElementById("shift-out");
    const modal = document.getElementById("modal");
    const date_value = elem_date.value;
    const shift_in_value = elem_shift_in.value;
    const shift_out_value = elem_shift_out.value;

    if (!date_value) {
        console.log("日付を入力");
        elem_warn_text.style.visibility = "visible";
        elem_warn_text.innerText = "日付を入力";
        return;
    }
    if (!shift_in_value) {
        console.log("開始時間を入力");
        elem_warn_text.style.visibility = "visible";
        elem_warn_text.innerText = "開始時間を入力";
        return;
    }
    if (!shift_out_value) {
        console.log("終了時間を入力");
        elem_warn_text.style.visibility = "visible";
        elem_warn_text.innerText = "終了時間を入力";
        return;
    }

    elem_warn_text.style.visibility = "hidden";
    elem_warn_text.innerText = "";

    const start = `${date_value}T${shift_in_value}:00`;
    const end = `${date_value}T${shift_out_value}:00`;

    // カレンダーに直接イベントを追加
    calendar.addEvent({
        // title: "シフト",
        uuid: self.crypto.randomUUID(),
        start: start,
        end: end,
        extendedProps: {
            status: "pending",
        },
    });
    modal.close();

    console.log("イベントが追加されました:", { start, end });
}

document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const modal = document.getElementById("modal");
    // カレンダーの初期化
    calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: "UTC",
        initialView: "dayGridMonth",
        headerToolbar: {
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,listMonth", // ユーザーが切り替え可能
        },
        events: shiftArray, // 初期イベントをセット
        showNonCurrentDates: false,
        fixedWeekCount: false,
        editable: false, // 編集の可否
        displayEventEnd: true,
        selectable: true, // 選択
        //locale: "ja",
        timeZone: "Asia/Tokyo",
        height: "100%",
        eventTimeFormat: {
            hour: "numeric",
            minute: "2-digit",
            meridiem: false,
        },
        eventDidMount: function (info) {
            if (info.event.extendedProps.status === "done") {
                info.el.style.backgroundColor = "red";
            } else {
                info.el.style.backgroundColor = "yellow";
            }
        },
        dateClick: function (info) {
            console.log("クリックした日付:", info.dateStr); // クリックされた日付をISO形式で取得
            modal.showModal();
            // alert(`選択した日付: ${info.dateStr}`);
            const dateInput = document.getElementById("shift-date");
            if (dateInput) {
                dateInput.value = info.dateStr; // 選択された日付をフォームにセット
            }
        },
        eventClick: function (info) {
            info.el.onclick = function () {
                console.log(info.event.start);
                console.log(info.event.end);
            };
        },
    });

    calendar.render();

    modal.querySelector("button").addEventListener("click", function () {
        modal.close();
    });
});
