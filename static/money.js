// バイト先と給与を分割
const locations = Object.keys(wagesData);
const salaries = Object.values(wagesData);

// Chart.jsで棒グラフを描画
const ctx = document.getElementById('salary-graph').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: locations, // バイト先
        datasets: [{
            label: '合計給与 (円)',
            data: salaries, // 給与
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '合計給与 (円)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'バイト先'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});