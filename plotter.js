// 参考：https://qiita.com/soarflat/items/4aa001dac115a4af6dbe
//       https://kurage.ready.jp/jhp_g/html5/canvas.html

// canvas要素を取得
var c = document.getElementById('canvas');
var cw;
var ch;

// canvasサイズをwindowサイズにする
//c.width = cw = window.innerWidth;
//c.height = ch = window.innerHeight;

// 描画に必要なコンテキスト(canvasに描画するためのAPIにアクセスできるオブジェクト)を取得
var ctx = c.getContext('2d');

var x = 0;
var y = 0;
var dx = 1;
var dy = 1;
var count = 0;

upper_limit_x = 1000;
lower_limit_x = 0;
upper_limit_y = 1000;
lower_limit_y = 0;
data = [[500,200],[300,350]];
max_element = 1000;

class RingBuffer{
    constructor(max_number){
        this.max_number = max_number;
        this.array = new Array(0);
        this.head = 0;
        this.num = 0;
        this.upper_limit = 0;
        this.lower_limit = 0;
    }
    get(number){
        return this.array[(number + this.head) % this.max_number];
    }
    push(number){
        if(this.num < this.max_number){
            // this.array[(this.head + this.num) % this.max_number] = number;
            this.array.push(number);
            this.num++;
        }else{
            this.array[this.head] = number;
            this.head++;
            this.head %= this.max_number;
        }
    }
    element_num(){
        return this.num;
    }
    get_upper_limit(){
        return Math.max(...this.array);
    }
    get_lower_limit(){
        return Math.min(...this.array);
    }
}

let buf = new RingBuffer(1000); 
// buf.push(3);
// buf.push(4);
// buf.push(5);
// buf.push(6);
// buf.push(7);
// console.log(buf.get(0));
// console.log(buf.get(1));
// console.log(buf.get(2));
// console.log(buf.get(3));
// console.log(buf.get(4));
// for(let i=0;i<110;i++){
//     buf.push(i);
// }
// for(let i=0;i<110;i++){
//     // console.log(i);
// }
// console.log(buf.get(4));

function draw_axis(){
    const tic_num = 5;
    const axis_start_x = c.width * 0.05;
    const axis_end_x = c.width * 0.95;
    const pitch_x = c.width * 0.9 / tic_num;
    const axis_start_y = c.height * 0.05;
    const axis_end_y = c.height * 0.95;
    const pitch_y = c.height * 0.9 / tic_num;
    // X軸
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.strokeStyle = "black";
    ctx.moveTo( axis_start_x, axis_end_y );
    ctx.lineTo( axis_end_x, axis_end_y );
    ctx.stroke();
    var tick_x = (upper_limit_x - lower_limit_x)/tic_num;
    for (var i = 0; i <= tic_num; i++){
        ctx.moveTo( axis_start_x + i * pitch_x, axis_end_y );
        ctx.lineTo( axis_start_x + i * pitch_x, axis_end_y - 5 );
        ctx.fillText( (tick_x * i).toFixed(1), axis_start_x + i * pitch_x, axis_end_y + 5);
        ctx.stroke();
    }
    // y軸
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.strokeStyle = "black";
    ctx.moveTo( axis_start_x, axis_start_y );
    ctx.lineTo( axis_start_x, axis_end_y );
    ctx.stroke();
    var tick_y = (upper_limit_y - lower_limit_y)/tic_num;
    for (var i = 0; i <= tic_num; i++){
        ctx.moveTo( axis_start_x, axis_start_y + i * pitch_y );
        ctx.lineTo( axis_start_x + 5, axis_start_y + i * pitch_y );
        ctx.fillText( (tick_y * i).toFixed(1), axis_start_x - 10, axis_end_y - i * pitch_y - 3 );
        ctx.stroke();
    }
};

function translate_x(x){
    return c.width * (0.05 * (upper_limit_x - x) + 0.95 * (x - lower_limit_x))/(upper_limit_x - lower_limit_x);
}

function translate_y(y){
    return c.height * (0.95 * (upper_limit_y - y) + 0.05 * (y - lower_limit_y))/(upper_limit_y - lower_limit_y);
}

function draw_dots(){
    ctx.fillStyle = 'black';
    upper_limit_y = buf.get_upper_limit();
    lower_limit_y = buf.get_lower_limit();
    for(let i=0;i<buf.element_num();i++){
        let x_ = translate_x(1000-buf.element_num() + i);
        let y_ = buf.get(i);
        let y__ = translate_y(y_);
        ctx.fillRect(Math.floor(x_), Math.floor(y__), 1, 1);
    }
    ctx.fill();
};

d = 0.01;

function draw(){
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.fillStyle = 'black';
    buf.push(Math.sin(d));
    d += 0.01;
    draw_axis();
    draw_dots();
    requestAnimationFrame(draw);   
};

draw();

var sock = new WebSocket("ws://localhost:5001");

var log = document.getElementById('log');

sock.onmessage = function(event){
    console.log(event.data);
    log.innerHTML += event.data + "<br>";
}

document.querySelector('button').onclick = function(){
    var text = document.getElementById('text').value;
    sock.send(text);
};
