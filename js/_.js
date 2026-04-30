/**
 * - 프로젝트에 맞게 파일명 변경
 * - 라이브러리 사용하는경우 require 옆에 라이브러리 파일명 작성, 매개변수에 라이브러리 넣어줌
 * - 모듈 require는 멤버함수만 표시
 * - this 사용 대신 ukp 상수에 this 할당 후 ukp 사용
 * - 버전 변경되는경우 생성자 내 버전도 변경
 * - 기본적으로는 모듈방식이 아닌 전역으로 불러서 사용하고 모듈방식으로 사용하는경우 `class Ukp` 를 `export default class` 로 변경
 * - `/// <reference path="{파일경로}/ukp.js" />` 주석 최상단에 입력하여 자동완성기능 사용
 * - 주석 자료형: *, array, boolean, function, number, object, string
 * - 객체설명: `{자료형} [{객체키}={기본값}]` {설명문}, 실제 값이 아닌 설명문인경우 중괄호로 감싸야함, 설명이 길어지는경우 메인주석에 작성 후 참조
 * - 사용자 정의 함수는 함수 접두어 언더바(_) 사용
 * 
 * @version 2026.04.30
 * @author ukp
 */

class Ukp {
    /**
     * - 생성자
     * 
     * require  2026.04.30 each
     * @version 2026.04.30
     * 
     * @param {object} obj       설정값
     * - `object [root=document]`      최상위요소(기본값 document)
     * - `string [storage_name="ukp"]` 스토리지 이름(기본값 ukp), 겹치는경우 설정
     */
    constructor(obj = {}) {
        const ukp = this;
        ukp.root = document;
        ukp.storage_name = "ukp";
        ukp.each(obj, function (v, k) {
            ukp[k] = v;
        });
        ukp.unique_index = 0;
        ukp.resize = {
            bool: false,
            width: 0,
            height: 0
        };
        console.log("ukp.js 2026.04.30");
    }

    /**
     * - 컨텐츠 리사이징, 오토스케일링
     * - 전체 컨텐츠 리사이징, 오토스케일링인경우 html, body 태그에 아래와 같이 설정
     * - margin:0, padding:0, height:100%, min-height:100%, overflow:hidden
     * 
     * require  2025.06.17 css find intval obj_type
     * @version 2025.06.17
     * 
     * @param   {object|string} wrap    감싸고 있는 대상 객체 또는 쿼리셀렉터
     * @param   {object|string} content 리사이징 대상 객체 또는 쿼리셀렉터
     * @param   {number}        width   리사이징 대상 원본너비
     * @param   {number}        height  리사이징 대상 원본높이
     * @returns {boolean}               true - 리사이징됨, false - 리사이징 안됨
     */
    resize_content(wrap, content, content_width, content_height) {
        const ukp = this;
        var obj_wrap = ukp.obj_type(wrap) == "string" ? ukp.find(wrap) : wrap;
        var temp = getComputedStyle(obj_wrap);
        var wrap_width = ukp.intval(temp.width);
        var wrap_height = ukp.intval(temp.height);
        var obj_content = ukp.obj_type(content) == "string" ? ukp.find(content) : content;
        if (!ukp.resize.bool) {
            ukp.resize.bool = true;
            //크기 설정
            ukp.css(obj_wrap, "width", "100%");
            ukp.css(obj_wrap, "height", "100%");
            ukp.css(obj_wrap, "min-height", "100%");
            ukp.css(obj_wrap, "margin", "0");
            ukp.css(obj_wrap, "padding", "0");
            ukp.css(obj_wrap, "border", "0");
            //가운데정렬
            ukp.css(obj_wrap, "display", "flex");
            ukp.css(obj_wrap, "justify-content", "center");
            ukp.css(obj_wrap, "align-items", "center");
            //pull-to-refresh 방지
            ukp.css(obj_wrap, "overflow", "hidden");
            ukp.css(obj_wrap, "overscroll-behavior", "contain");
            //content 설정
            ukp.css(obj_content, "position", "relative");
            ukp.css(obj_content, "width", `${content_width}px`);
            ukp.css(obj_content, "height", `${content_height}px`);
            ukp.css(obj_content, "flex", "none");
        }
        if (ukp.resize.width == wrap_width && ukp.resize.height == wrap_height) {
            return false;
        }
        ukp.resize.width = wrap_width;
        ukp.resize.height = wrap_height;
        var width = wrap_width / content_width;
        var height = wrap_height / content_height;
        ukp.css(obj_content, "transform", `scale(${width < height ? width : height})`);
        return true;
    }

    /**
     * - 배열 또는 객체 반복
     * - ukp 내에서 forEach 대신 이 함수 사용
     * 
     * require  2025.01.17
     * @version 2025.01.17
     * 
     * @param {object}   arr 배열 또는 객체
     * @param {function} fun 반복할 함수, false 리턴시 break, 첫번째 매개변수: 값, 두번째 매개변수: 키
     */
    each(arr, fun) {
        if (typeof (arr) != "object") {
            return;
        }
        var key_arr = Object.keys(arr);
        key_arr.every(function (k) {
            return fun(arr[k], k) === false ? false : true;
        });
    }

    /**
     * - querySelector
     * - ukp 내에서 document.querySelector 대신 이 함수 사용
     * 
     * require  2024.11.07
     * @version 2024.11.07
     * 
     * @param   {string} selector 셀렉터
     * @returns {object}          html 요소객체
     */
    find(selector) {
        const ukp = this;
        return ukp.root.querySelector(selector);
    }

    /**
     * - querySelectorAll
     * - ukp 내에서 document.querySelectorAll 대신 이 함수 사용
     * 
     * require  2024.11.07
     * @version 2024.11.07
     * 
     * @param   {string} selector 셀렉터
     * @returns {array}           html 요소객체리스트
     */
    find_all(selector) {
        const ukp = this;
        return ukp.root.querySelectorAll(selector);
    }

