// // シフトデータをローカルストレージに保存
// function saveShiftToLocalStorage(newEvent) {
//     let shiftArray = JSON.parse(localStorage.getItem("shiftArray")) || [];
//     shiftArray.push(newEvent);
//     localStorage.setItem("shiftArray", JSON.stringify(shiftArray));
// }

// // ローカルストレージからシフトデータを取得
// function getShiftsFromLocalStorage() {
//     return JSON.parse(localStorage.getItem("shiftArray")) || [];
// }

// // データ保存処理（ボタンクリック時）
// function buttonClick() {
//     const elem_warn_text = document.getElementById("warn-text");
//     const elem_date = document.getElementById("shift-date");
//     const elem_shift_in = document.getElementById("shift-in");
//     const elem_shift_out = document.getElementById("shift-out");
//     const elem_shift_shop = document.getElementById("shift-shop");
//     console.log(elem_shift_shop.value);
//     const modal = document.getElementById("modal");
//     const date_value = elem_date.value;
//     const shift_in_value = elem_shift_in.value;
//     const shift_out_value = elem_shift_out.value;

//     if (!date_value) {
//         console.log("日付を入力");
//         elem_warn_text.style.visibility = "visible";
//         elem_warn_text.innerText = "日付を入力";
//         return;
//     }
//     if (!shift_in_value) {
//         console.log("開始時間を入力");
//         elem_warn_text.style.visibility = "visible";
//         elem_warn_text.innerText = "開始時間を入力";
//         return;
//     }
//     if (!shift_out_value) {
//         console.log("終了時間を入力");
//         elem_warn_text.style.visibility = "visible";
//         elem_warn_text.innerText = "終了時間を入力";
//         return;
//     }

//     elem_warn_text.style.visibility = "hidden";
//     elem_warn_text.innerText = "";

//     const start = `${date_value}T${shift_in_value}:00`;
//     const end = `${date_value}T${shift_out_value}:00`;

//     const newEvent = {
//         title: elem_shift_shop,
//         start: start,
//         end: end,
//         extendedProps: {
//             status: "pending",
//         },
//     };

//     // カレンダーに直接イベントを追加
//     calendar.addEvent(newEvent);

//     // ローカルストレージにシフト情報を保存
//     saveShiftToLocalStorage(newEvent);

//     modal.close();

//     console.log("イベントが追加されました:", { start, end });
//     console.log("現在のshiftArray:", getShiftsFromLocalStorage());
// }

function getDataFromDB(shifts) {
    let array = [];
    for (let i = 0; i < Object.keys(shifts).length; i++) {
        const elem = shifts[i];
        array.push({
            id: elem.id,
            title: elem.title,
            start: elem.start,
            end: elem.finish,
            extendedProps: {
                status: "pending",
            },
        });
    }

    return array;
}

