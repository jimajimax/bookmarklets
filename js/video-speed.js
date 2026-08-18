/**
 * @name 動画速度変更
 * @description ページ内の動画の速度を自由に変更できます。複数動画がある場合、再生中の動画が優先されます
 * @category media
 * @keywords video, media
 * @version 1.0
 * @enable true
 * @created_at 2026-08-18
 * @updated_at 2026-08-18
 */

(function () {
   const videos = [...document.querySelectorAll("video")];

   if (!videos.length) {
      alert("動画が見つかりませんでした。");
      return;
   }

   const video = videos.find(v => !v.paused) || videos.find(v => v.readyState >= 2);

   if (!video) {
      alert("動画の再生準備ができていません。");
      return;
   }

   let rate;
   while (true) {
      rate = prompt("現在の再生速度: " + video.playbackRate + "\n\n再生速度を入力してください。空入力の場合は1.0になります。(例: 2.5)\n全角・半角数字ともに使用可能です。\nスマホキーボード用に[あかさたなはまやらわ。]はそれぞれ[1234567890.]に変換されます。(例:『か。な』→『2.5』)\n※速度表示は変更されない場合があります。");
      if (rate === null) {
         break;
      }

      const toNumDic = { "あ": "1", "か": "2", "さ": "3", "た": "4", "な": "5", "は": "6", "ま": "7", "や": "8", "ら": "9", "わ": "0", "。": ".", "１": "1", "２": "2", "３": "3", "４": "4", "５": "5", "６": "6", "７": "7", "８": "8", "９": "9", "０": "0", "．": "." };

      let toNum = "";
      for (let j = 0; j < rate.length; j++) {
         toNum += toNumDic[rate[j]] || rate[j];
      }

      rate = toNum.trim();

      if (rate === "") {
         rate = 1.0;
      }

      if (!isNaN(parseFloat(rate))) {
         video.playbackRate = parseFloat(rate);
         break;
      } else {
         if (!confirm("無効な値です。再度入力してください。")) {
            break;
         }
      }
   }
})();
