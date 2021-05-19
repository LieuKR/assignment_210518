// 서버에서 댓글이 작성될 때 도배 여부 체크하는 함수
const MySqlHandler = require('./MySqlHandler.js');

let limit_number = 3;

exports.check = function (userid){
    MySqlHandler.DB.query(`SELECT writer FROM \`comments\` ORDER BY \`no\` DESC limit ${limit_number}`,
      (err, rows) => {
        let i = 0;
        while(i < rows.length){
            if(rows[i].writer !== userid){
                return true;
            } else {
                i = i + 1;
            }
        }
        if(i == rows.length){
            return false;
        }
    });
};