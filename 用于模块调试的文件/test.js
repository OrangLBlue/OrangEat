/*
 * @Author       : Orange
 * @Date         : 2020-11-03 01:47:30
 * @FilePath     : \食现抢单\test.js
 * @Email        : orange2blue@qq.com
 * @LastEditTime : 2020-11-03 20:22:08
 */
var myapp = {}
myapp.password = "1235789";
myapp.OpenMode = false; // 默认为true绘图解锁，false为密码解锁

let g_Mydevice = {}
g_Mydevice.x = device.width / 2; //获取设备的1/2宽
g_Mydevice.y = device.height / 2; //获取设备的1/2高


// var myDate = new Date();
// if(myDate.getHours() == 16){
//     var a = "17" + 5;
//     log(myDate.getHours() + " " + a)
// }
//log(1 > 2? 1:2)
// if(id("db").exists()){
//     var key = id("db").findOne().bounds();
//     log("页面不正确，返回");
//     click(key.centerX(), key.centerY())
// }else{
//     log("页面正确，继续");
// }
log("nihao")
//AutomaticUnlocking(myapp.password, myapp.OpenMode);

//自动亮屏解锁屏幕
//password 锁屏密码
//mode 解锁模式
function AutomaticUnlocking(password, mode) {
    for (let index = 0; index < 2; index++) {
        if(!device.isScreenOn()){  //判断是熄是亮
            device.wakeUp();        //没亮则点亮
            sleep(3500);
            log("没亮")
        }else{
            log("亮的")
        }  
    }

    //上滑进入解锁页面
    for (let index = 0; index < 2; index++) {
        swipe(g_Mydevice.x,   //x1
        g_Mydevice.y * 2 * 0.92, //y1
        g_Mydevice.x,         //x2
        g_Mydevice.y,         //y2
        600);   
    }
    sleep(500);
    log(password);

    //如果进入了页面则
    if (text("紧急呼叫").exists()){
        sleep(500);
        if(mode){
            DrawLock(password);//描绘密码
        }else{
            NumberLock(password);
        }
    }else{
        log("false");
    }
}

//找到解锁键盘
function FindLockKeyBounds() {
    return text("紧急呼叫").findOne().parent().parent().parent().child(0).bounds();//获取画图键键盘的范围
}

//绘图解锁
function DrawLock(password) {
    //获取画图键键盘的坐标
    log(FindLockKeyBounds().left + " " 
    + FindLockKeyBounds().top + " "
    + FindLockKeyBounds().right + " " 
    + FindLockKeyBounds().bottom);

    var LockKeyBegin = [FindLockKeyBounds().left, FindLockKeyBounds().top];//记录键盘起始位置

    var ANLong = (FindLockKeyBounds().right - FindLockKeyBounds().left) / 6;
    var ANWight = (FindLockKeyBounds().bottom - FindLockKeyBounds().top) / 6;
    var ALockKeyLAW = [ANLong, ANWight];//记录一个按键范围的中点

    log(LockKeyBegin + " " 
    + ALockKeyLAW);

    var Draw = new Array;

    for (let index = 0; index < password.length; index++) {
        switch (password[index]) {
            case '1':
                Draw[index] = [LockKeyBegin[0] + ALockKeyLAW[0], 
                LockKeyBegin[1] + ALockKeyLAW[1]];
                break;
            case '2':
                Draw[index] = [LockKeyBegin[0] + 3 * ALockKeyLAW[0], 
                LockKeyBegin[1] + ALockKeyLAW[1]];
                break;
            case '3':
                Draw[index] = [LockKeyBegin[0] + 5 * ALockKeyLAW[0], 
                LockKeyBegin[1] + ALockKeyLAW[1]];
                break;
            case '4':
                Draw[index] = [LockKeyBegin[0] + ALockKeyLAW[0], 
                LockKeyBegin[1] + 3 * ALockKeyLAW[1]];
                break;
            case '5':
                Draw[index] = [LockKeyBegin[0] + 3 * ALockKeyLAW[0], 
                LockKeyBegin[1] + 3 * ALockKeyLAW[1]];
                break;
            case '6':
                Draw[index] = [LockKeyBegin[0] + 3 * ALockKeyLAW[0], 
                LockKeyBegin[1] + 3 * ALockKeyLAW[1]];
                break;
            case '7':
                Draw[index] = [LockKeyBegin[0] + ALockKeyLAW[0], 
                LockKeyBegin[1] + 5 * ALockKeyLAW[1]];
                break;
            case '8':
                Draw[index] = [LockKeyBegin[0] + 3 * ALockKeyLAW[0], 
                LockKeyBegin[1] + 5 * ALockKeyLAW[1]];
                break;
            case '9':
                Draw[index] = [LockKeyBegin[0] + 5 * ALockKeyLAW[0], 
                LockKeyBegin[1] + 5 * ALockKeyLAW[1]];
                break;
            default:
                break;
        }
    }
    log(Draw);
    gesture(300,Draw);
}

//密码解锁
function NumberLock(password) {
    for (let index = 0; index < password.length; index++) {
        text(password[index]).findOne().parent().click();
        sleep(100)
    }
}