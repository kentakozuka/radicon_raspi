var client = require('socket.io-client');
var fs = require('fs');
var raspi = require('raspi');
var PWM = require('raspi-pwm').PWM;
var socket = client.connect('http://localhost:5000');

int straight = 75;
int curveRight = 40;
int curveLeft = 110;
var pwm = new PWM('GPIO18');

console.log('connection is established');

socket.on('emit_from_server', function(data) {
    console.log(data);
});


//進路変更メソッド
socket.emit('straight', pwm.write(straight));
socket.emit('righte', pwm.write(curveRight));
socket.emit('left', pwm.write(curveLeft));



//ライト点灯
var isOn = false;   // 点灯しているかどうか
var count = 0;      // 点灯した回数
var maxCount = 10;  // 点滅させる回数

// 8番のGPIOピンを出力として登録
fs.writeFileSync('/sys/class/gpio/export', '8');
fs.writeFileSync('/sys/class/gpio/gpio8/direction', 'out');

// 1秒毎にオンとオフを切り替える
var blink = setInterval(function() {

  if(count == maxCount) {
    // GPIOピンを開放
    fs.writeFileSync('/sys/class/gpio/unexport', '8');
    // インターバルを終了
    clearInterval(blink);
    return;
  }

  if(isOn) {
    // LEDをオフ
    fs.writeFileSync('/sys/class/gpio/gpio8/value', '0');
    isOn = false;
  } else {
    // LEDをオン
    fs.writeFileSync('/sys/class/gpio/gpio8/value', '1');
    isOn = true;
    count++;
  }

}, 1000);