    /**
     * - addEventListener
     * - ukp 내에서 addEventListener 대신 이 함수 사용
     * 
     * require  2025.01.17 each find_all
     * @version 2025.01.17
     * 
     * @param {string}        event_name 이벤트 유형
     * @param {object|string} target     대상객체 또는 쿼리셀렉터
     * @param {function}      fun        실행함수, 첫번째 매개변수에 이벤트객체
     */
    on(event_name, target, fun) {
        const ukp = this;
        var ele = [target];
        if (typeof (target) == "string") {
            ele = ukp.find_all(target);
        }
        ukp.each(ele, function (v) {
            v.addEventListener(event_name, fun);
        });
    }

    /**
     * - 이벤트 강제실행
     * - 이벤트가 안먹히는 경우 이 소스 참고해서 html 속성에 직접 작성
     * 
     * require  2025.01.17 each find_all
     * @version 2025.01.17
     * 
     * @param {string}        event_name 이벤트 유형
     * @param {object|string} target     대상객체 또는 쿼리셀렉터
     */
    trigger(event_name, target) {
        const ukp = this;
        var ele = [target];
        if (typeof (target) == "string") {
            ele = ukp.find_all(target);
        }
        ukp.each(ele, function (v) {
            v.dispatchEvent(new Event(event_name));
        });
    }

    /**
     * - window onload
     * 
     * require  2025.01.17 on
     * @version 2025.01.17
     * 
     * @param {function} fun 실행함수, 첫번째 매개변수에 이벤트객체
     */
    load(fun) {
        const ukp = this;
        ukp.on("load", window, fun);
    }

    /**
     * - window onDOMContentLoaded
     * 
     * require  2025.01.17 on
     * @version 2025.01.17
     * 
     * @param {function} fun 실행함수, 첫번째 매개변수에 이벤트객체
     */
    ready(fun) {
        const ukp = this;
        ukp.on("DOMContentLoaded", window, fun);
    }

    /**
     * - 태그내 style 속성 변경
     * 
     * require  2025.01.17 each find_all
     * @version 2025.01.17
     * 
     * @param {object|string} target 대상객체 또는 쿼리셀렉터
     * @param {string}        key    css 속성
     * @param {string}        value  속성값, 없거나 공백인경우 해제
     */
    css(target, key, value = "") {
        const ukp = this;
        key = key.toLowerCase();
        var ele = [target];
        if (typeof (target) == "string") {
            ele = ukp.find_all(target);
        }
        ukp.each(ele, function (v) {
            var style = v.getAttribute("style");
            if (style === null) {
                style = "";
            }
            var style_arr = style.split(";");
            style = "";
            ukp.each(style_arr, function (temp) {
                var row = temp.split(":");
                var k = row[0].toLowerCase().trim();
                if (k == "" || k == key) {
                    return;
                }
                var v = row[1].trim();
                if (style != "") {
                    style += " ";
                }
                style += `${k}: ${v};`;
            });
            if (value != "") {
                if (style != "") {
                    style += " ";
                }
                style += `${key}: ${value};`;
            }
            v.setAttribute("style", style);
        });
    }

    /**
     * - input file 요소에 첨부된 파일 콜백함수 매개변수로 전달(blob문자열)
     * - 단일파일만 처리
     * - 파일 없는경우 콜백함수에 공백문자 전달
     * 
     * require  2025.01.17
     * @version 2025.01.17
     * 
     * @param {object}   ele input file 요소
     * @param {function} fun 콜백함수, 매개변수에 파일 전달
     */
    create_file(ele, fun) {
        if (ele.files[0] === undefined) {
            setTimeout(function () {
                fun("");
            }, 0);
            return;
        }
        var file_reader = new FileReader();
        file_reader.readAsDataURL(ele.files[0]);
        file_reader.onload = function (e) {
            fun(e.target.result);
        };
    }

    /**
     * - 그리기용 ctx 반환
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param   {object} canvas 캔버스
     * @returns {object}         ctx
     */
    get_draw_ctx(canvas) {
        return canvas.getContext("2d");
    }

    /**
     * - 그리기 전체 지우기
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param {object} ctx ctx
     */
    clear_draw(ctx) {
        var width = ctx.canvas.width;
        var height = ctx.canvas.height;
        ctx.clearRect(0, 0, width, height);
    }

    /**
     * - 그리기 저장
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param   {object} ctx ctx
     * @returns {string}     blob 문자열
     */
    save_draw(ctx) {
        return ctx.canvas.toDataURL();
    }

    /**
     * - 그리기 불러오기
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param {object} ctx  ctx
     * @param {string} blob blob 문자열
     */
    load_draw(ctx, blob) {
        var image = new Image();
        image.src = blob;
        image.onload = function () {
            var oper = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(image, 0, 0);
            ctx.globalCompositeOperation = oper;
        };
    }

    /**
     * - 그리기 펜설정
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param {object} ctx   ctx
     * @param {string} color 펜 색상, transparent인경우 지우개
     * @param {number} size  펜 사이즈
     */
    set_draw_pen(ctx, color, size) {
        ctx.lineCap = "round";
        ctx.lineWidth = parseInt(size);
        if (color == "transparent") {
            ctx.strokeStyle = "#000000";
            ctx.globalCompositeOperation = "destination-out";
        } else {
            ctx.strokeStyle = color;
            ctx.globalCompositeOperation = "source-over";
        }
    }

