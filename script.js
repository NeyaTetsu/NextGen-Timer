//変数宣言
const timerTx = document.getElementById("timer");

const hourCt = document.getElementById("hourCt");
const hourTx = document.getElementById("hourTx");

const minCt = document.getElementById("minCt");
const minTx = document.getElementById("minTx");

const secCt = document.getElementById("secCt");
const secTx = document.getElementById("secTx");

const actionBt1 = document.getElementById("actionBt1");
const actionBt1Tx = document.getElementById("actionBt1Tx");
const actionBt2 = document.getElementById("actionBt2");
const actionBt2Tx = document.getElementById("actionBt2Tx");


const fileSlct = document.getElementById("fileSlct");
const fileSlctLabel = document.getElementById("fileSlctLabel");
const fileDel = document.getElementById("fileDel");
const fileName = document.getElementById("fileName");

const sound = new Audio();
const defFile = './sound.wav';
sound.src = defFile;
sound.loop = true;


let hourSetVal = 0;
let minSetVal = 0;
let secSetVal = 0;

let hourVal = 0;
let minVal = 0;
let secVal = 0;

let timerStatus = 0;
//0 = 待機状態
//1 = カウント状態
//2 = 一時停止中
//3 = カウント終了

let timerIntvl;
let timerUp0;
let timerUp1;

//シークバー
const seekbar = document.getElementById('seekbar');
let seekbarPosition = 0;


//スクロールで時間指定
hourCt.addEventListener('scroll',function(){
    //hourSetVal = Math.floor(hourCt.scrollTop/120);
    hourSetVal = overSlice(hourCt.scrollTop,24);
    hourTx.innerText = num2View(hourSetVal);
});

minCt.addEventListener('scroll',function(){
    //minSetVal = Math.floor(minCt.scrollTop/120);
    minSetVal = overSlice(minCt.scrollTop,60);
    minTx.innerText = num2View(minSetVal);
});

secCt.addEventListener('scroll',function(){
    //secSetVal = Math.floor(secCt.scrollTop/120);
    secSetVal = overSlice(secCt.scrollTop,60);
    secTx.innerText = num2View(secSetVal);
});

//数値が規定範囲を超えたらその部分はカット
//モバイルSafari用
function overSlice(x,y){
    let z = Math.floor(x/120);
    if(z >= y){
        return y - 1;
    }else if(z < 0){
        return 0;
    }else{
        return z;
    }
}


//ボタンが押されたときのアクション
actionBt1.addEventListener('click',function(){
    if(timerStatus === 0){
        if(hourSetVal > 0 || minSetVal > 0 || secSetVal > 0){
            timerInit();
        }
    }else if(timerStatus === 1){
        timerPause(); 
    }else if(timerStatus === 2){
        timerStart();
    }else if(timerStatus === 3){
        timerStop();
    }
});

actionBt2.addEventListener('click',function(){
    if(timerStatus === 0 || timerStatus === 2 || timerStatus === 3){
        timerReset();
    }else if(timerStatus === 1){
        timerStop();
    }
});


//音声ファイル選択
fileSlct.addEventListener('change',function(evt){
    let file = evt.target.files[0];
    if(file.length === 0){
        sound.src = defFile;
        return;
    }else if(!file.type.match('audio.*')){
        alert('選択されたファイルは対応していません');
        sound.src = defFile;
        return;
    }
    const reader = new FileReader();
    reader.onload = function(){
        sound.pause();
        sound.src = reader.result;
    }
    reader.readAsDataURL(file);
    fileName.innerText = file.name;
    fileDel.classList.remove('hide');
    fileSlctLabel.classList.add('hide');
})

//音声リセット
fileDel.addEventListener('click',function(){
    sound.pause();
    sound.src = defFile;
    fileSlct.value = '';
    fileSlctLabel.classList.remove('hide');
    fileDel.classList.add('hide');
})


//タイマー初期化
function timerInit(){
    hourVal = hourSetVal;
    minVal = minSetVal;
    secVal = secSetVal;
    scrollCtrl(false);
    sound.load();
    timerStart();
}

//タイマー開始
function timerStart(){
    timerStatus = 1;
    actionBt1Tx.innerText = 'Pause';
    actionBt2Tx.innerText = 'Stop';
    timerIntvl = setInterval(timerLoop,1000);
}

//タイマー時間
function timerUp(){
    timerStatus = 3;
    clearInterval(timerIntvl);
    actionBt1Tx.innerText = 'Stop';
    actionBt2Tx.innerText = 'Reset';
    resTimerView();
    timerUpView0();
    sound.currentTime = 0;
    sound.play();
}

//タイマー終了
function timerStop(){
    timerStatus = 0;
    sound.pause();
    clearInterval(timerIntvl);
    timerUpViewRes();
    actionBt1Tx.innerText = 'Start';
    actionBt2Tx.innerText = 'Reset';
    hourTx.innerText = num2View(hourSetVal);
    minTx.innerText = num2View(minSetVal);
    secTx.innerText = num2View(secSetVal);
}

//タイマー一時停止
function timerPause(){
    timerStatus = 2;
    clearInterval(timerIntvl);
    actionBt1Tx.innerText = 'Start';
    actionBt2Tx.innerText = 'Reset';
}

//タイマーリセット
function timerReset(){
    timerStatus = 0;
    sound.pause();
    timerUpViewRes();
    actionBt1Tx.innerText = 'Start';
    actionBt2Tx.innerText = 'Reset';
    hourCt.scrollTop = 0;
    minCt.scrollTop = 0;
    secCt.scrollTop = 0;
    hourSetVal = 0;
    minSetVal = 0;
    secSetVal = 0;
    resTimerView();
}

//ループ部分
function timerLoop(){
    if(secVal === 0){
        if(minVal === 0){
            if(hourVal === 0){
                timerUp();
            }else{
                hourVal--;
                minVal = 59;
                secVal = 59;
            }
        }else{
            minVal--;
            secVal = 59;
        }
    }else{
        secVal--;
    }
    refTimerView();
    refSeekbar();
}

//表示更新
function refTimerView(){
    hourTx.innerText = num2View(hourVal);
    minTx.innerText = num2View(minVal);
    secTx.innerText = num2View(secVal);
}

//表示リセット
function resTimerView(){
    hourTx.innerText = '00';
    minTx.innerText = '00';
    secTx.innerText = '00';
}

//点滅
function timerUpView0(){
    timerTx.className = 'timerUp0';
    timerUp0 = setTimeout(timerUpView1,500);
}
function timerUpView1(){
    timerTx.className = 'timerUp1';
    timerUp1 = setTimeout(timerUpView0,500);
}
function timerUpViewRes(){
    scrollCtrl(true);
    clearTimeout(timerUp0);
    clearTimeout(timerUp1);
    timerTx.classList.remove('timerUp0','timerUp1');
    resSeelbar();
}

//数値を表示用数字に変換
function num2View(x){
    return ('0' + x).slice(-2);
}

//スクロールをロック
function scrollCtrl(x){
    if(x){
        hourCt.classList.remove('hide');
        minCt.classList.remove('hide');
        secCt.classList.remove('hide');
    }else{
        hourCt.classList.add('hide');
        minCt.classList.add('hide');
        secCt.classList.add('hide');
    }
}


//シークバー
function resSeelbar(){
    seekbar.style.left = '-100%';
}
function refSeekbar(){
    seekbarPosition = Math.floor(((hourVal * 60 + minVal) * 60 + secVal) / ((hourSetVal * 60 + minSetVal) * 60 + secSetVal) * 100);
    seekbar.style.left = -seekbarPosition + '%';
}
