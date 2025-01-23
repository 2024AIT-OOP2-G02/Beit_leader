document.addEventListener("DOMContentLoaded", () => {
    // HTMLからtotalIncomeを取得
    const graphContainer = document.getElementById("total_income_graph_container");
    const totalIncome = parseInt(graphContainer.dataset.totalIncome, 10);

    // グラフを表示するためのcanvas要素を作成
    const canvas = document.createElement("canvas");
    canvas.id = "incomeChart";
    graphContainer.appendChild(canvas);

    // 最大103万円を定義
    const maxAmount = 1030000;
    const warningThreshold = 1000000;

    // 虹色の色リスト
    const rainbowColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"];
    let colorIndex = 0;

    // 棒グラフの色を動的に設定
    const getBarColor = () => {
        if (totalIncome > maxAmount) {
            // 103万円以上: 虹色（点滅）
            return rainbowColors[colorIndex % rainbowColors.length];
        } else if (totalIncome > warningThreshold) {
            // 100万円以上: 赤色
            return "#FF0000";
        }
        // デフォルト（青色）
        return "#2196F3";
    };

    // チャートの設定
    const ctx = canvas.getContext("2d");
    const incomeChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["給与比較"], // ラベルを一つにして、全て同じ位置で描画
            datasets: [
                {
                    label: "現在の給与",
                    data: [totalIncome], // 現在の給与データ
                    backgroundColor: getBarColor(), // 棒グラフの色
                    borderColor: "#1976D2",
                    borderWidth: 1,
                },
                {
                    label: "103万円",
                    data: [maxAmount], // 103万円データ
                    backgroundColor: "rgba(192, 192, 192, 0.5)", // 半透明な灰色
                    borderColor: "rgba(192, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            indexAxis: "y", // 横向き棒グラフ
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    suggestedMax: Math.max(maxAmount, totalIncome), // 最大値は現在の給与または103万円
                },
                y: {
                    stacked: true, // 棒を同じ位置に重ねる設定
                },
            },
            plugins: {
                legend: {
                    display: true, // 凡例を表示
                    position: "top", // 凡例の位置を上に設定
                },
            },
        },
        plugins: [
            {
                id: "barColorEffect",
                beforeUpdate(chart) {
                    // 現在の給与データの背景色を更新
                    chart.data.datasets[0].backgroundColor = getBarColor();
                },
            },
        ],
    });

    // 虹色の点滅を開始（103万円以上のとき）
    if (totalIncome > maxAmount) {
        setInterval(() => {
            colorIndex += 1; // 次の色に進む
            incomeChart.update(); // チャートを更新
        }, 150); // 150msごとに更新
    }
});
