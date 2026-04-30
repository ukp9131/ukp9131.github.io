/// <reference path="_.js" />
// #region 전역변수
const drop_table = {
    m1: [
        { d: "19700101000000", i: ["w1", "a1"] }
    ]
};
const info = {
    w: 1,
    a: 0,
    h: 0,
    s: 0,
    r: 10,
    e: 10
};
const since = "19700101000000";
const max_node = 9999;
const data = {};
const ukp = new Ukp({
    storage_name: "diaryofthet"
});
// #endregion
// #region 함수
/**
 * - sha256
 * 
 * @param   {string} text text
 * @returns {Promise}
 */
function sha256(text) {
    return new Promise(function (resolve) {
        ukp.sha256(text, function (hash) {
            resolve(hash);
        });
    });
}
/**
 * - 0 갯수 추출
 * 
 * @param   {string} hash hash
 * @returns {number}      0 갯수
 */
function zero_cnt(hash) {
    const max_cnt = 5;
    return hash.substring(0, max_cnt).replace(/[^0]/g, '').length;
}
/**
 * - 체인 체크, async
 * 
 * @param   {object}  chain json 문자열인경우 객체로 변환하여 입력
 * @returns {boolean}       성공유무
 */
async function check_chain(chain) {
    //user
    //user가 포함되어있는 유효한 체인인지 검사
    if (!chain || typeof (chain) != "object" || typeof (chain["user"]) != "string") {
        return false;
    }
    const start_date = chain["user"].split(":")[0];
    const end_date = ukp.date_utc(true);
    //user 노드의 날짜가 올바른지 검사
    if (start_date < since || end_date < start_date) {
        return false;
    }
    //item
    const user_hash = await sha256(chain["user"]);
    const key_arr = Object.keys(info);
    let node_cnt = 0;
    for (let i = 0; i < key_arr.length; i++) {
        let k = key_arr[i];
        //item 존재하지 않는경우 다음배열 검사
        if (typeof (chain[k]) == "undefined") {
            continue;
        }
        //체인이 배열인지
        if (!Array.isArray(chain[k])) {
            return false;
        }
        //아이템 확인
        let item_hash = user_hash;
        let item_start_date = start_date;
        for (let j = 0; j < chain[k].length; j++) {
            // 해당 노드가 객체인지 확인
            if (typeof chain[k][j] != "object" || chain[k][j] == null) {
                return false;
            }
            let result = await check_item(ukp.strval(chain[k][j]["d"]), item_start_date, end_date, item_hash);
            if (!result["bool"]) {
                return false;
            }
            item_hash = result["hash"];
            item_start_date = result["date"];
            //체인이 배열인지
            if (typeof (chain[k][j]["c"]) == "undefined" || !Array.isArray(chain[k][j]["c"])) {
                return false;
            }
            //아이템강화 확인
            let node_hash = item_hash;
            let node_start_date = item_start_date;
            for (let l = 0; l < chain[k][j]["c"].length; l++) {
                result = await check_item(ukp.strval(chain[k][j]["c"][l]), node_start_date, end_date, node_hash);
                if (!result["bool"]) {
                    return false;
                }
                node_hash = result["hash"];
                node_start_date = result["date"];
            }
            node_cnt += chain[k][j]["c"].length + 1;
        }
    }
    //전체 아이템노드가 최대치 초과하는경우
    if (node_cnt > max_node) {
        return false;
    }
    return true;
}
/**
 * - 아이템 1개 체크
 * 
 * @param   {string} data       노드 데이터
 * @param   {string} start_date 시작일
 * @param   {string} end_date   종료일
 * @param   {string} hash       이전해시
 * @returns {object}            객체
 * `{boolean} bool` 체크성공여부
 * `{string}  hash` 데이터 해시
 * `{string}  date` 데이터생성 날짜
 */
async function check_item(data, start_date, end_date, hash) {
    const return_obj = {
        bool: false,
        hash: "",
        date: ""
    }
    let arr = data.split(":");
    //data 문자열 유효한 값이 아닌경우
    if (arr.length != 4) {
        return return_obj;
    }
    //item 노드 날짜가 유효하지 않은경우
    if (arr[0] < start_date || end_date < arr[0]) {
        return return_obj;
    }
    //몬스터에 대한 드랍테이블 존재확인
    if (typeof (drop_table[arr[1]]) == "undefined") {
        return return_obj;
    }
    let idx = -1;
    for (let i = 0; i < drop_table[arr[1]].length; i++) {
        if (arr[0] < drop_table[arr[1]][i]["d"]) {
            break;
        }
        idx = i;
    }
    //드랍테이블에 해당 아이템 있는지 확인
    if (idx < 0 || !drop_table[arr[1]][idx]["i"].includes(arr[2])) {
        return return_obj;
    }
    //item 노드에 이전해시가 일치하지 않는경우
    if (arr[3] != hash) {
        return return_obj;
    }
    //item 노드 해시값에 0이 있는지
    const new_hash = await sha256(data);
    if (zero_cnt(new_hash) == 0) {
        return return_obj;
    }
    return_obj["bool"] = true;
    return_obj["hash"] = new_hash;
    return_obj["date"] = arr[0];
    return return_obj;
}
// #endregion
// #region index
ukp.ready(function () {
    var storage = ukp.get_storage("data");
    if (storage != "") {
        var arr = JSON.parse(storage);
        ukp.each(arr, function (v, k) {
            data[k] = v;
        });
    }
    ukp.append(".ukpj__index_template", ".ukpj__wrap_content");
    // 이벤트 추가
    ukp.on("submit", ".ukpj__index_form", function (e) {
        e.preventDefault();
        var email = ukp.find(".ukpj__index_email").value;
        //계정등록
        if (typeof (data["user"]) == "undefined") {
            if (!confirm("현재 계정이 등록되지 않은 상태입니다. 해당 이메일로 등록하시겠습니까?")) {
                return;
            }
            var temp = [
                ukp.date_utc(true),
                email
            ];
            data["user"] = temp.join(":");
            ukp.set_storage("data", JSON.stringify(data));
        }
        //계정확인
        var temp = data["user"].split(":");
        if (email != temp[1]) {
            alert("이메일이 일치하지 않습니다.");
            return;
        }
        //체인 확인
        check_chain(data).then(function (bool) {
            console.log(bool);
        });
    });
});
// #endregion