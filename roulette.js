var options = [];
JSON.parse(localStorage.getItem("slotRes")).map((v) => {
  options.push({ name: v.성명, eNum: v.사번, level: v.직위 });
});
console.log(options);
var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return (
    String(nybHexString.substr((n >> 4) & 0x0f, 1)) +
    nybHexString.substr(n & 0x0f, 1)
  );
}

function RGB2Color(r, g, b) {
  return "#" + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = (Math.PI * 2) / maxitem;

  red = Math.sin(frequency * item + 2 + phase) * width + center;
  green = Math.sin(frequency * item + 0 + phase) * width + center;
  blue = Math.sin(frequency * item + 4 + phase) * width + center;

  return RGB2Color(red, green, blue);
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 300;
    var textRadius = 240;
    var insideRadius = 125 + 62.5;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 750, 750);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "bold 23px Arial";
    if (options.length >= 44) {
      ctx.font = "bold 10px Arial";
    } else if (options.length >= 35) {
      ctx.font = "bold 13px Arial";
    } else if (options.length >= 24) {
      ctx.font = "bold 16px Arial";
    } else if (options.length >= 16) {
      ctx.font = "bold 23px Arial";
    } else if (options.length >= 15) {
      ctx.font = "bold 35px Arial";
    }
    // else if(options.length >= 7) {
    //   ctx.font = 'bold 17px Arial';
    // }

    for (var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(375, 375, outsideRadius, angle, angle + arc, false);
      ctx.arc(375, 375, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(
        375 + Math.cos(angle + arc / 2) * textRadius,
        375 + Math.sin(angle + arc / 2) * textRadius
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      // var text = `${options[i].name}(${options[i].eNum})`;
      var text = options[i].name;
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(375 - 15, 375 - (outsideRadius + 25));
    ctx.lineTo(375 + 15, 375 - (outsideRadius + 25));
    ctx.lineTo(375 + 15, 375 - (outsideRadius - 15));
    ctx.lineTo(375 + 29, 375 - (outsideRadius - 15));
    ctx.lineTo(375 + 0, 375 - (outsideRadius - 50));
    ctx.lineTo(375 - 29, 375 - (outsideRadius - 15));
    ctx.lineTo(375 - 15, 375 - (outsideRadius - 15));
    ctx.lineTo(375 - 15, 375 - (outsideRadius + 15));
    ctx.fill();
  }
}

function spin() {
  spin_audio = new Audio("./asset/rotate_sound.wav");
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  // spinTimeTotal = Math.random() * 3 + 4 * 3000;
  spinTimeTotal = 4 * 1700;
  rotateWheel();
}

function rotateWheel() {
  spin_audio.play()
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle =
    spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;
  drawRouletteWheel();
  spinTimeout = setTimeout("rotateWheel()", 30);
}

const musics = ["cong_music.wav", "cong_music1.mp3", "cong_music2.mp3", "cong_music3.mp3","cong_music4.wav"];



function stopRotateWheel() {
  spin_audio.pause()
  random_music_index = Math.floor(Math.random() * 5);

  audio = new Audio("./asset/"+musics[random_music_index]);
  audio.loop = true;
  clearTimeout(spinTimeout);
  var degrees = (startAngle * 180) / Math.PI + 90;
  var arcd = (arc * 180) / Math.PI;
  var index = Math.floor((360 - (degrees % 360)) / arcd);
  ctx.save();
  ctx.font = "bold 30px Helvetica, Arial";
  var text = `${options[index].name}(${options[index].eNum})`;
  ctx.fillText(text, 375 - ctx.measureText(text).width / 2, 375 + 10);
  ctx.restore();

  audio.play()
  audio.loop = true;
  document.getElementById('cong').style.visibility = 'visible';
  document.getElementById("in_name").innerText = options[index].name+ " " + options[index].level + "님\n 축하합니다!";
  setTimeout(() => {
    audio.pause();    
  }, 7000);
  // document.getElementById('cong').style.visibility = 'hidden';
  setInterval(() => {
    $("#moveSlot").css({ display: "inline-block" });  
  }, 5000);
}

/* 슬롯머신 이동 버튼*/
function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();

/* 돌림판 이동 버튼*/
$(function () {
  setTimeout("anime()");
});
function anime() {
  $("#moveSlot")
    .animate({ marginLeft: "20px" }, 1000)
    .animate({ marginLeft: "-20px" }, 1000);
  setTimeout("anime()", 1000);
}

const moveSlot = () => {
  const degrees = (startAngle * 180) / Math.PI + 90;
  const arcd = (arc * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  if (localStorage.getItem("resList") !== null) {
    localStorage.setItem(
      "resList",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("resList")),
        options[index],
      ])
    );
  } else {
    localStorage.setItem("resList", JSON.stringify([options[index]]));
  }
  window.location.href='slot.html';
  // document.getElementById('cong').style.visibility = 'hidden';
}