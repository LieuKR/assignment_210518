// 서버에서 댓글 금지어 포함 여부 확인하는 함수

const ban_words = ['나쁜말','디게나쁜말']; // 금지어 목록은 배열로 처리
const ban_rule = new RegExp('(' + ban_words.join('|') + ')', 'g');

exports.testing = function(string){
    if (string.match(ban_rule)) return true;
};