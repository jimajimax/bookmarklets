/**
 * @name ツイート時刻表示
 * @description X / Twitterの投稿のツイート時刻をミリ秒まで表示します
 * @category other
 * @keywords x, twitter
 * @version 1.1
 * @enable true
 * @created_at 2026-08-18
 * @updated_at 2026-08-18
 */

(function () {
   if (!/^(x\.com|twitter\.com)$/.test(location.hostname)) {
      alert("x.comまたはtwitter.comで実行してください");
      return;
   }

   const epochTime = 1288834974657n;
   const thresholdId = 300000000000000n;
   const idMatch = location.pathname.match(/^\/([^/]+)\/status\/(\d+)/);

   if (!idMatch) {
      alert("投稿IDがURLに含まれていません。\nURLに\"status\"が含まれるようにしてください");
      return;
   }

   const userId = idMatch[1];
   const id = BigInt(idMatch[2]);

   if (id < thresholdId) {
      alert(`投稿が2010年11月4日以前のため取得できませんでした。\n${location.href}`);
      return;
   }

   const timestampMs = Number(epochTime + (id >> 22n));
   const dateObj = new Date(timestampMs);
   const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
   const dayOfWeek = daysOfWeek[dateObj.getDay()];
   const milliseconds = dateObj.getMilliseconds().toString().padStart(3, "0");
   const formattedTime = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日 (${dayOfWeek}) ${dateObj.getHours()}時${dateObj.getMinutes()}分${dateObj.getSeconds()}秒${milliseconds}`;

   alert(`URL: ${location.href}\nID: @${userId}\n投稿時刻: ${formattedTime}`);
})();