    /**
     * - 캔버스에 그리기
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param {object} ctx    ctx
     * @param {number} from_x 시작 x좌표
     * @param {number} from_y 시작 x좌표
     * @param {number} to_x   종료 x좌표
     * @param {number} to_y   종료 x좌표
     */
    draw_canvas(ctx, from_x, from_y, to_x, to_y) {
        ctx.beginPath();
        ctx.moveTo(from_x, from_y);
        ctx.lineTo(to_x, to_y);
        ctx.stroke();
    }

    /**
     * - list 요소 내용 마지막에 row 요소 추가
     * - row 를 감싸고 있는 태그는 template 태그 사용 추천
     * - 이벤트유형은 on을 뺀 이름(ex onclick -> "click")
     * 
     * require  2026.04.17 each find on
     * @version 2026.04.17
     * 
     * @param {object|string} row_target  row 감싸고있는 태그의 요소 또는 쿼리셀렉터
     * @param {object|string} list_target list 요소 또는 쿼리셀렉터
     * @param {object}        replace     `string [{변경할 문자열}]` 변경될 문자열
     * @param {object}        event       `function [{쿼리셀렉터}][{이벤트유형}]` 실행함수
     */
    append(row_target, list_target, replace = {}, event = {}) {
        const ukp = this;
        if (typeof (row_target) == "string") {
            row_target = ukp.find(row_target);
        }
        if (typeof (list_target) == "string") {
            list_target = ukp.find(list_target);
        }
        var row_html = row_target.innerHTML;
        ukp.each(replace, function (v, k) {
            row_html = row_html.replace(new RegExp(k, "g"), v);
        });
        var template = document.createElement('template');
        template.innerHTML = row_html.trim();
        var row = template.content.firstElementChild;
        list_target.appendChild(row);
        ukp.each(event, function (types, selector) {
            var elements = [];
            var temp = row.querySelectorAll(selector);
            ukp.each(temp, function (v) {
                elements.push(v);
            });
            temp = row.closest(selector);
            if (temp == row) {
                elements.push(temp);
            }
            ukp.each(elements, function (element) {
                ukp.each(types, function (fun, type) {
                    ukp.on(type, element, fun);
                });
            });
        });
    }

    /**
     * - 숫자콤마
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param   {number} num 숫자
     * @returns {string}     콤마 추가된 숫자
     */
    number_format(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * - 숫자앞에 0
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param   {number} n     숫자
     * @param   {number} width 길이
     * @returns {string}       0붙은숫자
     */
    number_pad(n, width) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    }

    /**
     * - 시간범위내 포함여부
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param   {string}  now_time   기준시간
     * @param   {string}  start_time 시작시간(공백가능)
     * @param   {string}  end_time   종료시간(공백가능)
     * @returns {boolean}            true - 범위내 존재, false - 범위내 존재안함
     */
    time_range_bool(now_time, start_time, end_time) {
        //시간 확인
        if (start_time == "" && end_time == "") {
            //시간 없는경우
            return false;
        } else if (start_time == "" && now_time > end_time) {
            //시작시간 없는경우
            return false;
        } else if (end_time == "" && now_time < start_time) {
            //종료시간 없는경우
            return false;
        } else if (start_time < end_time) {
            //시작시간이 종료시간보다 작은경우
            if (now_time < start_time || now_time > end_time) {
                return false;
            }
        } else {
            //시작시간이 종료시간보다 큰경우
            if (now_time < start_time && now_time > end_time) {
                return false;
            }
        }
        return true;
    }

    /**
     * - 뒤로가기 또는 캐시 상태 페이지인경우 함수 실행
     * 
     * require  2025.01.17 on
     * @version 2025.01.17
     * 
     * @param {function} fun 실행함수, 첫번째 매개변수에 이벤트객체
     */
    back_cache(fun) {
        const ukp = this;
        ukp.on("pageshow", window, function (e) {
            if (e.persisted || window.performance.getEntriesByType("navigation")[0].type == "back_forward") {
                fun(e);
            }
        });
    }

    /**
     * - 날짜차이
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param   {string} start_date 시작일
     * @param   {string} end_date   종료일
     * @returns {int}               차이일수
     */
    date_diff(start_date, end_date) {
        var sdt = new Date(start_date);
        var edt = new Date(end_date);
        return Math.ceil((edt.getTime() - sdt.getTime()) / (1000 * 3600 * 24));
    }

    /**
     * - 날짜연산
     * - 현지시간 기준으로 생성
     * 
     * require  2024.08.13 number_pad
     * @version 2024.08.13
     * 
     * @param   {string} datetime YYYY-mm-dd 또는 YYYY-mm-dd HH:ii:ss, 공백인경우 현재일시
     * @param   {number} num      연산숫자, 음수도 가능
     * @param   {string} name     year, month, day, hour, minute, second (뒤에 s 붙여도 가능)
     * @returns {string}          YYYY-mm-dd HH:ii:ss
     */
    date_add(datetime = "", num = 0, name = "") {
        const ukp = this;
        var date = datetime == "" ? new Date() : new Date(datetime);
        var temp = 0;
        if (name.indexOf("year") > -1) {
            temp = date.getFullYear() + num;
            date.setFullYear(temp);
        } else if (name.indexOf("month") > -1) {
            temp = date.getMonth() + num;
            date.setMonth(temp);
        } else if (name.indexOf("day") > -1) {
            temp = date.getDate() + num;
            date.setDate(temp);
        } else if (name.indexOf("hour") > -1) {
            temp = date.getHours() + num;
            date.setHours(temp);
        } else if (name.indexOf("minute") > -1) {
            temp = date.getMinutes() + num;
            date.setMinutes(temp);
        } else if (name.indexOf("second") > -1) {
            temp = date.getSeconds() + num;
            date.setSeconds(temp);
        }
        var dt = "" +
            date.getFullYear() +
            "-" +
            ukp.number_pad(date.getMonth() + 1, 2) +
            "-" +
            ukp.number_pad(date.getDate(), 2) +
            " " +
            ukp.number_pad(date.getHours(), 2) +
            ":" +
            ukp.number_pad(date.getMinutes(), 2) +
            ":" +
            ukp.number_pad(date.getSeconds(), 2);
        return dt;
    }

