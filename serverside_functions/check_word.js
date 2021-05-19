// 서버에서 댓글 금지어 포함 여부 확인하는 함수

let ban_words = ['나쁜말','디게나쁜말']; // 금지어 목록은 배열로 처리
let ban_rule = new RegExp(ban_words.join('|') , 'g');

exports.test = function(string){
    let ans = ban_rule.test(string)
    return ans;
};