// ページ読み込み時にローカルストレージからシフト情報を取得
document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const shiftData = JSON.parse(calendarEl.dataset.shifts);
    const modal = document.getElementById("modal");

    const shifts = getDataFromDB(shiftData);
    console.log(shifts);
    // カレンダーの初期化
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        locale: 'ja',
        headerToolbar: {
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,listMonth",
        },
        buttonText: {
            prev: '前月',
            next: '次月',
            today: '今日',
            month: '月',
            list: 'リスト'
        },
        events: shifts,
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
            // イベントのスタイリング
            info.el.style.borderRadius = '5px';
            info.el.style.padding = '2px 5px';
            info.el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            info.el.style.border = 'none';

            if (info.event.extendedProps.status === "done") {
                info.el.style.backgroundColor = '#FFB7C5';  // 優しいピンク
                info.el.style.color = '#8B4513';  // ダークブラウン
            } else {
                info.el.style.backgroundColor = '#ADD8E6';  // 薄い水色
                info.el.style.color = '#2F4F4F';  // ダークスレートグレー
            }

            // ホバー時の色変更を設定
            info.el.addEventListener('mouseover', function () {
                if (info.event.extendedProps.status === "done") {
                    this.style.backgroundColor = '#FFC1CC';  // やや濃いピンク
                } else {
                    this.style.backgroundColor = '#B0E0E6';  // やや濃い水色
                }
            });

            info.el.addEventListener('mouseout', function () {
                if (info.event.extendedProps.status === "done") {
                    this.style.backgroundColor = '#FFB7C5';  // 元の優しいピンク
                } else {
                    this.style.backgroundColor = '#ADD8E6';  // 元の薄い水色
                }
            });
        },
        dateClick: function (info) {
            console.log("クリックした日付:", info.dateStr);
            modal.showModal();
            const dateInput = document.getElementById("shift-date");
            if (dateInput) {
                dateInput.value = info.dateStr;
            }
        },
        eventClick: function (info) {
            console.log('Event Info:', {
                id: info.event.id,
                title: info.event.title,
                start: info.event.startStr,
                end: info.event.endStr
            });

            const deleteModal = document.getElementById("delete-modal");
            const confirmDeleteBtn = document.getElementById("confirm-delete");
            const cancelDeleteBtn = document.getElementById("cancel-delete");

            if (!info.event.id) {
                console.error('シフトIDが見つかりません');
                alert('シフトIDが見つかりません');
                return;
            }

            // 削除確認モーダルを表示
            deleteModal.showModal();

            // キャンセルボタンのイベントリスナー
            const cancelHandler = () => {
                deleteModal.close();
                // イベントリスナーを削除
                cancelDeleteBtn.removeEventListener('click', cancelHandler);
                confirmDeleteBtn.removeEventListener('click', confirmHandler);
            };

            // 削除確認ボタンのイベントリスナー
            const confirmHandler = () => {
                const url = `/calendar/delete/${info.event.id}`;
                console.log('Delete URL:', url);

                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                    .then(response => {
                        console.log('Response status:', response.status);
                        if (!response.ok) {
                            return response.json().then(err => {
                                throw new Error(err.message || `HTTP error! status: ${response.status}`);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            info.event.remove();
                            console.log('シフトを削除しました');
                        } else {
                            throw new Error(data.message || 'シフトの削除に失敗しました');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('シフトの削除中にエラーが発生しました: ' + error.message);
                    })
                    .finally(() => {
                        deleteModal.close();
                        // イベントリスナーを削除
                        cancelDeleteBtn.removeEventListener('click', cancelHandler);
                        confirmDeleteBtn.removeEventListener('click', confirmHandler);
                    });
            };

            // イベントリスナーを追加
            cancelDeleteBtn.addEventListener('click', cancelHandler);
            confirmDeleteBtn.addEventListener('click', confirmHandler);
        }
    });

    calendar.render();

    // 今後の予定を表示する関数
    function displayUpcomingShifts(shifts) {
        const upcomingShiftsEl = document.getElementById('upcoming-shifts');
        const now = new Date();

        // 今日以降のシフトをフィルタリング
        const futureShifts = shifts.filter(shift => new Date(shift.start) >= now);

        // 日付ごとにシフトをグループ化
        const shiftsByDate = futureShifts.reduce((acc, shift) => {
            const startDate = new Date(shift.start);
            const dateKey = startDate.toISOString().split('T')[0];

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(shift);
            return acc;
        }, {});

        // 日付でソートして最初の5日分を取得
        const sortedDates = Object.keys(shiftsByDate)
            .sort()
            .slice(0, 5);

        upcomingShiftsEl.innerHTML = sortedDates.length > 0
            ? sortedDates.map(dateKey => {
                const shifts = shiftsByDate[dateKey];
                const startDate = new Date(shifts[0].start);
                const dateStr = startDate.toLocaleDateString('ja-JP', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short'
                });

                // 最大3件まで表示し、それ以上ある場合は省略表示
                const displayShifts = shifts.slice(0, 3);
                const remainingCount = shifts.length - 3;

                const shiftsHtml = displayShifts.map(shift => {
                    const startDate = new Date(shift.start);
                    const endDate = new Date(shift.end);
                    const timeStr = `${startDate.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })} - ${endDate.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}`;

                    return `
                        <div class="shift-schedule">
                            <div class="shift-time">${timeStr}</div>
                            <div class="shift-location">${shift.title}</div>
                        </div>
                    `;
                }).join('');

                return `
                    <div class="shift-item">
                        <div class="shift-date">${dateStr}</div>
                        <div class="shift-schedules">
                            ${shiftsHtml}
                        </div>
                        ${remainingCount > 0 ?
                        `<div class="more-shifts">他 ${remainingCount} 件...</div>` :
                        ''}
                    </div>
                `;
            }).join('')
            : '<p style="text-align: center; color: rgba(0,0,0,0.5);">予定はありません</p>';
    }

    // 初期表示
    displayUpcomingShifts(shifts);

    // カレンダーの予定が変更されたときに更新
    calendar.on('eventAdd', function () {
        displayUpcomingShifts(calendar.getEvents());
    });
    calendar.on('eventRemove', function () {
        displayUpcomingShifts(calendar.getEvents());
    });

    // モーダルの閉じるボタンのイベントリスナー
    modal.querySelector("button").addEventListener("click", function () {
        modal.close();
    });

    // フォームの送信イベントリスナー
    const form = document.querySelector(".modal-form");
    form.addEventListener("submit", function (event) {
        // event.preventDefault(); // フォームのデフォルト送信を防止
        modal.close();
    });
});
