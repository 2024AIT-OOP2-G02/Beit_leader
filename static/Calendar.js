// シフトデータをローカルストレージに保存
function saveShiftToLocalStorage(newEvent) {
    let shiftArray = JSON.parse(localStorage.getItem("shiftArray")) || [];
    shiftArray.push(newEvent);
    localStorage.setItem("shiftArray", JSON.stringify(shiftArray));
}

// ローカルストレージからシフトデータを取得
function getShiftsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("shiftArray")) || [];
}

// データ保存処理（ボタンクリック時）
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

    const newEvent = {
        title: "シフト",
        start: start,
        end: end,
        extendedProps: {
            status: "pending",
        },
    };

    // カレンダーに直接イベントを追加
    calendar.addEvent(newEvent);

    // ローカルストレージにシフト情報を保存
    saveShiftToLocalStorage(newEvent);

    modal.close();

    console.log("イベントが追加されました:", { start, end });
    console.log("現在のshiftArray:", getShiftsFromLocalStorage());
    
}

// ページ読み込み時にローカルストレージからシフト情報を取得
document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const modal = document.getElementById("modal");

    const shifts = getShiftsFromLocalStorage();

    // カレンダーの初期化
    calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: "Asia/Tokyo",
        initialView: "dayGridMonth",
        headerToolbar: {
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,listMonth",
        },
        events: shifts, // ローカルストレージから取得したシフト情報を表示
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
        eventDidMount: function (info) {
            if (info.event.extendedProps.status === "done") {
                info.el.style.backgroundColor = "red";
            } else {
                info.el.style.backgroundColor = "yellow";
            }
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

    modal.querySelector("button").addEventListener("click", function () {
        modal.close();
    });
});
