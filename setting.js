const settingOpBt = document.getElementById('settingOpBt');
const settingClsBt = document.getElementById('settingClsBt');
const settingWindow = document.getElementById('settingWindow');

settingOpBt.addEventListener('click',function(){
    settingWindow.className = '';
});

settingClsBt.addEventListener('click',function(){
    settingWindow.className = 'hide';
});
