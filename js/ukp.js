/**
 * 프로젝트에 맞게 파일명, 모듈내용 변경해서 사용<br>
 * css 모듈은 ukp__js_module 접두어 사용, 변수명 변경시 css에도 변경적용
 * 모듈 require는 ukp__js_common 멤버함수만 표시
 * 
 * require ukp.css(2021.11.27) jquery.js, jquery.form.js, marked.js, highlight.js
 * @version 2022.04.04
 * @author ukp
 */


/**
 * ready
 */
$(document).ready(function () {
    //markdown 변경
    $(".ukp__module_texteditor").each(function () {
        var textarea = $(this).find(".ukp__js_module_textarea");
        var textarea_text = ukp__js_common.html_decode(textarea.val());
        textarea.val(textarea_text);
    });
    $(".ukp__module_markdown").each(function () {
        var markdown_text = $(this).html();
        markdown_text = markdown_text.replace(/\s*&gt;/gi, function (match) {
            return ukp__js_common.html_decode(match);
        });
        markdown_text = markdown_text.replace(/\n?```([^]*?)```\n?/gi, function (match) {
            return ukp__js_common.html_decode(match).replace(/\n/gi, "__ukp__nl__");
        });
        //nl2br
        markdown_text = markdown_text.replace(/\n/gi, "<br />\n").replace(/__ukp__nl__/gi, "\n");
        $(this).html(marked(markdown_text));
        this.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightBlock(block);
        });
    });
});

/**
 * module
 */