    /**
     * - 현재 국제표준시 반환
     * - 기본 반환형태: YYYY-mm-dd HH:ii:ss
     * 
     * require  2026.04.30 number_pad
     * @version 2026.04.30
     * 
     * @param   {boolean} short_bool true 인경우 YYYYmmddHHiiss 형태로 반환
     * @returns {string}             년월일시분초
     */
    date_utc(short_bool = false) {
        const ukp = this;
        var date = new Date();
        var dt = "" +
            date.getUTCFullYear() +
            (short_bool ? "" : "-") +
            ukp.number_pad(date.getUTCMonth() + 1, 2) +
            (short_bool ? "" : "-") +
            ukp.number_pad(date.getUTCDate(), 2) +
            (short_bool ? "" : " ") +
            ukp.number_pad(date.getUTCHours(), 2) +
            (short_bool ? "" : ":") +
            ukp.number_pad(date.getUTCMinutes(), 2) +
            (short_bool ? "" : ":") +
            ukp.number_pad(date.getUTCSeconds(), 2);
        return dt;
    }

    /**
     * - 고유번호
     * 
     * require  2024.08.13 number_pad
     * @version 2024.08.13
     * 
     * @returns {string} 고유번호
     */
    unique_id() {
        const ukp = this;
        var date = new Date();
        var unique_id = "" +
            date.getFullYear() +
            ukp.number_pad(date.getMonth() + 1, 2) +
            ukp.number_pad(date.getDate(), 2) +
            ukp.number_pad(date.getHours(), 2) +
            ukp.number_pad(date.getMinutes(), 2) +
            ukp.number_pad(date.getSeconds(), 2) +
            ukp.number_pad(date.getMilliseconds(), 3) +
            ukp.unique_index++;
        return unique_id;
    }

