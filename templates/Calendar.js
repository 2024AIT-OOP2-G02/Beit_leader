document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const modal = document.getElementById('shiftModal');
    const shiftDetailsInput = document.getElementById('shiftDetails');
    const saveShiftButton = document.getElementById('saveShift');
    const closeModalButton = document.getElementById('closeModal');
    let selectedDate = null;

    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ja',
        selectable: true,
        dateClick: function (info) {
            selectedDate = info.dateStr;
            modal.style.display = 'block';
        },
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch('/get_shifts');
                const data = await response.json();
                const events = Object.entries(data).map(([date, shifts]) => {
                    return shifts.map(shift => ({
                        title: shift,
                        start: date
                    }));
                }).flat();
                successCallback(events);
            } catch (error) {
                console.error('Error fetching shifts:', error);
                failureCallback(error);
            }
        }
    });
    calendar.render();
    

    // Save shift
    saveShiftButton.addEventListener('click', async function () {
        const shiftDetails = shiftDetailsInput.value;
        if (selectedDate && shiftDetails) {
            try {
                const response = await fetch('/add_shift', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ date: selectedDate, details: shiftDetails })
                });
                if (response.ok) {
                    alert('シフトが登録されました');
                    modal.style.display = 'none';
                    shiftDetailsInput.value = '';
                    calendar.refetchEvents();
                } else {
                    alert('シフト登録中にエラーが発生しました');
                }
            } catch (error) {
                console.error('Error saving shift:', error);
                alert('シフト登録中にエラーが発生しました');
            }
        } else {
            alert('シフト詳細を入力してください');
        }
    });

    // Close modal
    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });
});