var ukp__js_module = {
    /**
     * 그림판 캔버스 배열(ctx, painting_bool, func)
     * 
     * @version 2021.09.07
     * @type Array
     */
    paint_canvas_arr: [],

    /**
     * alert 함수(confirm)
     * 
     * @version 2021.10.01
     * @type Array
     */
    alert_obj: {},

    /**
     * confirm 함수(confirm, cancel)
     * 
     * @version 2021.10.01
     * @type Array
     */
    confirm_obj: {},

    /**
     * .ukp__module_file
     * 파일변경
     * 썸네일 css 여기에서 변경
     * 
     * require 2022.01.03
     * @version 2022.01.03
     * 
     * @param {object} my 자기자신
     * @param {string} url 기본썸네일경로
     * @returns {undefined}
     */
    change_file: function (my, url = "") {
        //셀렉터
        var thumbnail = $(my).closest(".ukp__module_file").find(".ukp__js_module_thumbnail");
        var name = $(my).closest(".ukp__module_file").find(".ukp__js_module_name");
        //파일 없는경우
        if (typeof ($(my)[0].files[0]) == "undefined") {
            //css 변경
            if (url == "") {
                thumbnail.removeClass("ukp__active");
            } else {
                thumbnail.addClass("ukp__active");
            }
            thumbnail.css("background-image", url == "" ? "" : "url('" + url + "')");
            //파일명 텍스트 삭제
            name.html("");
            return;
        }
        var file_obj = $(my)[0].files[0];
        //파일명 변경
        name.html(file_obj.name);
        var ext = file_obj.name.split(".").slice(-1)[0];
        if (ext.toLowerCase() == "jpg" || ext.toLowerCase() == "gif" || ext.toLowerCase() == "png" || ext.toLowerCase() == "jpeg") {
            var file_reader = new FileReader();
            file_reader.readAsDataURL(file_obj);
            file_reader.onload = function (e) {
                //css 변경
                thumbnail.addClass("ukp__active");
                thumbnail.css("background-image", "url('" + e.target.result + "')");
            }
        } else {
            //css 변경
            thumbnail.removeClass("ukp__active");
            thumbnail.css("background-image", "");
    }
    },

    /**
     * .ukp__module_texteditor
     * 마크다운 토글
     * 
     * require 2021.01.05
     * @version 2021.01.05
     * 
     * @param {object} my 자기자신
     * @returns {undefined}
     */
    toggle_markdown: function (my) {
        var module_texteditor = $(my).closest(".ukp__module_texteditor");
        var div = module_texteditor.find(".ukp__js_module_markdown");
        var textarea = module_texteditor.find(".ukp__js_module_textarea");
        if ($(my).prop("checked")) {

            var markdown_text = textarea.val();
            markdown_text = markdown_text.replace(/\n?```([^]*?)```\n?/gi, function (match) {
                return match.replace(/\n/gi, "__ukp__nl__");
            });
            //nl2br
            markdown_text = markdown_text.replace(/\n/gi, "<br />\n").replace(/__ukp__nl__/gi, "\n");
            var markdown = marked(markdown_text);
            console.log(markdown);
            div.html(markdown);
            div[0].querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
            div.show();
        } else {
            div.hide();
        }
    },

    /**
     * .ukp__module_texteditor
     * 이미지 업로드 후 출력
     * 성공시 이미지경로, 실패시 공백 출력
     * 
     * require 2021.03.25 input_file_init
     * @version 2021.03.25
     * 
     * @param {object} my 자기자신
     * @param {string} name name명
     * @param {string} url 업로드url
     * @returns {undefined}
     */
    add_markdown_image: function (my, name, url) {
        var module_texteditor = $(my).closest(".ukp__module_texteditor");
        var btn = module_texteditor.find(".ukp__js_module_btn");
        var btn_label = module_texteditor.find(".ukp__js_module_btn_label");
        var textarea = module_texteditor.find(".ukp__js_module_textarea");
        var markdown = module_texteditor.find(".ukp__js_module_markdown");
        var form = module_texteditor.find(".ukp__js_module_form");

        //썸네일 없는경우
        if (typeof ($(my)[0].files[0]) == "undefined") {
            return;
        }
        var file_obj = $(my)[0].files[0];
        var ext = file_obj.name.split(".").slice(-1)[0];
        if (ext.toLowerCase() == "jpg" || ext.toLowerCase() == "gif" || ext.toLowerCase() == "png" || ext.toLowerCase() == "jpeg") {
            var form_data = new FormData();
            form_data.append(name, file_obj);
            btn.text("...");
            btn_label.attr("onclick", "return false");
            $.ajax({
                type: "post",
                enctype: "multipart/form-data",
                url: url,
                data: form_data,
                cache: false,
                contentType: false,
                processData: false,
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();

                    xhr.upload.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            btn.text("..." + percentComplete + "%");
                        }
                    }, false);

                    return xhr;
                },
                success: function (data) {
                    data = data.trim();
                    if (data == "") {
                        alert("이미지 업로드에 실패했습니다.");
                    } else {
                        var textarea_text = textarea.val() + " ![image](" + data + ")";
                        textarea.val(textarea_text);
                        var markdown_text = marked(textarea_text);
                        markdown.html(markdown_text);
                        markdown[0].querySelectorAll('pre code').forEach((block) => {
                            hljs.highlightBlock(block);
                        });
                    }
                    btn.text("이미지");
                    btn_label.removeAttr("onclick");
                    ukp__js_common.input_file_init(my);
                },
                error: function (e) {
                    alert("이미지 업로드에 실패했습니다.");
                    btn.text("이미지");
                    btn_label.removeAttr("onclick");
                    ukp__js_common.input_file_init(my);
                }
            });
        } else {
            alert("jpg, gif, png 파일만 업로드 가능합니다.");
        }
    },

    /**
     * .ukp__module_paint
     * 캔버스 초기 세팅<br>
     * 기본값 off
     * 
     * require 2021.08.24
     * @version 2021.08.24
     * 
     * @param {string} id 캔버스 id(셀렉터)
     * @param {string} on_bool true - 켜짐, false - 꺼짐
     * @param {int} width 너비(기본값: 3840)
     * @param {int} height 높이(기본값: 2160)
     * @param {function} func 그리기 종료 콜백함수(매개변수로 id_name 들어감)
     * @returns {undefined}
     */
    set_paint_canvas: function (id, on_bool, width = 3840, height = 2160, func = null) {
        const canvas = document.querySelector(id);
        //콜백함수 설정
        if (func === null) {
            func = function () {};
        }
        if (typeof (ukp__js_module.paint_canvas_arr[id_name]) == "undefined") {
            var id_name = id.substr(1);
            ukp__js_module.paint_canvas_arr[id_name] = {
                ctx: canvas.getContext("2d"),
                painting_bool: false,
                func: func
            };
        }
        //resizing
        canvas.height = height;
        canvas.width = width;
        //on, off
        if (on_bool) {
            $(id).css("pointer-events", "auto");
        } else {
            $(id).css("pointer-events", "none");
        }
        //이벤트 등록
        canvas.addEventListener("mousedown", ukp__js_module.paint_canvas_start_position);
        canvas.addEventListener("touchstart", ukp__js_module.paint_canvas_start_position);
        canvas.addEventListener("mouseup", ukp__js_module.paint_canvas_end_position);
        canvas.addEventListener("touchend", ukp__js_module.paint_canvas_end_position);
        canvas.addEventListener("mousemove", ukp__js_module.draw_paint_canvas);
        canvas.addEventListener("touchmove", ukp__js_module.draw_paint_canvas);
    },

    /**
     * .ukp__module_paint
     * 캔버스 세팅해제
     * 
     * require 2021.08.04
     * @version 2021.08.04
     * 
     * @param {string} id 캔버스 id(셀렉터)
     * @returns {undefined}
     */
    unset_paint_canvas: function (id) {
        const canvas = document.querySelector(id);
        canvas.removeEventListener("mousedown", ukp__js_module.paint_canvas_start_position);
        canvas.removeEventListener("touchstart", ukp__js_module.paint_canvas_start_position);
        canvas.removeEventListener("mouseup", ukp__js_module.paint_canvas_end_position);
        canvas.removeEventListener("touchend", ukp__js_module.paint_canvas_end_position);
        canvas.removeEventListener("mousemove", ukp__js_module.draw_paint_canvas);
        canvas.removeEventListener("touchmove", ukp__js_module.draw_paint_canvas);
    },

    /**
     * .ukp__module_paint
     * 캔버스 리사이징
     * 
     * require 2021.08.04
     * @version 2021.08.04
     * 
     * @param {string} id 캔버스 id(셀렉터)
     * @param {int} width 너비
     * @param {int} height 높이
     * @returns {undefined}
     */
    resize_paint_canvas: function (id, width, height) {
        const canvas = document.querySelector(id);
        canvas.width = width;
        canvas.height = height;
    },

    /**
     * .ukp__module_paint
     * 캔버스 켜기
     * 
     * require 2021.08.24
     * @version 2021.08.24
     * 
     * @param {string} id 캔버스 id(셀렉터)
     * @returns {undefined}
     */
    on_paint_canvas: function (id) {
        $(id).css("pointer-events", "auto");
    },

    /**
     * .ukp__module_paint
     * 캔버스 끄기
     * 
     * require 2021.08.24
     * @version 2021.08.24
     * 
     * @param {string} id 캔버스 id(셀렉터)
     * @returns {undefined}
     */
    off_paint_canvas: function (id) {
        $(id).css("pointer-events", "none");
    },

    /**
     * .ukp__module_paint
     * 캔버스 정보
     * 
     * require 2021.08.04
     * @version 2021.08.04
     * 
     * @param {string} id 캔버스 id(셀렉터)
     * @returns {object}
     */
    get_paint_canvas: function (id) {
        var id_name = id.substr(1);
        return ukp__js_module.paint_canvas_arr[id_name];
    },

    /**
     * .ukp__module_paint
     * 캔버스 지우기
     * 
     * require 2021.08.04
     * @version 2021.08.04
     * 
     * @param {string} id 캔버스 id(셀렉터)
     * @returns {undefined}
     */
    clear_paint_canvas: function (id) {
        const canvas = document.querySelector(id);
        var id_name = id.substr(1);
        ukp__js_module.paint_canvas_arr[id_name].ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    /**
     * .ukp__module_paint
     * 캔버스 저장
     * 
     * require 2021.08.04
     * @version 2021.08.04
     * 
     * @param {string} id 캔버스 id(셀렉터)
     * @returns {string} base64
     */
    save_paint_canvas: function (id) {
        const canvas = document.querySelector(id);
        return canvas.toDataURL();
    },

    /**
     * .ukp__module_paint
     * 캔버스 불러오기
     * 
     * require 2021.08.04
     * @version 2021.08.04
     * 
     * @param {string} id 캔버스 id(셀렉터)
     * @param {string} base64 base64
     * @param {int} zoom 배율
     * @returns {undefined}
     */
    load_paint_canvas: function (id, base64, zoom = 1) {
        var id_name = id.substr(1);
        var image = new Image();
        image.onload = function () {
            ukp__js_module.paint_canvas_arr[id_name].ctx.drawImage(image, 0, 0, image.width * zoom, image.height * zoom);
        };
        image.src = base64;
    },

    /**
     * .ukp__module_paint
     * 캔버스 펜 세팅
     * 
     * require 2021.09.07
     * @version 2021.09.07
     * 
     * @param {string} id 캔버스 id(셀렉터)
     * @param {string} color 색상, transparent인경우 지우개
     * @param {int} size 크기
     * @returns {undefined}
     */
    set_paint_canvas_pen: function (id, color, size) {
        var id_name = id.substr(1);
        ukp__js_module.paint_canvas_arr[id_name].ctx.lineCap = "round";
        ukp__js_module.paint_canvas_arr[id_name].ctx.lineWidth = parseInt(size);
        if (color == "transparent") {
            ukp__js_module.paint_canvas_arr[id_name].ctx.strokeStyle = "#000000";
            ukp__js_module.paint_canvas_arr[id_name].ctx.globalCompositeOperation = "destination-out";
        } else {
            ukp__js_module.paint_canvas_arr[id_name].ctx.strokeStyle = color;
            ukp__js_module.paint_canvas_arr[id_name].ctx.globalCompositeOperation = "source-over";
        }
    },

    /**
     * .ukp__module_paint
     * 그리기시작 이벤트
     * 
     * require 2021.06.30
     * @version 2021.06.30
     * 
     * @param {string} e 이벤트
     * @returns {undefined}
     */
    paint_canvas_start_position: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id_name = e.target.id;
        ukp__js_module.paint_canvas_arr[id_name].painting_bool = true;
        ukp__js_module.draw_paint_canvas(e);
    },

    /**
     * .ukp__module_paint
     * 그리기종료 이벤트
     * 
     * require 2021.08.24
     * @version 2021.08.24
     * 
     * @param {string} e 이벤트
     * @returns {undefined}
     */
    paint_canvas_end_position: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id_name = e.target.id;
        ukp__js_module.paint_canvas_arr[id_name].painting_bool = false;
        ukp__js_module.paint_canvas_arr[id_name].ctx.beginPath();
        ukp__js_module.paint_canvas_arr[id_name].func(id_name);
    },

    /**
     * .ukp__module_paint
     * 그리기
     * 
     * require 2021.09.07 get_absolute, get_mouse_absolute
     * @version 2021.09.07
     * 
     * @param {string} e 이벤트
     * @returns {undefined}
     */
    draw_paint_canvas: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id_name = e.target.id;
        var id = "#" + id_name;
        //요소절대좌표
        var pos = ukp__js_common.get_absolute(id);
        var mouse_pos = ukp__js_common.get_mouse_absolute(e);
        if (!ukp__js_module.paint_canvas_arr[id_name].painting_bool) {
            return;
        }
        if (e.type == 'touchmove' || e.type == 'mousemove') {
            ukp__js_module.paint_canvas_arr[id_name].ctx.lineTo(mouse_pos.x - pos.x, mouse_pos.y - pos.y);
        }
        ukp__js_module.paint_canvas_arr[id_name].ctx.stroke();
        ukp__js_module.paint_canvas_arr[id_name].ctx.beginPath();
        if (e.type == 'touchmove' || e.type == 'mousemove') {
            ukp__js_module.paint_canvas_arr[id_name].ctx.moveTo(mouse_pos.x - pos.x, mouse_pos.y - pos.y);
        }
    },

    /**
     * .ukp__module_alert
     * alert
     * 
     * require 2021.10.14
     * @version 2021.10.14
     * 
     * @param {string} text 텍스트
     * @param {function} confirm_func 확인시 실행함수
     * @returns {undefined}
     */
    alert: function (text, confirm_func = null) {
        if (confirm_func === null) {
            confirm_func = function () {};
        }
        ukp__js_module.alert_obj.confirm = confirm_func;
        $(".ukp__module_alert .ukp__js_module_text").html(text.replace(/\n/gi, "<br>"));
        $(".ukp__module_alert").css("opacity", "1");
        $(".ukp__module_alert").css("pointer-events", "auto");
    },

    /**
     * .ukp__module_alert
     * alert 종료함수
     * 
     * require 2021.10.14
     * @version 2021.10.14
     * 
     * @returns {undefined}
     */
    alert_end: function () {
        $(".ukp__module_alert").css("opacity", "");
        $(".ukp__module_alert").css("pointer-events", "");
        ukp__js_module.alert_obj.confirm();
    },

    /**
     * .ukp__module_confirm
     * confirm
     * 
     * require 2021.10.14
     * @version 2021.10.14
     * 
     * @param {string} text 텍스트
     * @param {function} confirm_func 확인시 실행함수
     * @param {function} cancel_func 취소시 실행함수
     * @returns {undefined}
     */
    confirm: function (text, confirm_func = null, cancel_func = null) {
        if (confirm_func === null) {
            confirm_func = function () {};
        }
        if (cancel_func === null) {
            cancel_func = function () {};
        }
        ukp__js_module.confirm_obj.confirm = confirm_func;
        ukp__js_module.confirm_obj.cancel = cancel_func;
        $(".ukp__module_confirm .ukp__js_module_text").html(text.replace(/\n/gi, "<br>"));
        $(".ukp__module_confirm").css("opacity", "1");
        $(".ukp__module_confirm").css("pointer-events", "auto");
    },

    /**
     * .ukp__module_confirm
     * confirm 종료함수
     * 
     * require 2021.10.14
     * @version 2021.10.14
     * 
     * @param {boolean} bool true: 확인, false: 취소
     * @returns {undefined}
     */
    confirm_end: function (bool) {
        $(".ukp__module_confirm").css("opacity", "");
        $(".ukp__module_confirm").css("pointer-events", "");
        if (bool) {
            ukp__js_module.confirm_obj.confirm();
        } else {
            ukp__js_module.confirm_obj.cancel();
        }
    },

    /**
     * .ukp__module_modal
     * show
     * 
     * require 2021.10.14
     * @version 2021.10.14
     * 
     * @param {object} selector 셀렉터 또는 객체
     * @returns {undefined}
     */
    show: function (selector) {
        $(selector).css("opacity", "1");
        $(selector).css("pointer-events", "auto");
    },

    /**
     * .ukp__module_modal
     * hide
     * 
     * require 2021.10.14
     * @version 2021.10.14
     * 
     * @param {object} selector 셀렉터 또는 객체
     * @returns {undefined}
     */
    hide: function (selector) {
        $(selector).css("opacity", "");
        $(selector).css("pointer-events", "");
    },

    /**
     * .ukp__module_modal
     * toggle
     * 
     * require 2021.10.14
     * @version 2021.10.14
     * 
     * @param {object} selector 셀렉터 또는 객체
     * @returns {undefined}
     */
    toggle: function (selector) {
        if ($(selector).css("opacity") == "1") {
            $(selector).css("opacity", "");
            $(selector).css("pointer-events", "");
        } else {
            $(selector).css("opacity", "1");
            $(selector).css("pointer-events", "auto");
        }
    },

    /**
     * .ukp__module_modal
     * fade_in
     * 
     * require 2021.10.14
     * @version 2021.10.14
     * 
     * @param {object} selector 셀렉터 또는 객체
     * @returns {undefined}
     */
    fade_in: function (selector, delay = 500) {
        $(selector).css("transition", "opacity " + (delay / 1000) + "s");
        $(selector).css("opacity", "1");
        $(selector).css("pointer-events", "auto");
        setTimeout(function () {
            $(selector).css("transition", "");
        }, delay);
    },

    /**
     * .ukp__module_modal
     * fade_out
     * 
     * require 2021.10.14
     * @version 2021.10.14
     * 
     * @param {object} selector 셀렉터 또는 객체
     * @returns {undefined}
     */
    fade_out: function (selector, delay = 500) {
        $(selector).css("transition", "opacity " + (delay / 1000) + "s");
        $(selector).css("opacity", "");
        $(selector).css("pointer-events", "");
        setTimeout(function () {
            $(selector).css("transition", "");
        }, delay);
    },

    /**
     * .ukp__module_modal
     * fade_toggle
     * 
     * require 2021.10.14
     * @version 2021.10.14
     * 
     * @param {object} selector 셀렉터 또는 객체
     * @returns {undefined}
     */
    fade_toggle: function (selector, delay = 500) {
        $(selector).css("transition", "opacity " + (delay / 1000) + "s");
        if ($(selector).css("opacity") == "1") {
            $(selector).css("opacity", "");
            $(selector).css("pointer-events", "");
        } else {
            $(selector).css("opacity", "1");
            $(selector).css("pointer-events", "auto");
        }
        setTimeout(function () {
            $(selector).css("transition", "");
        }, delay);
    },

    /**
     * ukp__module_text_size
     * 길이제한 문자열(16px 기준)
     * 
     * require 2021.10.27 get_absolute
     * @version 2021.10.27
     * 
     * @param {string} text 텍스트, nl2br 적용됨
     * @param {string} font 글꼴
     * @param {int} line 줄수
     * @param {int} width 너비(px)
     * @param {int} indent 들여쓰기(px)
     * @returns {string} 
     */
    max_length_text: function (text, font, line, width, indent = 0) {
        text = text.replace(/^\s+/gi, "");
        $(".ukp__module_text_size > .ukp__text").css("font-family", font);
        $(".ukp__module_text_size > .ukp__text").css("width", width + "px");
        $(".ukp__module_text_size > .ukp__text").css("text-indent", indent + "px");
        $(".ukp__module_text_size > .ukp__text").html("가");
        var rect = ukp__js_common.get_absolute(".ukp__module_text_size > .ukp__text");
        var height = rect.height;
        while (text.length > 0) {
            $(".ukp__module_text_size > .ukp__text").html(text.replace(/&/gi, "&amp;").replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/\n/gi, "<br>").replace(/ /gi, "&nbsp;"));
            rect = ukp__js_common.get_absolute(".ukp__module_text_size > .ukp__text");
            if (rect.height > height * line) {
                text = text.substr(0, text.length - 1);
            } else {
                break;
            }
        }
        if (rect.height == height * line && text.substr(-1) == "\n") {
            text = text.substr(0, text.length - 1);
        }
        return text;
    }
};

