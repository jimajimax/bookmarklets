/**
 * @name 動画ピクチャーインピクチャー
 * @description ページ内の動画をピクチャーインピクチャーモードで再生します。複数動画がある場合、再生中の動画が優先されます
 * @category media
 * @keywords video, picture-in-picture, pip, media
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

   const play = () => {
      const promise = video.play();

      if (promise && promise.catch) {
         promise.catch(() => { });
      }
   };
   try {
      if (!document.pictureInPictureEnabled) {
         alert("このブラウザではピクチャーインピクチャーに対応していません。");
         return;
      }

      if (document.pictureInPictureElement) {
         document.exitPictureInPicture().catch(() => { });
      } else {
         play();
         video.requestPictureInPicture().catch((error) => {
            alert("[エラー]\n" + (error.message || error));
         });
      }

   } catch (error) {
      alert("[エラー]\n" + (error.message || error));
   }
})();
