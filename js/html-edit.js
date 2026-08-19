/**
 * @name Webページ編集
 * @description Webページの編集モードをON/OFFします
 * @category utility
 * @keywords edit, html
 * @version 1.0
 * @enable true
 * @created_at 2026-08-20
 * @updated_at 2026-08-20
 */

(function () {
    let isEditable = document.body.contentEditable === "true";
    document.body.contentEditable = isEditable ? "false" : "true";
    document.designMode = isEditable ? "off" : "on";
    document.body.spellcheck = !isEditable;
})();
