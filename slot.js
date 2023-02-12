const resData = JSON.parse(localStorage.getItem("resList"));
console.log(resData);

if (resData !== null && resData.length !== 0) {
  $("#res-div").css({ display: "block" });
  resData.map((v, idx) => {
    if((idx%5) === 0) {
      $("#res_list").append(`<br/><span>${v.name}&nbsp;${v.level}님</span>`);
    } else {
      $("#res_list").append(`<span>${v.name}&nbsp;${v.level}님</span>`);
    }
    
  });
  let dataArr = JSON.parse(localStorage.getItem("data"));
  resData.map(v => {
    dataArr = dataArr.filter(obj => obj.사번 !== v.eNum);
  });
  localStorage.setItem("data", JSON.stringify(dataArr));
}

const slotData = [
  { name: "사번 끝자리가", data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
  { name: "사번 끝에서 두번째 자리가", data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
  { name: "생일 월이", data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { name: "전화번호 가장 뒷자리가", data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
  { name: "입사일이", data: ["1~10일", "11~20일", "21~31일"] },
  {
    name: "성명 초성에",
    data: [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅅ",
      "ㅇ",
      "ㅈ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ],
  },
{name : "입사년도 끝자리가",
data : ["0~1","2~3","4~5","6~7","8~9"]
},
];

function cho_hangul(str) {
  cho = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  result = "";
  for (i = 0; i < str.length; i++) {
    code = str.charCodeAt(i) - 44032;
    if (code > -1 && code < 11172) result += cho[Math.floor(code / 588)];
  }
  return result;
}
left_audio = new Audio("./asset/left_slot_sound.mp3");
right_audio = new Audio("./asset/right_slot_sound.mp3");

function slotRoller(spd, selector, speed) {
  let symbol_no1 = "";

  // var speed = 40; // slot 회전 속도
  var firstChild = $("#list li:first-child");
  lastChild = $("#list li:last-child");
  // slot 목록을 순환
  $.when(
    $(selector).animate(
      {
        marginTop: "-500px",
      },
      speed + (spd * 30 + spd),
      "linear",
      function () {
        // 첫째 목록을 마지막으로 이동
        firstChild = $("li:first-child", this);
        $(this).append(firstChild);
        $(this).css({ marginTop: "-225px" });
      }
    )
  ).done(() => {
    left_audio.pause();  
    right_audio.pause();
  }); 
}

/* 슬롯 객체를 정의 */
function Slot_roll(slotName) {
  this.min = 12;
  this.max = 18;
  this.dice = function () {
    
    var dice = Math.round(Math.random() * (this.max - this.min)) + this.min;
    console.log(1)
    for (var i = 0; i < dice; i++) {
      slotRoller(i, slotName, 40);
    }
    for(var i = 0; i < dice/4; i++) {
      slotRoller(i, slotName, 1000);
    }
  };

}

/* 슬롯 객체 인스턴스 생성 */
var slot_roll1 = new Slot_roll("#slot_box1 #list");
var slot_roll2 = new Slot_roll("#slot_box2 #list");

/* 슬롯 시작!! */
$("#btn_r").on("click", function () {
  if (localStorage.getItem("data") == null) {
    alert("임직원 데이터를 업로드 해주세요");
    return;
  }
  $("#slot_box2 #list").empty();
  // 애니메이션이 재생중이 아닐 때만 돌리고!!
  if ($("#slot_box1 #list").is(":not(:animated)")) {
    $("#slot_box1 #list").empty();
    slotData.map((v, idx) => {
      const liTag = `<li data-roll=${idx}>${v.name}</li>`;
      $("#slot_box1 #list").append(liTag);
    });
    left_audio.play();
    slot_roll1.dice();
  }
});

$("#btn_s").on("click", function () {
  if (localStorage.getItem("data") == null) {
    alert("임직원 데이터를 업로드 해주세요");
    return;
  }
  if ($("#slot_box1 #list").children().length === 0) {
    alert("조건1 버튼을 먼저 눌러주세요");
    return;
  }
  if ($("#slot_box1 #list").is(":not(:animated)")) {
    idx = $("li:nth-child(2)", "#slot_box1").attr("data-roll");
    slotData[idx].data.map((v, i) => {
      const liTag = `<li data-roll=${i}>${v}</li>`;
      $("#slot_box2 #list").append(liTag);
    });
    if ($("#slot_box2 #list").is(":not(:animated)")) {
      right_audio.play();
      slot_roll2.dice();
    }
  }
});

$("#slot_btn").on("click", function () {
  if (localStorage.getItem("data") == null) {
    alert("임직원 데이터를 업로드 해주세요");
    return;
  }
  if ($("#slot_box1 #list").children().length === 0) {
    alert("조건1 버튼을 눌러주세요");
    return;
  }
  if ($("#slot_box2 #list").children().length === 0) {
    alert("조건2 버튼을 눌러주세요");
    return;
  }
  localStorage.removeItem("slotRes");
  idx1 = $("li:nth-child(2)", "#slot_box1").attr("data-roll");
  idx2 = $("li:nth-child(2)", "#slot_box2").attr("data-roll");
  console.log(
    `결과 : ${idx1} : ${slotData[idx1].name}, ${idx2} : ${slotData[idx1].data[idx2]}`
  );
  const members = JSON.parse(localStorage.getItem("data"));
  let arr = [];
  console.log(slotData[idx1]);
  switch (idx1) {
    case "0":
      members.map((v, idx) => {
          if (
            v.사번.substring(v.사번.length - 1) ===
            String(slotData[idx1].data[idx2])
          ) {
            arr.push(v);
          }
      });
      break;
    case "1":
      members.map((v, idx) => {
          if (
            v.사번.substring(v.사번.length - 2, v.사번.length - 1) ===
            String(slotData[idx1].data[idx2])
          ) {
            arr.push(v);
          }
      });
      break;
    case "2":
      members.map((v, idx) => {
          const strMonth = (slotData[idx1].data[idx2] < 10 ? "0" : "") + slotData[idx1].data[idx2];
          const birthStr = String(v.생년월일).substring(2, 4);
          if (birthStr === strMonth) {
            arr.push(v);
          }
      });
      break;
    case "3":
      members.map((v, idx) => {
          v.전화번호 = v.전화번호.replaceAll("-", "");
          if (
            v.전화번호.substring(v.전화번호.length - 1) ===
            String(slotData[idx1].data[idx2])
          ) {
            arr.push(v);
          }
      });
      break;
    case "4":
      console.log(slotData[idx1].data[idx2]);
      switch (slotData[idx1].data[idx2]) {
        case "1~10일":
          members.map((v, idx) => {
              const date = parseInt(v.입사일.substring(8));
              if (1 <= date && date <= 10) {
                arr.push(v);
              }
          });
          break;
        case "11~20일":
          members.map((v, idx) => {
            const date = parseInt(v.입사일.substring(8));
              if (11 <= date && date <= 20) {
                arr.push(v);
              }
          });
          break;
        case "21~31일":
          members.map((v, idx) => {
              const date = parseInt(v.입사일.substring(8));
              if (21 <= date && date <= 31) {
                arr.push(v);
              }
          });
          break;
      }
      break;
    case "5":
      members.map((v) => {
          cho_sung_output = cho_hangul(v.성명);
          if (cho_sung_output.includes(slotData[idx1].data[idx2])) {
            arr.push(v);
          }
      });
      break;
    
  
      case "6":
        console.log(slotData[idx1].data[idx2]);
        switch (slotData[idx1].data[idx2]) {
          case "0~1":
            members.map((v, idx) => {
                const date = parseInt(v.입사일.substring(3,4));
                console.log(v.입사일);
                console.log(date);
                if (0 == date || date == 1) {
                  arr.push(v);
                }
            });
            break;
          case "2~3":
            members.map((v, idx) => {
              const date = parseInt(v.입사일.substring(3,4));
                if (2 == date || date == 3) {
                  arr.push(v);
                }
            });
            break;
          case "4~5":
            members.map((v, idx) => {
                const date = parseInt(v.입사일.substring(3,4));
                console.log(v.입사일);
                console.log(date);
                if (4 == date || date == 5) {
                  arr.push(v);
                }
            });
            break;
          case "6~7":
            members.map((v, idx) => {
                console.log(v.입사일);
                const date = parseInt(v.입사일.substring(3,4));
                if (6 == date || date == 7) {
                  arr.push(v);
                }
            });
            break;
          case "8~9":
            members.map((v, idx) => {
                const date = parseInt(v.입사일.substring(3,4));
                if (8 == date || date == 9) {
                  arr.push(v);
                }
            });
            break;
        }
        break;
  }
  console.log(arr);
  if (arr.length === 0) {
    alert("조건에 해당되시는 분이 없습니다. 다시 돌려주세요.");
  } else {
    localStorage.setItem("slotRes", JSON.stringify(arr));
    $("#moveRoulette").css({ display: "inline-block" });
  }
});

/* 돌림판 이동 버튼*/
$(function () {
  setTimeout("anime()");
});
function anime() {
  $("#moveRoulette")
    .animate({ marginLeft: "20px" }, 1000)
    .animate({ marginLeft: "-20px" }, 1000);
  setTimeout("anime()", 1000);
}
$(function () {
  setTimeout("anime2()");
});
function anime2() {
  $("#box2").animate({ opacity: "1" }, 500).animate({ opacity: "0.7" }, 500);
  setTimeout("anime2()", 1000);
}
