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

	// Chart.jsでグラフを描画
	const ctx = canvas.getContext("2d");
	new Chart(ctx, {
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
				},
			},
		},
		plugins: [
			{
				id: "centerText",
				afterDatasetsDraw(chart) {
					const { ctx } = chart;
					const datasetMeta = chart.getDatasetMeta(0);
					if (datasetMeta && datasetMeta.data[0]) {
						const bar = datasetMeta.data[0];
						const centerX = bar.x - bar.width / 2; // 棒の中央のx座標
						const centerY = bar.y; // 棒の中央のy座標

						// テキストを描画
						ctx.save();
						ctx.font = "bold 16px sans-serif";
						ctx.fillStyle = "#000"; // テキストの色
						ctx.textAlign = "center";
						ctx.textBaseline = "middle";
						ctx.fillText(`${(totalIncome/maxAmount*100).toLocaleString()}%`, centerX, centerY);
						ctx.restore();
					}
				},
			},
		],
	});
});