/**
 * common
 */
var ukp__js_common = {
    /**
     * 뒤로가기정보
     * 
     * @version 2020.09.28
     * @type Boolean
     */
    go_home_history_flag: false,

    /**
     * 드래그 배열(target, parent, func)
     * @version 2021.07.01
     * 
     * @type Array
     */
    drag_arr: [],

    /**
     * 드래그 객체(id_name, x, y)
     * @version 2021.07.01
     * 
     * @type Object
     */
    drag_obj: {},

    /**
     * 셀렉션 이벤트 객체(func, text, end_bool)
     * @version 2021.08.27
     * 
     * @type Object
     */
    selection_obj: {},

    /**
     * 리사이즈 배열(interval, width, height, top, bottom, left, right)
     * @version 2021.09.16
     * 
     * @type Object
     */
    resize_arr: [],

    /**
     * jsonp<br>
     * 응답이 문자열인경우 trim 처리
     * 
     * require 2022.04.04
     * @version 2022.04.04
     * 
     * @param {string} url 요청url
     * @param {object} data 요청data
     * @param {function} success 성공시 실행함수
     */
    jsonp: function (url, data, success) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'jsonp',
            data: data,
            success: function (data) {
                if (typeof (data) == "string") {
                    data = data.trim();
                }
                success(data);
            },
            complete: function (data) {
            },
            error: function (data, flag, status) {
                console.log(data.status + "\n" + status);
            }
        });
        return false;
    },

    /**
     * ajax<br>
     * 응답이 문자열인경우 trim 처리<br>
     * 응답이 application/json 인경우 data 매개변수 객체
     * 
     * require 2022.04.04
     * @version 2022.04.04
     * 
     * @param {string} url 요청url
     * @param {object} data 요청data
     * @param {function} success 성공시 실행함수
     */
    ajax: function (url, data, success) {
        $.ajax({
            url: url,
            type: 'post',
            data: data,
            success: function (data) {
                if (typeof (data) == "string") {
                    data = data.trim();
                }
                success(data);
            },
            complete: function (data) {
            },
            error: function (data, flag, status) {
                console.log(data.status + "\n" + status);
            }
        });
        return false;
    },

    /**
     * ajax form<br>
     * 응답이 문자열인경우 trim 처리<br>
     * 응답이 application/json 인경우 data 매개변수 객체
     * 
     * require 2022.04.04
     * @version 2022.04.04
     * 
     * @param {string} cla 클래스명
     * @param {function} serialize 실행전 함수(반환값 false인경우 실행중지)
     * @param {function} success 성공시 실행함수
     */
    ajax_form: function (cla, serialize, success) {
        $(cla).ajaxForm({
            beforeSerialize: function ($form, options) {
                this.submit_form = $form;
                this.submit_btn = this.submit_form.find("[type=submit]");
                this.submit_text = this.submit_btn.text();
                var result = serialize(this.submit_form);
                if (typeof (result) == "boolean") {
                    return result;
                }
            },
            beforeSubmit: function (arr, $form, options) {
                this.submit_form.find("[type=submit]").text(this.submit_text + "...");
                this.submit_form.find("[type=submit]").attr("onclick", "return false");
            },
            uploadProgress: function (event, position, total, percentComplete) {
                this.submit_form.find("[type=submit]").text(this.submit_text + "..." + percentComplete + "%");
            },
            success: function (data, flag, status, $form) {
                if (typeof (data) == "string") {
                    data = data.trim();
                }
                success(data, this.submit_form);
                this.submit_form.find("[type=submit]").text(this.submit_text);
                this.submit_form.find("[type=submit]").removeAttr("onclick");
            },
            error: function (data, flag, status, $form) {
                console.log(data.status + "\n" + status);
                this.submit_form.find("[type=submit]").text(this.submit_text);
                this.submit_form.find("[type=submit]").removeAttr("onclick");
            }
        });
        return false;
    },

    /**
     * 리스트 추가<br>
     * 변경할 값 접두어: __php__, 접미어: __
     * 
     * require 2020.09.28 
     * @version 2020.09.28
     * 
     * @param {string} row_cla row 클래스
     * @param {string} list_cla list 클래스
     * @param {object} list 리스트
     * @param {boolean} clear_bool 추가전 초기화여부
     */
    add_list: function (row_cla, list_cla, list, clear_bool = true) {
        if (clear_bool) {
            $(list_cla).html("");
        }
        for (var i in list) {
            var temp = $(row_cla).html();
            for (var j in list[i]) {
                temp = temp.replace(new RegExp("__php__" + j + "__", "g"), list[i][j]);
            }
            $(list_cla).append(temp);
        }
        return false;
    },

    /**
     * 홈 히스토리 저장 및 체크
     * 
     * require 2020.11.12 
     * @version 2020.11.12
     * 
     */
    set_home_history: function () {
        //저장
        if (typeof (sessionStorage.getItem("up__start_history_length")) != "string") {
            sessionStorage.setItem("up__start_history_length", history.length);
        }
        //체크
        if (!this.go_home_history_flag && typeof (sessionStorage.getItem("up__go_home_history_url")) == "string") {
            var url = sessionStorage.getItem("up__go_home_history_url");
            sessionStorage.removeItem("up__go_home_history_url");
            location.replace(url);
        }
        return false;
    },

    /**
     * 홈 히스토리 이동
     * 
     * require 2020.11.12
     * @version 2020.11.12
     * 
     * @param {string} url 주소
     * 
     */
    go_home_history: function (url = "") {
        var history_len = parseInt(sessionStorage.getItem("up__start_history_length")) - history.length;
        if (url != "") {
            sessionStorage.setItem("up__go_home_history_url", url);
        }
        this.go_home_history_flag = true;
        history.go(history_len);
        return false;
    },

    /**
     * 숫자콤마
     * 
     * require 2020.10.06 
     * @version 2020.10.06
     * 
     * @param {string} num 숫자
     * @returns {string} 콤마숫자
     */
    number_format: function (num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /**
     * 숫자앞에 0
     * 
     * require 2020.11.03 
     * @version 2020.11.03
     * 
     * @param {number} n 숫자
     * @param {number} width 길이
     * @returns {string} 0붙은숫자
     */
    number_pad: function (n, width) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    },

    /**
     * 시간범위내 포함여부
     * 
     * require 2020.11.03
     * @version 2020.11.03
     *
     * @param {string} now_time 기준시간
     * @param {string} start_time 시작시간(공백가능)
     * @param {string} end_time 종료시간(공백가능)
     * @returns {boolean} true - 범위내 존재, false - 범위내 존재안함
     */
    time_range_bool: function (now_time, start_time, end_time) {
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
    },

    /**
     * 뒤로가기 새로고침
     * 
     * require 2020.11.07
     * @version 2020.11.07
     *
     */
    history_reload: function () {
        if (typeof (e.persisted) != "undefined" && e.persisted) {
            location.reload();
        }
        return false;
    },

    /**
     * 이전페이지로 이동(replace)
     * 
     * require 2020.11.18
     * @version 2020.11.18
     *
     */
    history_back: function () {
        location.replace(document.referrer);
        return false;
    },

    /**
     * 파일 썸네일
     * 
     * require 2020.11.19
     * @version 2020.11.19
     * 
     * @param {string} cla 클래스명
     * @param {function} complete 완료함수, [0] - 성공여부, [1] - 썸네일
     *
     */
    file_thumbnail: function (cla, complete) {
        //썸네일 없는경우
        if (typeof ($(cla)[0].files[0]) == "undefined") {
            complete(false, "");
            return;
        }
        var file_obj = $(cla)[0].files[0];
        var ext = file_obj.name.split(".").slice(-1)[0];
        if (ext.toLowerCase() == "jpg" || ext.toLowerCase() == "gif" || ext.toLowerCase() == "png" || ext.toLowerCase() == "jpeg") {
            var file_reader = new FileReader();
            file_reader.readAsDataURL(file_obj);
            file_reader.onload = function (e) {
                complete(true, e.target.result);
            }
        } else {
            complete(false, "");
        }
        return false;
    },

    /**
     * html 정렬변경<br>
     * 정렬변경 onclick 요소에 고유클래스 대신 this 사용
     * 
     * require 2020.11.24
     * @version 2020.11.24
     * 
     * @param {string} my_cla 자신 class, 고유 class여야함
     * @param {string} other_cla 상대 class, 고유 class여야함
     * @param {array} static_cla 고정값 class
     *
     */
    change_html_order: function (my_cla, other_cla, static_cla = []) {
        //변경하려는 class 같은경우 실행안함
        if (my_cla == other_cla) {
            return false;
        }
        //static 추출
        var my_static = [];
        var other_static = [];
        for (var i in static_cla) {
            my_static.push($(my_cla).find(static_cla[i]).val());
            other_static.push($(other_cla).find(static_cla[i]).val());
        }
        //html 추출 및 변경
        var temp_html = $(my_cla).html();
        $(my_cla).html($(other_cla).html());
        $(other_cla).html(temp_html);
        //static 변경
        for (var i in static_cla) {
            $(my_cla).find(static_cla[i]).val(my_static[i]);
            $(other_cla).find(static_cla[i]).val(other_static[i]);
        }
        return false;
    },

    /**
     * 날짜차이
     * 
     * require 2020.12.15
     * @version 2020.12.15
     * 
     * @param {string} start_date 시작일
     * @param {string} end_date 종료일
     * @returns {int} 차이일수
     *
     */
    datediff: function (start_date, end_date) {
        var sdt = new Date(start_date);
        var edt = new Date(end_date);
        return Math.ceil((edt.getTime() - sdt.getTime()) / (1000 * 3600 * 24));
    },

    /**
     * html encode(&amp; &lt; &gt; &quot;)
     * 
     * require 2021.01.05
     * @version 2021.01.05
     * 
     * @param {string} html html코드
     * @param {boolean} double_encode_bool html코드
     * @returns {string} 인코딩 텍스트
     */
    html_encode: function (html, double_encode_bool = true) {
        if (!double_encode_bool) {
            html = html.replace(/&amp;/gi, "&");
        }
        return html
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&nbsp;");
    },

    /**
     * html decode(&amp; &lt; &gt; &quot;)
     * 
     * require 2021.01.05
     * @version 2021.01.05
     * 
     * @param {string} text 인코딩 텍스트
     * @returns {string} html코드
     */
    html_decode: function (text) {
        return text
                .replace(/&nbsp;/gi, "\"")
                .replace(/&gt;/gi, ">")
                .replace(/&lt;/gi, "<")
                .replace(/&amp;/gi, "&");
    },

    /**
     * 아이폰여부
     * 
     * require 2021.03.26
     * @version 2021.03.26
     * 
     * @returns {boolean}
     */
    is_iphone: function () {
        return (navigator.userAgent.indexOf("iPhone") != -1) || (navigator.userAgent.indexOf("iPod") != -1) || (navigator.userAgent.indexOf("iPad") != -1) ? true : false;
    },

    /**
     * 안드로이드여부
     * 
     * require 2021.03.26
     * @version 2021.03.26
     * 
     * @returns {boolean}
     */
    is_android: function () {
        return navigator.userAgent.indexOf("Android") != -1 ? true : false;
    },

    /**
     * file 초기화
     * 
     * require 2021.03.26
     * @version 2021.03.26
     * 
     * @param {object} file 셀렉터 또는 객체
     */
    input_file_init: function (file) {
        var agent = navigator.userAgent.toLowerCase();
        //ie인경우
        if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
            $(file).replaceWith($(file).clone(true));
        } else {
            $(file).val("");
        }
    },

    /**
     * 요소 절대좌표, 절대크기
     * 
     * require 2021.06.30
     * @version 2021.06.30
     * 
     * @param {object} selector 셀렉터 또는 객체
     * @returns {object} 절대좌표(x, y, width, height)
     */
    get_absolute: function (selector) {
        var element = $(selector)[0].getBoundingClientRect();
        return {
            x: window.pageXOffset + element.left,
            y: window.pageYOffset + element.top,
            width: element.width,
            height: element.height
        };
    },

    /**
     * 마우스 절대좌표
     * 
     * require 2021.06.30
     * @version 2021.06.30
     * 
     * @param {event} e 이벤트
     * @returns {object} 절대좌표
     */
    get_mouse_absolute: function (e) {
        var pos = {
            x: 0,
            y: 0
        };
        if (e.type == "touchstart" || e.type == "touchmove" || e.type == "touchend") {
            pos.x = e.touches[0].pageX;
            pos.y = e.touches[0].pageY;
        } else if (e.type == "mousedown" || e.type == "mousemove" || e.type == "mouseup") {
            pos.x = e.pageX;
            pos.y = e.pageY;
        }
        return pos;
    },

    /**
     * 드래그이벤트 등록<br>
     * 
     * require 2021.07.01
     * @version 2021.07.01
     * 
     * @param {string} id 아이디(셀렉터)
     * @param {string} target 대상(셀렉터)
     * @param {string} parent 부모(셀렉터)
     * @param {function} func 종료 콜백함수
     * @returns {undefined}
     */
    set_drag_event: function (id, target = "", parent = "", func = function() {}) {
        if (target == "") {
            target = $(id)[0];
        } else {
            target = $(target)[0];
        }
        if (parent == "") {
            parent = $(target).parent()[0];
        } else {
            parent = $(parent)[0];
        }
        var id_name = id.substr(1);
        const obj = document.querySelector(id);
        var target_pos = ukp__js_common.get_absolute(target);
        var parent_pos = ukp__js_common.get_absolute(parent);
        //변수설정
        ukp__js_common.drag_arr[id_name] = {
            target: target,
            parent: parent,
            func: func
        };
        //css 설정
        if ($(parent).css("position") == "static") {
            $(parent).css("position", "relative");
        }
        $(target).css("left", target_pos.x - parent_pos.x);
        $(target).css("top", target_pos.y - parent_pos.y);
        $(parent).append(target);
        $(target).css("position", "absolute");
        //이벤트 설정
        obj.addEventListener("mousedown", ukp__js_common.drag_start);
        obj.addEventListener("touchstart", ukp__js_common.drag_start);
        obj.ondragstart = function (e) {
            return false;
        }
        obj.ontouchmove = function (e) {
            e.preventDefault();
            return false;
    }
    },

    /**
     * 드래그 시작
     * 
     * require 2021.07.01
     * @version 2021.07.01
     * 
     * @param {object} e
     * @returns {undefined}
     */
    drag_start: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id_name = e.target.id;
        var parent = ukp__js_common.drag_arr[id_name].parent;
        var parent_pos = ukp__js_common.get_absolute(parent);
        var target = ukp__js_common.drag_arr[id_name].target;
        var target_pos = ukp__js_common.get_absolute(target);
        var mouse_pos = ukp__js_common.get_mouse_absolute(e);
        ukp__js_common.drag_obj = {
            id_name: id_name,
            x: parent_pos.x + (mouse_pos.x - target_pos.x),
            y: parent_pos.y + (mouse_pos.y - target_pos.y)
        };
        document.addEventListener("mousemove", ukp__js_common.drag_move);
        document.addEventListener("touchmove", ukp__js_common.drag_move);
        document.addEventListener("mouseup", ukp__js_common.drag_end);
        document.addEventListener("touchend", ukp__js_common.drag_end);
    },

    /**
     * 드래그 종료
     * 
     * require 2021.07.01
     * @version 2021.07.01
     * 
     * @param {object} e
     * @returns {undefined}
     */
    drag_end: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id_name = e.target.id;
        document.removeEventListener("mousemove", ukp__js_common.drag_move);
        document.removeEventListener("touchmove", ukp__js_common.drag_move);
        document.removeEventListener("mouseup", ukp__js_common.drag_end);
        document.removeEventListener("touchend", ukp__js_common.drag_end);
        ukp__js_common.drag_arr[id_name].func(e);
    },

    /**
     * 드래그 진행
     * 
     * require 2021.07.01
     * @version 2021.07.01
     * 
     * @param {object} e
     * @returns {undefined}
     */
    drag_move: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id_name = ukp__js_common.drag_obj.id_name;
        var target = ukp__js_common.drag_arr[id_name].target;
        var mouse_pos = ukp__js_common.get_mouse_absolute(e);
        $(target).css("left", (mouse_pos.x - ukp__js_common.drag_obj.x) + "px");
        $(target).css("top", (mouse_pos.y - ukp__js_common.drag_obj.y) + "px");
    },

    /**
     * 줌 이벤트 등록
     * 
     * require 2021.07.01
     * @version 2021.07.01
     * 
     * @param {string} id 아이디(셀렉터)
     * @param {string} target 대상(셀렉터)
     * @param {function} func 종료 콜백함수
     * @returns {undefined}
     */
    set_zoom_event: function (id, target, func = function() {}) {
        const obj = document.querySelector(id);
        var id_name = id.substr(1);
        //변수설정
        ukp__js_common.drag_arr[id_name] = {
            target: $(target)[0],
            func: func
        };
        //이벤트 설정
        obj.addEventListener("mousedown", ukp__js_common.zoom_start);
        obj.addEventListener("touchstart", ukp__js_common.zoom_start);
        obj.ondragstart = function (e) {
            return false;
        }
        obj.ontouchmove = function (e) {
            e.preventDefault();
            return false;
    }
    },

    /**
     * 줌 시작
     * 
     * require 2021.07.01
     * @version 2021.07.01
     * 
     * @param {object} e
     * @returns {undefined}
     */
    zoom_start: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id_name = e.target.id;
        var target = ukp__js_common.drag_arr[id_name].target;
        var target_pos = ukp__js_common.get_absolute(target);
        var mouse_pos = ukp__js_common.get_mouse_absolute(e);
        ukp__js_common.drag_obj = {
            id_name: id_name,
            x: mouse_pos.x - target_pos.width,
            y: mouse_pos.y - target_pos.height
        };
        document.addEventListener("mousemove", ukp__js_common.zoom_move);
        document.addEventListener("touchmove", ukp__js_common.zoom_move);
        document.addEventListener("mouseup", ukp__js_common.zoom_end);
        document.addEventListener("touchend", ukp__js_common.zoom_end);
    },

    /**
     * 줌 종료
     * 
     * require 2021.07.01
     * @version 2021.07.01
     * 
     * @param {object} e
     * @returns {undefined}
     */
    zoom_end: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id_name = e.target.id;
        document.removeEventListener("mousemove", ukp__js_common.zoom_move);
        document.removeEventListener("touchmove", ukp__js_common.zoom_move);
        document.removeEventListener("mouseup", ukp__js_common.zoom_end);
        document.removeEventListener("touchend", ukp__js_common.zoom_end);
        ukp__js_common.drag_arr[id_name].func(e);
    },

    /**
     * 줌 진행
     * 
     * require 2021.07.01
     * @version 2021.07.01
     * 
     * @param {object} e
     * @returns {undefined}
     */
    zoom_move: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id_name = ukp__js_common.drag_obj.id_name;
        var target = ukp__js_common.drag_arr[id_name].target;
        var mouse_pos = ukp__js_common.get_mouse_absolute(e);
        $(target).css("width", (mouse_pos.x - ukp__js_common.drag_obj.x) + "px");
        $(target).css("height", (mouse_pos.y - ukp__js_common.drag_obj.y) + "px");
    },

    /**
     * 선그리기 트랜지션 세팅<br>
     * 대상 인라인 스타일에 display: none 추가
     * 
     * require 2021.07.02
     * @version 2021.07.02
     * 
     * @param {string} path path셀렉터
     * @param {float} time 시간
     * @param {string} timing_function 시간함수
     * @returns {undefined}
     */
    set_line_transition: function (path, time, timing_function = "linear") {
        //css 설정
        var path_length = $(path)[0].getTotalLength();
        $(path).hide();
        $(path).css("stroke-dasharray", path_length);
        $(path).css("stroke-dashoffset", path_length);
        $(path).css("transition", "stroke-dashoffset " + time + "s " + timing_function);
    },

    /**
     * 선그리기 시작
     * require 2021.07.02
     * @version 2021.07.02
     * 
     * @param {string} path path셀렉터
     * @returns {undefined}
     */
    line_transition_start: function (path) {
        $(path).show();
        $(path).css("stroke-dashoffset", 0);
    },

    /**
     * 키보드 입력 문자열
     * require 2021.10.08 word_merge
     * @version 2021.10.08
     * 
     * @param {string} before_word 문자열
     * @param {string} input_word 키보드 입력값
     * @param {boolean} keyboard_bool true: 108키보드, false: 축소키보드
     * @returns {string} 적용 문자열
     */
    keyboard: function (before_word, input_word, keyboard_bool) {
        var word = before_word.substr(-1);
        before_word = before_word.substr(0, before_word.length - 1);
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
        var word_code = word.substr(-1).charCodeAt(0);
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
            word_flag = "m";
            word_arr.m = word;
        } else if (word_code >= 44032 && word_code < 55204) {
            temp_code = word.charCodeAt(0) - 44032;
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
                return before_word + word.substr(0, word.length - 1) + ukp__js_common.word_merge(word_arr);
            }
        }
        //자음,모음입력시 처리
        if (input_word_code >= 12593 && input_word_code < 12623) {
            if (word_flag == "i") {
                for (var i in combo.i) {
                    if (combo.i[i][0] == word_arr.i && combo.i[i][1] == input_word) {
                        return before_word + word.substr(0, word.length - 1) + combo.i[i][2];
                    }
                }
            } else if (word_flag == "m") {
                for (var i in index.t) {
                    if (index.t[i] == input_word) {
                        word_arr.t = input_word;
                        return before_word + word.substr(0, word.length - 1) + ukp__js_common.word_merge(word_arr);
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
                    return before_word + word.substr(0, word.length - 1) + ukp__js_common.word_merge(word_arr) + ukp__js_common.word_merge(input_word_arr);
                }
            }
            //자음나누기
            for (var i in combo[word_flag]) {
                if (combo[word_flag][i][2] == word_arr[word_flag]) {
                    word_arr[word_flag] = combo[word_flag][i][0];
                    input_word_arr.i = combo[word_flag][i][1];
                    input_word_arr.m = input_word;
                    return before_word + word.substr(0, word.length - 1) + ukp__js_common.word_merge(word_arr) + ukp__js_common.word_merge(input_word_arr);
                }
            }
        }
        return before_word + word + input_word;
    },

    /**
     * 자음모음 합치기
     * require 2021.08.03
     * @version 2021.08.03
     * 
     * @param {array} word 문자열[i,m,t]
     * @returns {string} 합친결과 
     */
    word_merge: function (word) {
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
    },

    /**
     * 기본메뉴 끄기
     * require 2021.08.27
     * @version 2021.08.27
     * 
     * @param {string} selector 셀렉터
     * @returns {undefined}
     */
    default_context_off: function (selector) {
        $(selector)[0].addEventListener("contextmenu", ukp__js_common.default_context_event);
    },

    /**
     * 기본메뉴 끄기해제
     * require 2021.08.27
     * @version 2021.08.27
     * 
     * @param {function} selector 셀렉터
     * @returns {undefined}
     */
    default_context_on: function (selector) {
        $(selector)[0].removeEventListener("contextmenu", ukp__js_common.default_context_event);
    },

    /**
     * 기본메뉴 끄기 이벤트
     * require 2021.08.27
     * @version 2021.08.27
     * 
     * @param {object} e 이벤트
     * @returns {undefined}
     */
    default_context_event: function (e) {
        e.preventDefault();
    },

    /**
     * 텍스트선택 이벤트 등록(document)
     * require 2021.10.26
     * @version 2021.10.26
     * 
     * @param {function} start_func 시작콜백함수
     * @param {function} end_func 종료콜백함수
     * @param {number} timeout 종료감지시간(밀리초)
     * @returns {undefined}
     */
    text_selection_on: function (start_func, end_func, timeout = 500) {
        ukp__js_common.selection_obj.text = "";
        ukp__js_common.selection_obj.end_bool = true;
        ukp__js_common.selection_obj.func = function (e) {
            var text = document.getSelection().toString();
            ukp__js_common.selection_obj.text = text;
            if (ukp__js_common.selection_obj.end_bool) {
                start_func(e);
                ukp__js_common.selection_obj.end_bool = false;
            }
            setTimeout(function (text) {
                if (ukp__js_common.selection_obj.end_bool) {
                } else if (ukp__js_common.selection_obj.text == text) {
                    end_func(e);
                    setTimeout(function () {
                        ukp__js_common.selection_obj.end_bool = true;
                    }, 0);
                }
            }, timeout, text);
        };
        document.addEventListener("selectionchange", ukp__js_common.selection_obj.func);
    },

    /**
     * 텍스트선택 이벤트 해제(document)
     * require 2021.08.27
     * @version 2021.08.27
     * 
     * @returns {undefined}
     */
    text_selection_off: function () {
        document.removeEventListener("selectionchange", ukp__js_common.selection_obj.func);
    },

    /**
     * 고유번호
     * require 2021.08.30 number_pad
     * @version 2021.08.30
     * 
     * @returns {string} 고유번호
     */
    unique_id: function () {
        var date = new Date();
        var unique_id = "" +
                date.getFullYear() +
                ukp__js_common.number_pad(date.getMonth() + 1, 2) +
                ukp__js_common.number_pad(date.getDate(), 2) +
                ukp__js_common.number_pad(date.getHours(), 2) +
                ukp__js_common.number_pad(date.getMinutes(), 2) +
                ukp__js_common.number_pad(date.getSeconds(), 2) +
                ukp__js_common.number_pad(date.getMilliseconds(), 3);
        return unique_id;
    },

    /**
     * 텍스트선택 좌표
     * require 2021.08.30 get_absolute
     * @version 2021.08.30
     * 
     * @returns {object} 좌표<br>
     *                   [start] - 시작좌표(x,y)<br>
     *                   [end] - 끝좌표(x,y)
     */
    text_selection_pos: function () {
        var return_obj = {
            start: {},
            end: {}
        };
        var range = document.getSelection().getRangeAt(0);
        var start_clone = range.cloneRange();
        start_clone.collapse(true);
        var start_pos = ukp__js_common.get_absolute(start_clone);
        return_obj.start.x = start_pos.x;
        return_obj.start.y = start_pos.y;
        var end_clone = range.cloneRange();
        end_clone.collapse(false);
        var end_pos = ukp__js_common.get_absolute(end_clone);
        return_obj.end.x = end_pos.x + end_pos.width;
        return_obj.end.y = end_pos.y + end_pos.height;
        return return_obj;
    },

    /**
     * 텍스트선택 태그추가<br>
     * span태그로 추가됨
     * require 2021.08.30 unique_id
     * @version 2021.08.30
     * 
     * @param {array} cla 추가 클래스 리스트
     * @param {string} script 클릭시 실행할 코드
     * @returns {string} 고유클래스(쿼리셀렉터)
     */
    text_selection_add_tag: function (cla, script) {
        var unique_id = "ukp__" + ukp__js_common.unique_id();
        var range = document.getSelection().getRangeAt(0);
        var fragment = range.extractContents();
        var element = document.createElement("span");
        for (var i in cla) {
            $(element).addClass(cla[i]);
        }
        $(element).addClass(unique_id);
        $(element).attr("onclick", script);
        $(element).append(fragment);
        range.insertNode(element);
        return "." + unique_id;
    },

    /**
     * 텍스트선택 태그삭제
     * require 2021.08.30
     * @version 2021.08.30
     * 
     * @param {string} cla 고유클래스(쿼리셀렉터)
     * @returns {undefined}
     */
    text_selection_remove_tag: function (cla) {
        $(cla).contents().unwrap();
    },

    /**
     * 스토리지 저장<br>
     * json데이터만 가능
     * require 2021.09.06
     * @version 2021.09.06
     * 
     * @param {string} key 키
     * @param {object} obj 저장할 객체
     * @param {boolean} local_bool true: 로컬스토리지, false: 세션스토리지
     * @returns {undefined}
     */
    storage_save: function (key, obj, local_bool = true) {
        if (local_bool) {
            localStorage.setItem(key, JSON.stringify(obj));
        } else {
            sessionStorage.setItem(key, JSON.stringify(obj));
    }
    },

    /**
     * 스토리지 불러오기<br>
     * json데이터만 가능
     * require 2021.09.06
     * @version 2021.09.06
     * 
     * @param {string} key 키
     * @param {boolean} local_bool true: 로컬스토리지, false: 세션스토리지
     * @returns {undefined}
     */
    storage_load: function (key, local_bool = true) {
        if (local_bool) {
            var json = localStorage.getItem(key);
        } else {
            var json = sessionStorage.getItem(key);
        }
        if (json === null) {
            json = "{}";
        }
        return JSON.parse(json);
    },

    /**
     * 리사이즈 이벤트 등록
     * require 2021.10.01
     * @version 2021.10.01
     * 
     * @param {string} id 아이디(셀렉터)
     * @param {function} func 리사이징, 위치이동시 콜백함수, [0] - 해당객체 크기정보 전달, [1] - 리사이징시 true
     * @param {int} interval 검사주기
     * @returns {undefined}
     */
    set_resize_event: function (id, func, interval = 500) {
        var id_name = id.substr(1);
        ukp__js_common.resize_arr[id_name] = {
            left: -1,
            right: -1,
            top: -1,
            bottom: -1,
            width: -1,
            height: -1,
        };
        ukp__js_common.resize_arr[id_name].interval = setInterval(function () {
            var cur_rect = ukp__js_common.resize_arr[id_name];
            var rect = $(id)[0].getBoundingClientRect();
            var left = parseInt(rect.left);
            var right = parseInt(rect.right);
            var top = parseInt(rect.top);
            var bottom = parseInt(rect.bottom);
            var width = parseInt(rect.width);
            var height = parseInt(rect.height);
            if (cur_rect.left != left || cur_rect.right != right || cur_rect.top != top || cur_rect.bottom != bottom || cur_rect.width != width || cur_rect.height != height) {
                var resize_bool = (cur_rect.width != width || cur_rect.height != height);
                ukp__js_common.resize_arr[id_name].left = left;
                ukp__js_common.resize_arr[id_name].right = right;
                ukp__js_common.resize_arr[id_name].top = top;
                ukp__js_common.resize_arr[id_name].bottom = bottom;
                ukp__js_common.resize_arr[id_name].width = width;
                ukp__js_common.resize_arr[id_name].height = height;
                func(rect, resize_bool);
            }
        }, interval);
    },

    /**
     * 리사이즈 이벤트 해제
     * require 2021.09.16
     * @version 2021.09.16
     * 
     * @param {string} id 아이디(셀렉터)
     * @returns {undefined}
     */
    clear_resize_event: function (id) {
        var id_name = id.substr(1);
        clearInterval(ukp__js_common.resize_arr[id_name].interval);
        delete ukp__js_common.resize_arr[id_name];
    },

    /**
     * contain box<br>
     * border 없는 박스 대상으로 해야함
     * require 2021.09.16
     * @version 2021.09.16
     * 
     * @param {string} selector 셀렉터
     * @param {string} target_selector 대상 셀렉터
     * @param {number} width 너비
     * @param {number} height 높이
     * @param {number} target_width 대상너비
     * @param {number} target_height 대상높이
     * @param {number} font_size 기준폰트크기
     * @returns {undefined}
     */
    contain_box: function (selector, target_selector, width, height, font_size = 16) {
        var rect = $(target_selector)[0].getBoundingClientRect();
        var width_per = rect.width / width;
        var height_per = rect.height / height;
        if (width_per < height_per) {
            $(selector).css("width", rect.width + "px");
            $(selector).css("height", (height * width_per) + "px");
            $(selector).css("font-size", (font_size * width_per) + "px");
        } else {
            $(selector).css("width", (width * height_per) + "px");
            $(selector).css("height", (rect.height) + "px");
            $(selector).css("font-size", (font_size * height_per) + "px");
    }
    },

    /**
     * 배열값 반환
     * require 2021.09.16
     * @version 2021.09.16
     * 
     * @param {object} obj 객체
     * @param {string} key 인덱스
     * @param {boolean} array_bool 반환값형태, true - 배열, false - 문자열
     * @returns {string|array}
     */
    array_value: function (obj, key, array_bool = false) {
        if (typeof (obj[key]) == "undefined") {
            return array_bool ? [] : "";
        } else if (typeof (obj[key]) == "string") {
            return array_bool ? [obj[key]] : obj[key];
        } else {
            return array_bool ? obj[key] : "";
    }
    },

    /**
     * get 파라미터
     * require 2021.09.16 array_value
     * @version 2021.09.16
     * 
     * @param {string} key 키, 공백인경우 배열전체
     * @param {boolean} array_bool 반환값형태, true - 배열, false - 문자열
     * @returns {string|array}
     */
    get: function (key = "", array_bool = false) {
        //파라미터 객체 생성
        var query_arr = location.search.substr(1).split("&");
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
        if (key == "") {
            return get;
        }
        return ukp__js_common.array_value(get, key, array_bool);
    },

    /**
     * orientation
     * require 2021.10.18
     * @version 2021.10.18
     *
     * @returns {boolean} true: 수직, false: 수평
     */
    get_orientation: function () {
        return window.screen.width < window.screen.height ? true : false;
    }
};