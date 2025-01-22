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

    // Chart.jsでグラフを描画
    const ctx = canvas.getContext("2d");

    const incomeChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["給与比較"], // ラベルを一つにして、全て同じ位置で描画
            datasets: [
                {
                    label: "103万円",
                    data: [maxAmount], // 103万円データ
                    backgroundColor: "rgba(192, 192, 192, 0.5)", // 半透明な灰色
                    borderColor: "rgba(192, 192, 192, 1)",
                    borderWidth: 1,
                },
                {
                    label: "現在の給与",
                    data: [totalIncome], // 現在の給与データ
                    backgroundColor: "#2196F3", // 現在の給与バーの色
                    borderColor: "#1976D2",
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
                    labels: {
                        color: totalIncome > warningThreshold ? "#FF0000" : "#000000", // 100万円を超えたらラベルを赤色に
                    },
                },
            },
        },
        plugins: [
            {
                id: "pachinkoBlinkEffect",
                beforeDatasetsDraw(chart) {
                    // 103万円を超えた場合にパチンコのような点滅を実現
                    if (totalIncome > maxAmount) {
                        const dataset = chart.data.datasets[1]; // 現在の給与データセット
                        const colors = ["#FF0000", "#FFFF00", "#00FF00", "#0000FF"]; // 点滅に使う色
                        let colorIndex = 0;

                        if (!chart.isBlinking) {
                            chart.isBlinking = true;
                            setInterval(() => {
                                dataset.backgroundColor = colors[colorIndex]; // 色を順番に切り替え
                                colorIndex = (colorIndex + 1) % colors.length; // 色インデックスを循環させる
                                chart.update();
                            }, 200); // 点滅速度（ミリ秒）
                        }
                    }
                },
            },
        ],
    });
});
