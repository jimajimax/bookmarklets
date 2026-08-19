/**
 * @name 小窓表示
 * @description 現在のページを右下に300×250pxの新しいウィンドウで開きます。スマホなどモバイルデバイスは出来ない場合があります
 * @category utility
 * @keywords window, popup
 * @version 1.0
 * @enable true
 * @created_at 2026-08-20
 * @updated_at 2026-08-20
 */

javascript:window.open(
    location.href,
    "",
    "left=9999,top=9999,width=300,height=250"
);
