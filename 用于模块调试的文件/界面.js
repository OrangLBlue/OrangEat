"ui";

var g_Myapp = {};
g_Myapp.AppName = "微信";
g_Myapp.AppPackageName = "com.tencent.mm";
g_Myapp.SmallRoutine = "食现";
g_Myapp.Page = "尝鲜";
g_Myapp.PresePrice = 4;
g_Myapp.RefreshTime = 10;
g_Myapp.PayPassWord = ""  //我的支付密码
g_Myapp.LockPassWord = ""  //我的支付密码
g_Myapp.TimeHouse = "08"  //8时
g_Myapp.TimeMinute = "00"  //0分

g_Myapp.FixedTimeFlag = false //是否为定时抢购模式  默认关闭
g_Myapp.SaveName = "OrangeLB"  //本地存储名
g_Myapp.Protocol = false //是否同意协议 默认未同意
g_Myapp.Instructions = 
"1.首次使用需要给予悬浮窗权限，打开无障碍服务，有root权限，可以直接使用。并且需要进行一次立即打卡，获取相关兼容性数据。\
\n\n2.由于不占流量和运行，建议锁定后台运行（尤其是设定定时打卡时一定要保证程序是在运行的），否则可能会被锁屏或当成闲置应用请理\
\n\n3.通过设定时间，并在输入框中输入锁屏解锁密码（目前只支持数字密码哦），然后点击 定时与解锁 按钮，到了约定时间就会自动进行解锁并打卡（手机不同可能会出现不兼容现象，可以不设置手机锁屏进行使用，但不建议）。如果没有密码锁屏也可以不输入密码哦。\
\n\n4.如果设置了定时模式，但又不想采用定时打卡的方式了，可以通过 取消定时按键 取消定时 \
\n\n5.如果手机不兼容定时自动打卡，或想手动打卡 那么可以点击 立即打卡 马上进行打卡哦 \
\n\n6.在立即打卡过程中通过按音量上键可以终止打卡哦 \n7.打卡过程中不要进行其他操作否则可能会出现bug \
\n\n8.切记不要太过依赖此软件，功能尚有不足，纯个人兴趣，没有测试群众，使用过程中一定会出现很多问题，还是希望大家养成健康打卡的好习惯呀\
\n\n(～￣▽￣)～\
\n\n 私信地址：(https://blog.csdn.net/orlobl 或 qq1398825239)"

g_Myapp.ProtocolText =
"\t本软件是用于完美校园打卡的免费软件，不可用于非法用途，未经本人同意授权，也不\
可用于私下交易，或使用本软件开源平台源码进行二次开发，发布群控等灰色软件。\n\n\t本软\
件为个人的兴趣产物，没有做兼容性测试，可能有些手机不兼容无法使用，或部分功能无法使用，\
切记切记切记切记不要依赖此软件，健康打卡才是最重要的。感兴趣的玩玩就好了，如有问题可以私信我\
(https://blog.csdn.net/orlobl 或 qq1398825239)，虽然因个人时间原因，有可能不会进行后期更新\
维护，但你们的建议将是我前进动力，也希望本软件可以帮到你们。\n\n————by Orange"

//放向
var g_Mydirection = {}
g_Mydirection.Up = 'w';
g_Mydirection.Down = 's';
g_Mydirection.left = 'a';
g_Mydirection.right = 'd';

//设备信息
let g_Mydevice = {}
g_Mydevice.x = device.width / 2; //获取设备的1/2宽
g_Mydevice.y = device.height / 2; //获取设备的1/2高

//---------------------------------------------------------------------------------------
//---------------------------------自定义控件--------------------------------------------------
//自定义按钮
var ColoredButton = (function() {
    //继承ui.Widget
    util.extend(ColoredButton, ui.Widget);

    function ColoredButton() {
        //调用父类构造函数
        ui.Widget.call(this);
        //自定义属性color，定义按钮颜色
        this.defineAttr("color", (view, name, defaultGetter) => {
            return this._color;
        }, (view, name, value, defaultSetter) => {
            this._color = value;
            view.attr("backgroundTint", value);
        });
        //自定义属性onClick，定义被点击时执行的代码
        this.defineAttr("onClick", (view, name, defaultGetter) => {
            return this._onClick;
        }, (view, name, value, defaultSetter) => {
            this._onClick = value;
        });
    }
    ColoredButton.prototype.render = function() {
        return (
            <button textSize="16sp" style="Widget.AppCompat.Button.Colored" w="auto"/>
        );
    }
    ColoredButton.prototype.onViewCreated = function(view) {
        view.on("click", () => {
            if (this._onClick) {
                eval(this._onClick);
            }
        });
    }
    ui.registerWidget("colored-button", ColoredButton);
    return ColoredButton;
})();

