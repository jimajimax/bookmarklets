/**
 * @name グレースケール切り替え
 * @description Webページの表示をモノクロに切り替えます
 * @category utility
 * @keywords html, css, filter
 * @version 1.0
 * @enable true
 * @created_at 2026-08-20
 * @updated_at 2026-08-20
 */

(function () {
    let existingStyle = document.querySelector(".grayscale-style");
    if (existingStyle) {
        existingStyle.remove();
    } else {
        const s = document.createElement("style");
        s.innerHTML = "html{-webkit-filter:grayscale(100%);filter:grayscale(100%);}";
        s.classList.add("grayscale-style");
        document.head.appendChild(s);
    }
})();
