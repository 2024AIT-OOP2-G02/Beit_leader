document.addEventListener("DOMContentLoaded", () => {
    // HTMLから月ごとの収入データを取得
    const graphContainer = document.getElementById("monthly_earnings_graph_container");
    const monthlyEarningsArray = JSON.parse(graphContainer.dataset.monthlyEarnings);

    // 月ごとの収入をオブジェクトに変換
    const monthlyEarnings = {};
    monthlyEarningsArray.forEach(entry => {
        const month = Object.keys(entry)[0]; // 月の名前を取得
        const earnings = entry[month]; // 収入を取得
        monthlyEarnings[month] = earnings; // オブジェクトに追加
    });

    // グラフを表示するためのcanvas要素を作成
    const canvas = document.createElement("canvas");
    canvas.id = "monthlyEarningsChart";
    graphContainer.appendChild(canvas);

    // Chart.jsでグラフを描画
    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
        type: "bar", // 棒グラフ
        data: {
            labels: Object.keys(monthlyEarnings), // 月のラベル
            datasets: [{
                label: "月ごとの収入",
                data: Object.values(monthlyEarnings), // 各月の収入データ
                backgroundColor: "rgba(33, 150, 243, 0.5)", // 塗りつぶしの色
                borderColor: "#2196F3", // 枠線の色
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '月',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: '収入 (円)',
                    },
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                },
            },
        },
    });
});