    /**
     * - 아이폰 여부
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @returns {boolean}
     */
    is_iphone() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/) !== null || (navigator.userAgent.match(/Mac OS X/) !== null && navigator.maxTouchPoints > 0) ? true : false;
    }

    /**
     * - 안드로이드 여부
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @returns {boolean}
     */
    is_android() {
        return navigator.userAgent.indexOf("Android") != -1 ? true : false;
    }

    /**
     * - 상위요소 기준 요소 또는 마우스 절대좌표
     * - 회전이 들어간 요소는 상위요소의 절대좌표 + 요소의 top, left 값으로 구함
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param   {object} e 요소 또는 마우스/터치 이벤트
     * @param   {object} p 상위요소
     * @returns {object}   좌표
     * - `number [x]` x좌표
     * - `number [y]` y좌표
     */
    offset(e, p) {
        var x = 0;
        var y = 0;
        //마우스
        if (typeof (e.clientX) != "undefined") {
            x = e.clientX;
            y = e.clientY;
        }
        //터치
        else if (typeof (e.touches) != "undefined") {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        //태그
        else if (typeof (e.getBoundingClientRect) != "undefined") {
            x = e.getBoundingClientRect().x;
            y = e.getBoundingClientRect().y;
        }
        var rect = p.getBoundingClientRect();
        var style = getComputedStyle(p);
        /*
            x축 기준 설명

            x: 브라우저 화면기준 대상요소의 x좌표, 대상요소.getBoundingClientRect().x 로 구할 수 있음
            rect.x: 브라우저 화면 기준 드래그영역의 x좌표, 드래그영역.getBoundingClientRect().x 로 구할 수 있음
            x - rect.x를 하면 드래그영역 기준으로 대상요소의 "x좌표"를 얻을 수 있음(확대비율 적용됨)

            style.width: 드래그영역의 원본너비
            rect.width: 드래그영역의 화면출력 너비
            style.width / rect.width를 하면 드래그영역의 "확대비율"을 얻을 수 있음

            대상요소의 "x좌표"에 "확대비율"을 곱하면 대상요소의 "원본 x좌표"를 얻을 수 있음

            parseInt(getComputedStyle(p).borderLeftWidth): 드래그영역의 왼쪽 테두리선 너비
            드래그영역의 x좌표는 테두리선 안쪽부터 시작하므로 왼쪽 테두리선 너비만큼 빼줌

        */
        var obj = {
            x: (x - rect.x) * (parseFloat(style.width) / rect.width) - parseInt(getComputedStyle(p).borderLeftWidth),
            y: (y - rect.y) * (parseFloat(style.height) / rect.height) - parseInt(getComputedStyle(p).borderTopWidth)
        };
        return obj;
    }

    /**
     * - 두 점의 기울기
     * - deg 이므로 각도값과 부호 반대
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param   {number} center_x 중심 x 좌표
     * @param   {number} center_y 중심 x 좌표
     * @param   {number} outer_x  외각 x 좌표
     * @param   {number} outer_x  외각 x 좌표
     * @returns {number}          deg
     */
    deg(center_x, center_y, outer_x, outer_y) {
        var x = outer_x - center_x;
        var y = center_y - outer_y;
        if (x == 0) {
            return y < 0 ? 270 : 90;
        }
        var deg = Math.atan(y / x) * (180 / Math.PI);
        if (x < 0) {
            deg += 180;
        } else if (y < 0) {
            deg += 360;
        }
        return -deg;
    }

    /**
     * - 한글키보드
     * 
     * require  2024.08.13 word_merge
     * @version 2024.08.13
     * 
     * @param   {string}  before_word   이미 입력되어있는 문자열
     * @param   {string}  input_word    키보드 입력값
     * @param   {boolean} keyboard_bool true: 108키보드, false: 축소키보드
     * @returns {string}                적용 문자열
     */
    keyboard(before_word, input_word, keyboard_bool) {
        const ukp = this;
        var word = before_word.slice(-1);
        before_word = before_word.slice(0, -1);
        //배열
        var index = {
            i: ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
            m: ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'],
            t: ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
        };
        var combo = {
            i: [
                ['ㄱ', 'ㅅ', 'ㄳ'],
                ['ㄴ', 'ㅈ', 'ㄵ'],
                ['ㄴ', 'ㅎ', 'ㄶ'],
                ['ㄹ', 'ㄱ', 'ㄺ'],
                ['ㄹ', 'ㅁ', 'ㄻ'],
                ['ㄹ', 'ㅂ', 'ㄼ'],
                ['ㄹ', 'ㅅ', 'ㄽ'],
                ['ㄹ', 'ㅌ', 'ㄾ'],
                ['ㄹ', 'ㅍ', 'ㄿ'],
                ['ㄹ', 'ㅎ', 'ㅀ'],
                ['ㅂ', 'ㅅ', 'ㅄ']
            ],
            m: [
                ['ㅏ', 'ㅣ', 'ㅐ'],
                ['ㅑ', 'ㅣ', 'ㅒ'],
                ['ㅓ', 'ㅣ', 'ㅔ'],
                ['ㅕ', 'ㅣ', 'ㅖ'],
                ['ㅗ', 'ㅏ', 'ㅘ'],
                ['ㅗ', 'ㅐ', 'ㅙ'],
                ['ㅗ', 'ㅣ', 'ㅚ'],
                ['ㅘ', 'ㅣ', 'ㅙ'],
                ['ㅚ', 'ㅓ', 'ㅙ'],
                ['ㅜ', 'ㅓ', 'ㅝ'],
                ['ㅜ', 'ㅔ', 'ㅞ'],
                ['ㅜ', 'ㅣ', 'ㅟ'],
                ['ㅝ', 'ㅣ', 'ㅞ'],
                ['ㅡ', 'ㅣ', 'ㅢ'],
                ['ㅣ', 'ㅓ', 'ㅐ'],
                ['ㅣ', 'ㅕ', 'ㅒ']
            ],
            t: [
                ['ㄱ', 'ㅅ', 'ㄳ'],
                ['ㄴ', 'ㅈ', 'ㄵ'],
                ['ㄴ', 'ㅎ', 'ㄶ'],
                ['ㄹ', 'ㄱ', 'ㄺ'],
                ['ㄹ', 'ㅁ', 'ㄻ'],
                ['ㄹ', 'ㅂ', 'ㄼ'],
                ['ㄹ', 'ㅅ', 'ㄽ'],
                ['ㄹ', 'ㅌ', 'ㄾ'],
                ['ㄹ', 'ㅍ', 'ㄿ'],
                ['ㄹ', 'ㅎ', 'ㅀ'],
                ['ㅂ', 'ㅅ', 'ㅄ']
            ]
        };
        if (keyboard_bool) {
            combo.m = [
                ['ㅗ', 'ㅏ', 'ㅘ'],
                ['ㅗ', 'ㅐ', 'ㅙ'],
                ['ㅗ', 'ㅣ', 'ㅚ'],
                ['ㅜ', 'ㅓ', 'ㅝ'],
                ['ㅜ', 'ㅔ', 'ㅞ'],
                ['ㅜ', 'ㅣ', 'ㅟ'],
                ['ㅡ', 'ㅣ', 'ㅢ']
            ];
        }
        //flag
        var word_code = word.slice(-1).charCodeAt(0);
        var input_word_code = input_word.charCodeAt(0);
        var word_flag = "";
        var word_arr = {
            i: "",
            m: "",
            t: ""
        };
        var input_word_arr = {
            i: "",
            m: "",
            t: ""
        };
        if (word_code >= 12593 && word_code < 12623) {
            word_flag = "i";
            word_arr.i = word;
        } else if (word_code >= 12623 && word_code < 12644) {
            if (input_word_code >= 12623 && input_word_code < 12644) {
                for (var k in combo.m) {
                    var v = combo.m[k];
                    if (v[0].charCodeAt(0) == word_code && v[1].charCodeAt(0) == input_word_code) {
                        return before_word + v[2];
                    }
                }
                return before_word + word + input_word;
            }
            return before_word + word + input_word;
            // word_flag = "m";
            // word_arr.m = word;
        } else if (word_code >= 44032 && word_code < 55204) {
            var temp_code = word.charCodeAt(0) - 44032;
            word_arr.i = index.i[parseInt((temp_code / 28) / 21)];
            word_arr.m = index.m[parseInt(temp_code / 28) % 21];
            word_arr.t = index.t[temp_code % 28];
            word_flag = word_arr.t == "" ? "m" : "t";
        } else {
            return before_word + word + input_word;
        }
        //쌍처리
        for (var i in combo[word_flag]) {
            if (combo[word_flag][i][0] == word_arr[word_flag] && combo[word_flag][i][1] == input_word) {
                word_arr[word_flag] = combo[word_flag][i][2];
                return before_word + word.slice(0, word.length - 1) + ukp.word_merge(word_arr);
            }
        }
        //자음,모음입력시 처리
        if (input_word_code >= 12593 && input_word_code < 12623) {
            if (word_flag == "i") {
                for (var i in combo.i) {
                    if (combo.i[i][0] == word_arr.i && combo.i[i][1] == input_word) {
                        return before_word + word.slice(0, word.length - 1) + combo.i[i][2];
                    }
                }
            } else if (word_flag == "m") {
                for (var i in index.t) {
                    if (index.t[i] == input_word) {
                        word_arr.t = input_word;
                        return before_word + word.slice(0, word.length - 1) + ukp.word_merge(word_arr);
                    }
                }
            }
        } else if (input_word_code >= 12623 && input_word_code < 12644) {
            //자음에 모음 붙이기
            for (var i in index.i) {
                if (index.i[i] == word_arr[word_flag]) {
                    word_arr[word_flag] = "";
                    input_word_arr.i = index.i[i];
                    input_word_arr.m = input_word;
                    return before_word + word.slice(0, word.length - 1) + ukp.word_merge(word_arr) + ukp.word_merge(input_word_arr);
                }
            }
            //자음나누기
            for (var i in combo[word_flag]) {
                if (combo[word_flag][i][2] == word_arr[word_flag]) {
                    word_arr[word_flag] = combo[word_flag][i][0];
                    input_word_arr.i = combo[word_flag][i][1];
                    input_word_arr.m = input_word;
                    return before_word + word.slice(0, word.length - 1) + ukp.word_merge(word_arr) + ukp.word_merge(input_word_arr);
                }
            }
        }
        return before_word + word + input_word;
    }

    /**
     * - 자음모음 합치기
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param   {object} word 문자열[i,m,t]
     * @returns {string}      합친결과
     */
    word_merge(word) {
        var index = {
            i: ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
            m: ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'],
            t: ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
        };
        if (word.m == "") {
            return word.i;
        }
        var arr = {
            i: 0,
            m: 0,
            t: 0
        };
        for (var i in arr) {
            for (var j in index[i]) {
                if (index[i][j] == word[i]) {
                    arr[i] = parseInt(j);
                }
            }
        }
        return String.fromCharCode((arr.i * 21 + arr.m) * 28 + arr.t + 44032);
    }

    /**
     * - 기본 contextmenu 이벤트 삭제
     * 
     * require  2025.01.17 on
     * @version 2025.01.17
     */
    default_context_off() {
        const ukp = this;
        ukp.on("contextmenu", window, function (e) {
            e.preventDefault();
        });
    }

    /**
     * - 스토리지 저장
     * - 현지시간 기준으로 저장
     * - 값은 문자열로 강제변경
     * 
     * require  2026.02.04
     * @version 2026.02.04
     * 
     * @param {string} key           키
     * @param {string} value         값
     * @param {string} expiration_dt 만기일시, 공백인경우 영구, "session" 인경우 세션스토리지
     */
    set_storage(key, value, expiration_dt = "") {
        const ukp = this;
        //로컬
        var temp = localStorage.getItem(ukp.storage_name);
        if (temp === null) {
            temp = "{}";
        }
        var storage = JSON.parse(temp);
        storage[key] = {
            value: value.toString(),
            expiration_dt: expiration_dt
        };
        localStorage.setItem(ukp.storage_name, JSON.stringify(storage));
        if (expiration_dt != "session") {
            return;
        }
        //세션
        temp = sessionStorage.getItem(ukp.storage_name);
        if (temp === null) {
            temp = "{}";
        }
        storage = JSON.parse(temp);
        storage[key] = "1";
        sessionStorage.setItem(ukp.storage_name, JSON.stringify(storage));
    }

    /**
     * - 스토리지 불러오기
     * - 현지시간 기준으로 만료
     * - 값은 문자열로 강제변경
     * 
     * require  2026.02.04 date_add each
     * @version 2026.02.04
     * 
     * @param   {string}        key 키, null인경우 전체 스토리지 
     * @returns {string|object}     값, 없는 키인경우 공백문자열
     */
    get_storage(key = null) {
        const ukp = this;
        var temp = localStorage.getItem(ukp.storage_name);
        if (temp === null) {
            temp = "{}";
        }
        var storage = JSON.parse(temp);
        temp = sessionStorage.getItem(ukp.storage_name);
        if (temp === null) {
            temp = "{}";
        }
        var session = JSON.parse(temp);
        var now_dt = ukp.date_add();
        var check = function (key) {
            if (storage[key] === undefined) {
                return null;
            }
            if (storage[key]["expiration_dt"] == "") {
                return storage[key]["value"];
            }
            if (storage[key]["expiration_dt"] == "session") {
                return session[key] === undefined ? null : storage[key]["value"];
            }
            return storage[key]["expiration_dt"] < now_dt ? null : storage[key]["value"];
        };
        var value = "";
        if (key === null) {
            var new_storage = {};
            var obj = {};
            ukp.each(storage, function (v, k) {
                value = check(k);
                if (value === null) {
                    return;
                }
                new_storage[k] = {
                    value: v["value"],
                    expiration_dt: v["expiration_dt"]
                };
                obj[k] = value;
            });
            localStorage.setItem(ukp.storage_name, JSON.stringify(new_storage));
            return obj;
        }
        value = check(key);
        if (value !== null) {
            return value;
        }
        delete storage[key];
        localStorage.setItem(ukp.storage_name, JSON.stringify(storage));
        return "";
    }

    /**
     * - 스토리지 삭제
     * 
     * require  2026.02.04
     * @version 2026.02.04
     * 
     * @param {string} key 키, null인경우 전체 스토리지 삭제
     */
    unset_storage(key = null) {
        const ukp = this;
        if (key === null) {
            localStorage.setItem(ukp.storage_name, "{}");
            return;
        }
        var temp = localStorage.getItem(ukp.storage_name);
        if (temp === null) {
            temp = "{}";
        }
        var storage = JSON.parse(temp);
        delete storage[key];
        localStorage.setItem(ukp.storage_name, JSON.stringify(storage));
    }

    /**
     * - 객체값 반환
     * - 값 없는경우 공백문자열
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @param   {object} obj 객체
     * @param   {string} key 키
     * @returns {*}          값
     */
    obj_value(obj, key) {
        return typeof (obj[key]) == "undefined" ? "" : obj[key];
    }

    /**
     * - get 파라미터에서 값 가져오기
     * - 키에 해당하는 값 없는경우 공백문자열 반환
     * 
     * require  2024.08.13 obj_value
     * @version 2024.08.13
     * 
     * @param   {string}       key 키, null인경우 배열전체
     * @returns {string|array}
     */
    get(key = null) {
        const ukp = this;
        //파라미터 객체 생성
        var query_arr = location.search.slice(1).split("&");
        var get = {};
        for (var temp of query_arr) {
            if (temp.trim() == "") {
                continue;
            }
            var row = temp.split("=");
            var temp_key = row[0].split("[")[0];
            if (typeof (get[temp_key]) == "undefined") {
                get[temp_key] = row[1];
            } else if (typeof (get[temp_key]) == "string") {
                get[temp_key] = [
                    get[temp_key],
                    row[1]
                ];
            } else {
                get[temp_key].push(row[1]);
            }
        }
        //키 공백인경우
        if (key === null) {
            return get;
        }
        return ukp.obj_value(get, key);
    }

    /**
     * - 화면 수직 여부
     * 
     * require  2024.08.13
     * @version 2024.08.13
     * 
     * @returns {boolean} true: 수직화면, false: 수평화면
     */
    is_screen_vertical() {
        return window.screen.width < window.screen.height ? true : false;
    }

    /**
     * - html 정렬변경
     * - row는 그대로 둔 상태에서 내부만 바꿈
     * 
     * require  2025.01.17 each
     * @version 2025.01.17
     * 
     * @param {object}  row     row 요소
     * @param {boolean} up_bool true: 위요소와 변경, false: 아래요소와 변경
     */
    change_html_order(row, up_bool) {
        const ukp = this;
        //target row
        var target_row = row.nextElementSibling;
        if (up_bool) {
            target_row = row.previousElementSibling;
        }
        if (target_row === null) {
            return;
        }
        //ele
        var ele = [];
        ukp.each(row.childNodes, function (v) {
            ele.push(v);
        });
        //target_ele
        var target_ele = [];
        ukp.each(target_row.childNodes, function (v) {
            target_ele.push(v);
        });
        //add ele
        ukp.each(ele, function (v) {
            target_row.appendChild(v);
        });
        //add target_ele
        ukp.each(target_ele, function () {
            row.appendChild(v);
        });
    }

    /**
     * - base64 to file
     * 
     * require  2024.11.07
     * @version 2024.11.07
     * 
     * @param   {string} base64    base64
     * @param   {string} file_name 파일명
     * @returns {object}           파일객체
     */
    btof(base64, file_name) {
        var arr = base64.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], file_name, { type: mime });
    }

    /**
     * - 객체타입 소문자로 반환
     * 
     * require  2024.11.07
     * @version 2024.11.07
     * 
     * @param   {*}      obj 객체
     * @returns {string}     소문자로 변환된 객체타입 문자열
     */
    obj_type(obj) {
        return Object.prototype.toString.call(obj).toLowerCase().replace(/[\[\]]|object /g, "");
    }

    /**
     * - ajax 전송
     * - Content-Type: multipart/form-data
     * 
     * require  2026.02.24 find obj_type on
     * @version 2026.02.24
     * 
     * @param {string}        url      url
     * @param {object|string} data     json 객체, FormData 객체, form 태그 객체, form 태그 쿼리셀렉터
     * @param {function}      com_func 완료함수, 첫번째 매개변수에 결과(text) 전달
     * @param {function}      pro_func 진행함수, 첫번째 매개변수에 퍼센트숫자 전달
     */
    ajax(url, data, com_func, pro_func = null) {
        const ukp = this;
        var type = ukp.obj_type(data);
        var form_data = data;
        //data 변환
        if (type == "string") {
            form_data = new FormData(ukp.find(data));
        } else if (type == "htmlformelement") {
            form_data = new FormData(data);
        } else if (type == "object") {
            form_data = new FormData();
            for (var k in data) {
                form_data.append(k, data[k]);
            }
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        if (pro_func !== null) {
            ukp.on("progress", xhr.upload, function (e) {
                if (!e.lengthComputable) {
                    return;
                }
                pro_func(e.loaded == e.total ? 100 : Math.floor((e.loaded * 100) / e.total));
            });
        }
        ukp.on("load", xhr, function (e) {
            com_func(e.target.response);
        });
        xhr.send(form_data);
    }

    /**
     * - ajax json 전송
     * - Content-Type: application/json
     * 
     * require  2024.11.07
     * @version 2024.11.07
     * 
     * @param {string}   url  url
     * @param {object}   json json 객체
     * @param {function} func 완료함수, 첫번째 매개변수에 결과(text) 전달
     */
    ajax_json(url, json, func) {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(json)
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            func(data);
        });
    }

    /**
     * - `foo=bar&hi=hello` 형태의 쿼리스트링 반환
     * - json 객체는 키=값 형태로 생성
     * - 매개변수가 문자열인경우 해당 쿼리셀렉터를 가진 form 태그 객체 있는지 확인
     * - form 태그 객체는 객체 내에 value 값을 가질 수 있는 요소의 name=value 형태로 생성
     * 
     * require  2026.03.09
     * @version 2026.03.09
     * 
     * @param   {object|string} target json 객체, FormData 객체, form 태그 객체, form 태그 쿼리셀렉터
     * @returns {string}               쿼리스트링
     */
    http_build_query(target) {
        const ukp = this;
        var type = ukp.obj_type(target);
        if (type == "string") {
            const element = ukp.find_all(target);
            ukp.each(element, function (v) {
                if (ukp.obj_type(v) == "htmlformelement") {
                    target = v;
                    type = "htmlformelement";
                    return false;
                }
            });
        }
        if (["formdata", "object"].includes(type)) {
            return new URLSearchParams(target).toString();
        }
        if (type == "htmlformelement") {
            const form_data = new FormData(target);
            return new URLSearchParams(form_data).toString();
        }
        return "";
    }

    /**
     * - 클래스 값 가지고 있는지 확인
     * - 쿼리셀렉터인경우 첫번째 요소만 확인
     *   
     * require  2025.01.17 each find
     * @version 2025.01.17
     * 
     * @param   {object|string} target     요소 또는 셀렉터
     * @param   {string}        class_name 확인할 클래스명
     * @returns {boolean}                  true: 클래스가 있음, false: 클래스가 없음
     */
    has_class(target, class_name) {
        const ukp = this;
        var ele = target;
        if (typeof (target) == "string") {
            ele = ukp.find(target);
        }
        var list = ele.getAttribute("class").split(" ");
        var bool = false;
        ukp.each(list, function (v) {
            if (v == class_name) {
                bool = true;
                return false;
            }
        });
        return bool;
    }

    /**
     * - 클래스 값 추가
     * 
     * require  2025.01.17 each find_all has_class
     * @version 2025.01.17
     * 
     * @param   {object|string} target     요소 또는 셀렉터
     * @param   {string}        class_name 추가할 클래스명
     */
    add_class(target, class_name) {
        const ukp = this;
        var ele = [target];
        if (typeof (target) == "string") {
            ele = ukp.find_all(target);
        }
        ukp.each(ele, function (v) {
            if (ukp.has_class(v, class_name)) {
                return;
            }
            v.setAttribute("class", v.getAttribute("class") + " " + class_name);
        });
    }

    /**
     * - 클래스 값 삭제
     * 
     * require  2025.01.17 each find_all
     * @version 2025.01.17
     * 
     * @param   {object|string} target     요소 또는 셀렉터
     * @param   {string}        class_name 삭제할 클래스명
     */
    remove_class(target, class_name) {
        const ukp = this;
        var ele = [target];
        if (typeof (target) == "string") {
            ele = ukp.find_all(target);
        }
        ukp.each(ele, function (v) {
            var list = v.getAttribute("class").split(" ");
            var str = "";
            ukp.each(list, function (v) {
                if (v == class_name) {
                    return;
                }
                str += v + " ";
            });
            v.setAttribute("class", str.trim());
        });
    }

    /**
     * - 클래스 값 없는경우 추가, 있는경우 삭제
     * 
     * require  2025.01.17 add_class each find_all has_class remove_class
     * @version 2025.01.17
     * 
     * @param   {object|string} target     요소 또는 셀렉터
     * @param   {string}        class_name 클래스명
     */
    toggle_class(target, class_name) {
        const ukp = this;
        var ele = [target];
        if (typeof (target) == "string") {
            ele = ukp.find_all(target);
        }
        ukp.each(ele, function (v) {
            if (ukp.has_class(v, class_name)) {
                ukp.remove_class(v, class_name);
            } else {
                ukp.add_class(v, class_name);
            }
        });
    }

    /**
     * - base64 디코딩
     * 
     * require  2025.03.06
     * @version 2025.03.06
     * 
     * @param   {string} text base64 문자열
     * @returns {string}      문자열
     */
    decode_base64(text) {
        var base64 = text.replace(/-/g, "+").replace(/_/g, "/");
        const bin_string = atob(base64);
        return new TextDecoder().decode(Uint8Array.from(bin_string, (m) => m.codePointAt(0)));
    }

    /**
     * - base64 인코딩
     * 
     * require  2025.03.06
     * @version 2025.03.06
     * 
     * @param   {string}  text          문자열
     * @param   {boolean} url_safe_bool url safe 여부
     * @returns {string}                base64 문자열
     */
    encode_base64(text, url_safe_bool = false) {
        const bin_string = Array.from(new TextEncoder().encode(text), (x) => String.fromCodePoint(x)).join("");
        var base64 = btoa(bin_string);
        if (url_safe_bool) {
            base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        }
        return base64;
    }

    /**
     * - 문자열 정수로 변경
     * 
     * require  2025.03.06
     * @version 2025.03.06
     * 
     * @param   {string} text 문자열
     * @returns {number}      정수
     */
    intval(text) {
        var num = parseInt(text);
        return Number.isNaN(num) ? 0 : num;
    }

    /**
     * - 문자열 실수로 변경
     * 
     * require  2025.03.06
     * @version 2025.03.06
     * 
     * @param   {string} text 문자열
     * @returns {number}      실수
     */
    floatval(text) {
        var num = parseFloat(text);
        return Number.isNaN(num) ? 0 : num;
    }

    /**
     * - 숫자값을 문자열로 변경
     * - 숫자, 문자열이 아닌경우 공백문자열 반환
     * 
     * require  2026.02.04 obj_type
     * @version 2026.02.04
     * 
     * @param   {number} num 숫자
     * @returns {string}     문자열
     */
    strval(num) {
        const ukp = this;
        var type = ukp.obj_type(num);
        var arr = ["string", "number"];
        return arr.includes(type) ? String(num) : "";
    }

    /**
     * - sha256 해시생성
     * - 비동기 함수 사용하므로 생성완료시 콜백함수에 해시값 전달
     * 
     * require  2026.04.30 obj_type
     * @version 2026.04.30
     * 
     * @param {string}   text 변환할 값
     * @param {function} func 첫번째 매개변수에 sha256 값 전달
     */
    sha256(text, func) {
        const text_buffer = new TextEncoder().encode(text);
        crypto.subtle.digest("SHA-256", text_buffer).then(function (hash_buffer) {
            const hash_array = Array.from(new Uint8Array(hash_buffer));
            const hash_hex = hash_array.map(b => b.toString(16).padStart(2, '0')).join('');
            func(hash_hex);
        });
    }
}