//---------------------------------------------------------------------------------------
//--------------------------------UI界面-------------------------------------------------
function 操作界面() {
    ui.layout(
        <scroll>
            <vertical>
                <appbar>
                    <toolbar id="toolbar" title="小橙抢食" bg="#ff6000"/>
                </appbar>
                <card w="*" h="auto" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                    <View bg="#E51400" h="*" w="5" />
                    <horizontal padding="18 8" h="auto">
                        <Switch id="autoService" text="无障碍服务:" checked="{{auto.service != null}}" w="auto" textStyle="bold" />
                        <text layout_weight = "3"></text>
                        <colored-button id="InterfaceSwitching" text="使用说明" color="#c06080" layout_weight = "1"/>
                    </horizontal>
                </card>

                <card w="*" h="auto" margin="10 2" cardCornerRadius="2dp"
                    cardElevation="1dp" gravity="center_vertical">
                    <vertical>
                        <scroll>
                            <vertical  padding="20 1">
                                {/* <text text="设置打卡时间" textColor="black" textSize="16sp" marginTop="10"/> */}
                                <timepicker id = "setTime" bg = "#66cccc"/>
                            </vertical>
                        </scroll>
                    </vertical>
                </card>
                
                <card w="*" h="auto" margin="10 2" cardCornerRadius="2dp"
                    cardElevation="1dp" gravity="center_vertical">   
                    <vertical>     
                        <linear>
                            <input id="pay_password" inputType="number"  singleLine="true" margin="10 2" hint="请输入可爱的支付密码"></input>
                            <button id="savePayPassword" text="保存支付密码" margin="10 5"/>
                        </linear>

                        <linear>
                            <input id="lock_password" inputType="number"  singleLine="true" margin="10 2" hint="请输入可爱的锁屏密码"></input>
                            <button id="saveLockPassword" text="保存解锁密码" margin="10 5"/>
                        </linear>
                    </vertical>
                </card> 

                <card w="*" h="auto" margin="10 2" cardCornerRadius="2dp"
                    cardElevation="1dp" gravity="center_vertical">
                        <linear>
                            <button id="saveTime" text="开启定时" margin="10 5"/> 
                            <button id="Cancellation" text="取消定时" margin="10 5"/>
                            <button id="Immediately" text="立即抢食" style="Widget.AppCompat.Button.Colored" w="auto" margin="10 5"/>
                        </linear>
                        <vertical>
                    </vertical>
                </card> 
            </vertical>
        </scroll>
    )
}
//---------------------------------------------------------------------------------------------
//---------------------------------app初始化函数---------------------------------------------------

AppInit();

//---------------------------------------------------------------------------------------------
//---------------------------------ui事件监听-----------------------------------------------------
//检测无障碍权限开关单击事件
ui.autoService.on("check", function(checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if(checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if(!checked && auto.service != null){
        auto.service.disableSelf();
    }
});

// 当用户回到本界面时，resume事件会被触发
ui.emitter.on("resume", function() {
    // 此时根据无障碍服务的开启情况，同步开关的状态
    ui.autoService.checked = auto.service != null;
});

//检测是否按下保存支付密码
ui.savePayPassword.on("click", ()=>{
   //存储支付密码
   var PayPasswordText = ui.pay_password.text(); 

   if(PayPasswordText != ""){
       setStorageData(g_Myapp.SaveName, "pay_password", PayPasswordText);
   }

   toastLog("你的支付密码是：" + PayPasswordText);
   ui.pay_password.setText("");
});

//检测是否按下了保存解锁密码按钮
ui.saveLockPassword.on("click", ()=>{
    //存储锁屏密码
    var LockPasswordText = ui.lock_password.text();

    if(LockPasswordText != ""){
        setStorageData(g_Myapp.SaveName, "lock_password", LockPasswordText);
    }

    toastLog("你的锁屏密码是：" + LockPasswordText);
    ui.lock_password.setText("");
});


//监测是否按下 开启定时按钮
ui.saveTime.on("click", ()=>{
    g_Myapp.FixedTimeFlag =true;  //开启定时模式
    g_Myapp.TimeHouse  = ui.setTime.getCurrentHour();
    g_Myapp.TimeMinute = ui.setTime.getCurrentMinute();

    var arry = [g_Myapp.TimeHouse,   //存储时间数组
        g_Myapp.TimeHouse]

    //存储时间设定
    setStorageData(
        g_Myapp.SaveName, "setTime",
        [ui.setTime.getCurrentHour(),   //存储时间数组
        ui.setTime.getCurrentMinute(),
    ]);

    //打印日志，并显示相关设置
    toastLog("你设置的时间为:"+ arry[0]+" 时 "+arry[1]+" 分 ");
    SaveData();
    GetData();
    
    threads.start(function(){
        while (true) {
            //如果是定时模式则 定时执行
            if(g_Myapp.FixedTimeFlag){
                //main();
            }
        }
    });
});

//监测是否按下取消定时按钮
ui.Cancellation.on("click", ()=>{
    g_Myapp.LockPassWord = "";
    threads.shutDownAll();

    g_Myapp.FixedTimeFlag = false;
    SaveData();

    toastLog("你已经取消了定时打卡服务");
});

//监测是否按下立即抢食按钮
ui.Immediately.on("click", ()=>{
    SaveData();
    toastLog("dd，小橙的魔爪要进军食现了，这将是一场屠杀，不要拦我");

    //屏蔽音量键调节声音
    events.setKeyInterceptionEnabled("volume_up", true);
    //启用按键监听
    events.observeKey();
    //监听音量键按下
    events.onKeyDown("volume_up", () => {
        toastLog('按音量上键停止');
        alert("抢食终止")
        exit();
    });

    threads.start(function(){
        sleep(1500);
        //在新线程执行的代码

    });
});

//监测是否使用说明按钮
ui.InterfaceSwitching.on("click", ()=>{
    //检测是否有悬浮窗权限
    // if(!floaty.checkPermission()){
    //     toastLog("需要开启悬浮窗权限");
    //     floaty.requestPermission();
    // }
    SaveData();
    log("打开说明")
    alert("使用说明", g_Myapp.Instructions);
});
//---------------------------------------------------------------------------------------------
//---------------------------------业务逻辑-----------------------------------------------------

//app初始化
function AppInit() {
    //读取数据
    GetData();

    //显示界面
    操作界面();

    //是否显示声明
    protocol();

    // 屏蔽输入法弹出
    importClass('android.view.WindowManager');
    activity.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);

    //存储数据
    SaveData();
}

