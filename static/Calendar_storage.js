// IndexedDBでシフト情報を保存
function saveShiftToIndexedDB(newEvent) {
    const request = indexedDB.open("shiftDatabase", 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("shifts")) {
            db.createObjectStore("shifts", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("shifts", "readwrite");
        const store = transaction.objectStore("shifts");

        store.add(newEvent);
        console.log("シフト情報がIndexedDBに保存されました");
    };

    request.onerror = function () {
        console.error("IndexedDBにアクセスできませんでした");
    };
}

// IndexedDBからシフト情報を取得
function getShiftsFromIndexedDB(callback) {
    const request = indexedDB.open("shiftDatabase", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("shifts", "readonly");
        const store = transaction.objectStore("shifts");

        const getRequest = store.getAll();

        getRequest.onsuccess = function () {
            callback(getRequest.result);
        };
    };

    request.onerror = function () {
        console.error("IndexedDBにアクセスできませんでした");
    };
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

    // IndexedDBにシフト情報を保存
    saveShiftToIndexedDB(newEvent);

    modal.close();

    console.log("イベントが追加されました:", { start, end });
}

// ページ読み込み時にIndexedDBからシフト情報を取得
document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const modal = document.getElementById("modal");

    // IndexedDBからシフト情報を取得
    getShiftsFromIndexedDB(function (shifts) {
        // カレンダーの初期化
        calendar = new FullCalendar.Calendar(calendarEl, {
            timeZone: "Asia/Tokyo",
            initialView: "dayGridMonth",
            headerToolbar: {
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,listMonth",
            },
            events: shifts, // IndexedDBから取得したシフト情報を表示
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
    });
});