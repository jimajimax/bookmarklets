/**
 * @name 動画フルスクリーン
 * @description ページ内の動画をフルスクリーンモードで再生します
 * @category media
 * @keywords video, fullscreen, media
 * @version 1.1
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

    const video =
        videos.find(v => !v.paused) ||
        videos.find(v => v.readyState >= 2);

    if (!video) {
        alert("動画の再生準備ができていません。");
        return;
    }

    const wasPlaying = !video.paused;

    const play = () => {
        const promise = video.play();

        if (promise && promise.catch) {
            promise.catch(() => {});
        }
    };

    const resumeIfNeeded = () => {
        if (wasPlaying && video.paused) {
            setTimeout(play, 100);
        }
    };

    if (!video._fsUniversal) {
        video._fsUniversal = true;

        video.addEventListener("webkitendfullscreen", () => {
            if (wasPlaying) {
                setTimeout(play, 330);
            }
        });

        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
                resumeIfNeeded();
            }
        });

        document.addEventListener("webkitfullscreenchange", () => {
            if (!document.webkitFullscreenElement) {
                resumeIfNeeded();
            }
        });
    }

    if (wasPlaying) {
        play();
    }

    try {
        if (video.requestFullscreen) {
            const promise = video.requestFullscreen();

            if (promise && promise.catch) {
                promise.catch(() => {});
            }

        } else if (video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen();

        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();

        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();

        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();

        } else {
            alert("このブラウザでは動画のフルスクリーンに対応していません。");
        }

    } catch (error) {
        try {
            if (video.webkitEnterFullscreen) {
                video.webkitEnterFullscreen();
            } else {
                throw error;
            }
        } catch (error2) {
            alert("[エラー]\n" + (error2.message || error2));
        }
    }
})();