//是否显示声明
function protocol() {
    if(!g_Myapp.Protocol){
        toastLog("需要获取悬浮窗权限")
        dialogs.build({
            //对话框标题
            title: "声明",
            //对话框内容
            content: g_Myapp.ProtocolText,
            contentLineSpacing: 1.5,
            //确定键内容
            positive: "同意",
            //取消键内容
            negative: "不同意并,退出",
            //不可通过框外取消对话框
            canceledOnTouchOutside: false,
        }).on("positive", ()=>{
            //监听确定键
            g_Myapp.Protocol = true;
            SaveData();
            toastLog("欢迎使用")
        }).on("negative", ()=>{
            g_Myapp.Protocol = false;
            SaveData();
            toastLog("即将退出")
            exit();
        }).show();
    }
}

//保存当前界面配置及数据
function SaveData(){
    //存储当前是否是定时模式
    setStorageData(g_Myapp.SaveName, "Cancellation", g_Myapp.FixedTimeFlag);
    //存储当前是否同意协议
    setStorageData(g_Myapp.SaveName, "protocol", g_Myapp.Protocol);
}

//读取界面配置及数据
function GetData() {
    //如果本地存储中的锁屏密码不为空，则读取锁屏密码
    if (getStorageData(g_Myapp.SaveName, "lock_password") != undefined) {
        g_Myapp.LockPassWord= getStorageData(g_Myapp.SaveName, "lock_password");
    }

    //如果本地存储中的支付密码不为空，则读取支付密码
    if (getStorageData(g_Myapp.SaveName, "pay_password") != undefined) {
        g_Myapp.PayPassWord= getStorageData(g_Myapp.SaveName, "pay_password");
    }

    //如果本地存储中的时间不为空，则读取定时
    if (getStorageData(g_Myapp.SaveName, "setTime") != undefined) {
        var arry = getStorageData(g_Myapp.SaveName, "setTime");
        g_Myapp.TimeHouse = arry[0];
        g_Myapp.TimeMinute = arry[1];
    }

    //获取当前模式  是否为定时模式
    if (getStorageData(g_Myapp.SaveName, "Cancellation") != undefined) {
        g_Myapp.FixedTimeFlag = getStorageData(g_Myapp.SaveName, "Cancellation");
    }

    //如果本地存储中的协议指标不为空，则读取协议指标
    if (getStorageData(g_Myapp.SaveName, "protocol") != undefined) {g_Myapp
        g_Myapp.Protocol = getStorageData(g_Myapp.SaveName, "protocol");
    }

    //打印获取值日志
    log(g_Myapp.TimeHouse + " 时 " +
    g_Myapp.TimeMinute + " 分 " +
    "\n锁屏密码为:" + g_Myapp.LockPassWord +  
    "\n支付密码为:" + g_Myapp.PayPassWord +  
    "\n是否开启定时模式:" + g_Myapp.FixedTimeFlag +
    "\n是否同意协议：" + g_Myapp.Protocol);
}

//本地存储相关接口函数封装
//保存本地数据
function setStorageData(name, key, value) {
    const storage = storages.create(name);  //创建storage对象
    storage.put(key, value);
};

//读取本地数据
function getStorageData(name, key) {
    const storage = storages.create(name);  //创建storage对象
    if (storage.contains(key)) {
        return storage.get(key, "");
    };
    //默认返回undefined
};

//删除本地数据
function delStorageData(name, key) {
    const storage = storages.create(name);  //创建storage对象
    if (storage.contains(key)) {
        storage.remove(key);
    };
};

//---------------------------------------------------------------------------------------------
//---------------------------------主要功能实现----------------------------------------------------
