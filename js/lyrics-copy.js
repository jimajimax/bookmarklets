/**
 * @name 歌詞コピー
 * @description 歌ネット(uta-net.com) または google検索で表示される歌詞ページから歌詞を抽出してクリップボードにコピーします
 * @category media
 * @keywords song, media, lyrics, utanet, google
 * @version 1.1
 * @enable true
 * @created_at 2026-08-18
 * @updated_at 2026-08-19
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

   function createCopyButton(text) {
      const existing = document.getElementById("__lyrics_copy_modal__");
      if (existing) existing.remove();

      const overlay = document.createElement("div");
      overlay.id = "__lyrics_copy_modal__";
      overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 999999; display: flex; align-items: center; justify-content: center;";

      const box = document.createElement("div");
      box.style.cssText = "background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); text-align: center; max-width: 90%; width: 350px; font-family: sans-serif;";

      const msg = document.createElement("p");
      msg.innerText = "下のボタンを押して歌詞をコピーしてください。";
      msg.style.cssText = "margin: 0 0 15px 0; font-size: 14px; color: #333; line-height: 1.5; white-space: pre-line;";

      const btn = document.createElement("button");
      btn.innerText = "歌詞をコピーする";
      btn.style.cssText = "background: #4f46e5; color: #fff; border: none; padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer; width: 100%; margin-bottom: 8px;";

      const closeBtn = document.createElement("button");
      closeBtn.innerText = "閉じる";
      closeBtn.style.cssText = "background: #333; color: #eee; border: none; padding: 6px; border-radius: 5px; font-size: 12px; cursor: pointer; width: 100%;";

      btn.onclick = function () {
         navigator.clipboard.writeText(text).then(function () {
            alert("歌詞をクリップボードにコピーしました🎶");
            overlay.remove();
         }).catch(function (err) {
            console.error("手動コピーERR:", err);
            // Web Share API をフォールバックとして利用
            if (navigator.share) {
               navigator.share({
                  title: "歌詞をコピー・共有",
                  text: lyricsText
               }).catch(function (shareErr) {
                  console.error("共有ERR:", shareErr);
               });
            }
         });
      };

      closeBtn.onclick = function () {
         overlay.remove();
      };

      box.appendChild(msg);
      box.appendChild(btn);
      box.appendChild(closeBtn);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
   }

   navigator.clipboard.writeText(lyricsText).then(function () {
      alert("歌詞をクリップボードにコピーしました🎶");
   }).catch(function (err) {
      console.error("コピーERR:", err);

      if (err.name === "NotAllowedError") {
         createCopyButton(lyricsText);
         return;
      }

      // Web Share API をフォールバックとして利用
      if (navigator.share) {
         navigator.share({
            title: "歌詞をコピー・共有",
            text: lyricsText
         }).catch(function (shareErr) {
            console.error("共有ERR:", shareErr);
         });
      }
   });
})();
