/**
 * @name 歌詞コピー
 * @description www.uta-net.com または www.google.com の歌詞ページから歌詞とURLを自動で抽出してクリップボードにコピーします
 * @category media
 * @keywords song, media, lyrics, utanet, google
 * @version 1.0
 * @enable true
 * @created_at 2026-08-18
 * @updated_at 2026-08-18
 */

(function () {
   let lyricsText;

   if (location.hostname === "www.uta-net.com") {
      const kashiArea = document.getElementById("kashi_area");
      if (kashiArea) {
         lyricsText = kashiArea.innerHTML.replace(/<br\s*\/?>/gi, "\n");
      } else {
         alert("歌詞が見つかりませんでした。");
         return;
      }
   } else if (location.hostname === "www.google.com") {
      const elements = document.querySelectorAll('div[jsname="WbKHeb"]');
      if (elements.length > 0) {
         const extracted = Array.from(elements)
            .map(el =>
               el.innerHTML
                  .replace(/<br\s*\/?>/gi, "\n")
                  .replace(/<\/span\s*>/gi, "\n")
                  .replace(/<div[^>]*>/gi, "")
                  .replace(/<\/div\s*>/gi, "\n\n")
                  .replace(/<[^>]+>/g, "")
                  .replace(/\n{3,}/g, "\n\n")
                  .trim()
            )
            .join("\n\n");
         lyricsText = extracted;
      } else {
         alert("歌詞が見つかりませんでした。");
         return;
      }
   } else {
      alert('"www.uta-net.com" または "www.google.com" の歌詞ページで使用してください。');
      return;
   }

   console.log(lyricsText);

   navigator.clipboard.writeText(lyricsText).then(function () {
      alert("歌詞をクリップボードにコピーしました🎶");
   }).catch(function (err) {
      console.error("コピーERR:", err);
      
      if (err.name === "NotAllowedError") {
         alert("画面を一度タップ・クリックしてから再度実行してください。");
         return;
      }

      navigator.share({
         title: "歌詞をコピー・共有",
         text: lyricsText
      }).catch(function (shareErr) {
         console.error("共有ERR:", shareErr);
      });
   });
})();
