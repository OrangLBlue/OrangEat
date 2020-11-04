/*
 * @Author       : Orange
 * @Date         : 2020-10-24 12:36:46
 * @FilePath     : \食现抢单\食现抢枪抢.js
 * @Email        : orange2blue@qq.com
 * @LastEditTime : 2020-11-04 13:02:03
 */
"ui";//开启ui模式
//---------------------------------------------------------------------------------------
//---------------------------------初始化全局变量--------------------------------------------------
var g_Myapp = {};
g_Myapp.AppName = "微信";
g_Myapp.AppPackageName = "com.tencent.mm";
g_Myapp.SmallRoutine = "食现";
g_Myapp.Page = "尝鲜";
g_Myapp.PresePrice = 10;//设置底线价格
//g_Myapp.RefreshTime = 1;//设置刷新几小时
g_Myapp.PayPassWord = ""  //我的支付密码
g_Myapp.LockPassWord = ""  //我的支付密码
g_Myapp.TimeHour = "08"  //8时
g_Myapp.TimeMinute = "00"  //0分
g_Myapp.PayBoundsBegin = new Array; //支付键盘的起始坐标
g_Myapp.ANumberLAW =  new Array; //支付键盘一个数字的长和宽
g_Myapp.OpenMode = false; // 默认为true绘图解锁，false为密码解锁

g_Myapp.FixedTimeFlag = false //是否为定时抢购模式  默认关闭
g_Myapp.SaveName = "OrangeLB"  //本地存储名
g_Myapp.Protocol = false //是否同意协议 默认未同意
g_Myapp.Instructions = 
"1.首先若要正常使用需要开启悬浮窗权限和无障碍服务权限，若使用定时模式需要设置后台运行，保证不会被自动请理\
\n\n2.输入密码后要保存一定要按一下后面的保存**密码键，小橙才可以记住密码共之后使用哦\
\n\n3.在解锁密码设置的后面，有一个切换解锁模式按钮，默认是密码解锁，你可能喜欢绘图解锁，那么就要切到那个模式去哦\
\n\n4.关于绘图解锁的密码，绘图一般为9个点，所以那九个点分别代表\n\
\t1 2 3 \n\t4 5 6\n\t7 8 9\n就要根据连线顺序设置密码了\
\n\n5.还有还有，不喜欢转盘式时间设置的话，还可以点击始终左下角的键盘通过输入来设置时间哦\
\n\n6.那个价格，是预设的你的低价，你觉得当价格低于多少的时候你就买，那么就设多少吧\
\n\n7.设置过一次的东西如果不需要更改不需要重复设置哦，小橙的记忆力可好了\
\n\n\t8.最后小橙一定要说Orange就是你最得力的说明书哦！如果有问题请尽管去打扰他\n（试图推卸责任）(～￣▽￣)～"

g_Myapp.ProtocolText =
"\t\t郑重声明！！！\n\t此软是我开，此件是我栽，若用此软件，必须说我帅！！！\n(•̀ω•́)✧\
\n\t\t所以Orange非常帅这一说法你同意吗？据说用了此软件的人都很喜欢Orange哦\
\n\t\t比如，从此声明就可以看出来Orange有多喜欢Orange了，因为Orange也是软件的使用者之一呢 \n≥︺‿︺≤\n\n\
\t\t\t\t\t\t\t\t\t\t————by Orange"


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
                        <button id="look" text="查看设置" layout_weight="1"/>
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
                        <text text = " 请在下面输入框中根据自己的需求输入可爱的数字并保存" layout_weight = "6"/>
                        <linear>
                            <input id="pay_password" inputType="number"  singleLine="true" margin="5 2" hint="支付密码"></input>
                            <button id="savePayPassword" text="保存支付密码" margin="5 5"/>
                            <input id="PresePrice" inputType="number|numberDecimal"  singleLine="true" margin="5 2" hint="金额"></input>
                            <button id="savePresePrice" text="保存阈价" margin="10 5"/>
                        </linear>

                        <linear>
                            <input id="lock_password" inputType="number"  singleLine="true" margin="5 2" hint="锁屏密码"></input>
                            <button id="saveLockPassword" text="保存解锁密码" margin="5 5"/>
                            <button  id="change" text="切为绘图解锁" style="Widget.AppCompat.Button.Borderless.Colored" w="auto"/>
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
        g_Myapp.PayPassWord = PayPasswordText;
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
        g_Myapp.LockPassWord = LockPasswordText;
        setStorageData(g_Myapp.SaveName, "lock_password", LockPasswordText);
    }

    toastLog("你的锁屏密码是：" + LockPasswordText);
    ui.lock_password.setText("");
});

//检测是否按下了保存阈价
ui.savePresePrice.on("click", ()=>{
    //存储阈价
    var PresePriceText = ui.PresePrice.text();

    if(PresePriceText != ""){
        g_Myapp.PresePrice = PresePriceText;
        setStorageData(g_Myapp.SaveName, "PresePrice", PresePriceText);
    }

    toastLog("你设置的阈价为：" + PresePriceText);
    ui.PresePrice.setText("");
});

//检测是否按下了切换解锁模式按钮
ui.change.on("click", ()=>{
    //切换模式
    log(g_Myapp.OpenMode);
    if (g_Myapp.OpenMode) {
        ui.change.setText("切为绘图解锁");
        toastLog("已切换为密码解锁模式");
        g_Myapp.OpenMode = false;
    }else{
        ui.change.setText("切为密码解锁");
        toastLog("已切换为绘图解锁模式");
        g_Myapp.OpenMode = true;
    }
    log(g_Myapp.OpenMode);
    SaveData();
});

//检测是否按下了查看按钮
ui.look.on("click", ()=>{
    查看当前设置();
});


//监测是否按下 开启定时按钮
ui.saveTime.on("click", ()=>{
    g_Myapp.FixedTimeFlag =true;  //开启定时模式
    g_Myapp.TimeHour = ui.setTime.getCurrentHour();
    g_Myapp.TimeMinute = ui.setTime.getCurrentMinute();

    var arry = [g_Myapp.TimeHour,   //存储时间数组
        g_Myapp.TimeMinute]

    //存储时间设定
    setStorageData(
        g_Myapp.SaveName, "setTime",
        [ui.setTime.getCurrentHour(),   //存储时间数组
        ui.setTime.getCurrentMinute()
    ]);

    //打印日志，并显示相关设置
    toastLog("你设置的时间为:"+ arry[0]+" 时 "+ arry[1] +" 分 ");
    SaveData();
    GetData();
    
    threads.start(function(){
        //如果是定时模式则 定时执行
        log("进入定时线程")
        RegularExecution()
        if (g_Myapp.FixedTimeFlag) {
            log("开始工作")
            AutomaticUnlocking(g_Myapp.LockPassWord, g_Myapp.OpenMode);
            sleep(500);
            main();
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
        main();
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
//---------------------------------初始化及存储-----------------------------------------------------
//app初始化
function AppInit() {
    //读取数据
    GetData();

    //显示界面
    操作界面();

    //解锁模式显示
    if (g_Myapp.OpenMode) {
        ui.change.setText("切为密码解锁");
    }else{
        ui.change.setText("切为绘图解锁");
    }
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
            positive: "非常同意",
            //取消键内容
            negative: "非常同意，但暂时不用",
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
    //存储当前解锁模式
    setStorageData(g_Myapp.SaveName, "OpenMode", g_Myapp.OpenMode);
}

//读取界面配置及数据
function GetData() {
    //如果本地存储中的锁屏密码不为空，则读取锁屏密码
    if (getStorageData(g_Myapp.SaveName, "lock_password") != undefined) {
        g_Myapp.LockPassWord = getStorageData(g_Myapp.SaveName, "lock_password");
    }

    //如果本地存储中的支付密码不为空，则读取支付密码
    if (getStorageData(g_Myapp.SaveName, "pay_password") != undefined) {
        g_Myapp.PayPassWord = getStorageData(g_Myapp.SaveName, "pay_password");
    }

    //如果本地存储中的时间不为空，则读取定时
    if (getStorageData(g_Myapp.SaveName, "setTime") != undefined) {
        var arry = getStorageData(g_Myapp.SaveName, "setTime");
        g_Myapp.TimeHour = arry[0];
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

    //获取当前解锁模式
    if (getStorageData(g_Myapp.SaveName, "OpenMode") != undefined) {
        g_Myapp.OpenMode = getStorageData(g_Myapp.SaveName, "OpenMode");
    }

    //获取预设阈价
    if (getStorageData(g_Myapp.SaveName, "PresePrice") != undefined) {
        g_Myapp.PresePrice = getStorageData(g_Myapp.SaveName, "PresePrice");
    }
    
    //如果本地存储中的键盘范围起始坐标不为空，则读取键盘范围起始坐标
    if (getStorageData(g_Myapp.SaveName, "PayBoundsBegin") != undefined) {g_Myapp
        g_Myapp.PayBoundsBegin = getStorageData(g_Myapp.SaveName, "PayBoundsBegin");
    }

    //如果本地存储中的一个数字区域中点不为空，则读取一个数字区域中点
    if (getStorageData(g_Myapp.SaveName, "ANumberLAW") != undefined) {g_Myapp
        g_Myapp.ANumberLAW = getStorageData(g_Myapp.SaveName, "ANumberLAW");
    }

    //打印获取值日志
    log(g_Myapp.TimeHour + " 时 " +
    g_Myapp.TimeMinute + " 分 " +
    "\n锁屏密码为:" + g_Myapp.LockPassWord +
    "\n支付密码为:" + g_Myapp.PayPassWord +
    "\n是否开启定时模式:" + g_Myapp.FixedTimeFlag + 
    "\n是否同意协议：" + g_Myapp.Protocol + 
    "\n是否为绘图解锁：" + g_Myapp.OpenMode + 
    "\n支付键盘起始坐标：" + g_Myapp.PayBoundsBegin + 
    "\n数字键中心坐标：" + g_Myapp.ANumberLAW +
    "\n预设价格：" + g_Myapp.PresePrice
    );
}

function 查看当前设置() {
    toastLog("你定的时间为:" + g_Myapp.TimeHour + " 时 " +
    g_Myapp.TimeMinute + " 分 " +
    "\n你的锁屏密码为:" + g_Myapp.LockPassWord +
    "\n你的支付密码为:" + g_Myapp.PayPassWord +
    "\n你的预设价格：" + g_Myapp.PresePrice +
    "\n是否开启定时模式:" + g_Myapp.FixedTimeFlag +
    "\n是否为绘图解锁：" + g_Myapp.OpenMode
    )
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
//主函数
function main() {
    //打开并进入到小程序
    OpenWX();//打开微信
    FindSX(g_Myapp.SmallRoutine);//找到小程序食现并点击

    //找到商品并购买或刷新
    FindPage(g_Myapp.Page);//进入找到尝鲜页面
    ClickYouWant();//找到你置顶的商品并点击进入
    IsCanBuy(g_Myapp.PresePrice);//判断当前价格是否达到了购买要求
}

//打开微信
function OpenWX() {
    var Active = launchApp(g_Myapp.AppName);
    waitForPackage(g_Myapp.AppPackageName);
    if (id("rr").exists()) {//
        id("rr").findOne().click();
    }
}

//从屏幕中心滑动屏幕
function SlideScreen(direction){
    switch(direction){
        case 'w': 
            swipe(g_Mydevice.x, g_Mydevice.y + 400, g_Mydevice.x, 0, 500); //向上滑
            break;
        case 's': 
            swipe(g_Mydevice.x, g_Mydevice.y - 400, g_Mydevice.x, 2*g_Mydevice.y, 500); //向下滑
            break;
        case 'a': 
            swipe(g_Mydevice.x + 200, g_Mydevice.y, 0, g_Mydevice.y, 500); //向左滑
            break;
        case 'd': 
            swipe(g_Mydevice.x - 200, g_Mydevice.y, 2*g_Mydevice.x, g_Mydevice.y, 500); //向右滑
            break;
        default: 
            break;
    }
}

//找到对应小程序并点击
function FindSX(Name) {
    while(!text(Name).exists()) {
        SlideScreen(g_Mydirection.Down);//向下滑进入小程序搜索页面
    }
    var Active = text(Name).findOne(10000).parent().click();
    //text("搜索小程序").depth(12).findOne().setText(Name);
}

//找到对应页（尝鲜）
function FindPage(page) {
    //判断是否为初页
    if(id("db").exists()){
        var key = id("db").findOne().bounds();
        log("页面不正确，返回");
        click(key.centerX(), key.centerY())
    }else{
        log("页面正确，继续");
    }
    //找到尝鲜标签并点击
    var Active = text(page).findOne(10000).bounds();
    log("已获取尝鲜按钮的中心坐标：" + Active.centerX() + "  " + Active.centerY());
    click(Active.centerX(),  Active.centerY());
    sleep(500);
}

//找到你置顶的商品并点击进入
function ClickYouWant() {
    //找到并点击置顶的那个商品
    var Active = text("购买").findOne(10000).bounds();
    log("已获取第一件商品购买控件的中心坐标：" + Active.centerX() + "  " + Active.centerY());
    click(Active.centerX(),  Active.centerY());
}

//判断当前价格是否达到了购买要求
function GetPrice(prese_price) {
    //获取当前价格
    var Text = textStartsWith("当前价格").findOne(10000).text(); //获取支付价格控件的text内容
    log("已获取支付价格text：" + Text);

    var n_Price = parseFloat(Text.match(/\d+\.\d\d/g));//通过正则表达式获取当前的价格并转化为浮点数
    log("已获取当前价格：" + n_Price);

    //将获取的价格浮点数与预设底线进行比较，判断是否达到购买要求
    if (n_Price <= prese_price) {
        toastLog("恭喜你该商品已经减至设定底线，要尽快购买，否则商品就要溜走了");

        var Bounds = textStartsWith("当前价格").findOne(10000).bounds();//获取档期那价格的区域范围
        
        //如果是帮减直接跳过，如果可以减价则减价
        if(className("android.widget.Button").idContains("4a9edb0").depth(24).exists()){
            toastLog("已经减过价了，小橙将帮你直接购买")
        }else if(className("android.widget.Button").depth(24).exists()){
            className("android.widget.Button").depth(24).findOne().click();
        }
        
        sleep(500);
        return true;


    }else{
        toastLog("还不行还不行，得再等等吧");
        return false;
    }
}

//根据预设价格，选择购买或刷新
function IsCanBuy(prese_price) {
    while(true){
        if (GetPrice(prese_price)) {//判断购买指令，若未true则点击去支付
            if (text("去支付").exists()) {
                PayMoney(g_Myapp.PayPassWord);
                return ;
            }else if (text("已卖完").exists()) {
                alert("诶呀，慢了一步，可恶，有人抢我吃的");
                return ;
            }
        }else if (!GetPrice(prese_price)) {//如果没有达到预设线则下拉刷新
            if (text("已卖完").exists()) {
                alert("他们是疯了嘛，这么贵都买");
                return ;
            }
            SlideScreen(g_Mydirection.Down);
            sleep(500);
        }
    }
}

//输入密码支付
function PayMoney(password) {
    var ActiveToBuy = text("去支付").findOne().click();//点击去支付按钮 
    var ActiveBuy = text("支付").findOne().click();//点击支付按钮
    sleep(1500); 

    if (desc("使用密码").depth(15).exists()) {//如果设置了指纹，那么改用密码支付
        var ActiveUsePSWD = desc("使用密码").findOne().click();
    }

    if (g_Myapp.PayBoundsBegin == 0 || g_Myapp.ANumberLAW == 0) {//如果键盘信息未获取，则获取键盘信息
        //获取支付按键的范围
        var PayBounds = id("g61").depth(10).findOne().bounds();
        log(PayBounds.left + " " + PayBounds.top + " " + PayBounds.right + " " + PayBounds.bottom);//24 1751 1152 2400
    
        //记录下来赋值给全局变量进行存储
        g_Myapp.PayBoundsBegin = [PayBounds.left, PayBounds.top]; //记录整个键盘的左上角即起始位置

        var ANLong = (PayBounds.right - PayBounds.left) / 6;//记录一个数字区域的长中点
        var ANWeight = (PayBounds.bottom - PayBounds.top) / 8;//记录一个数字区域的宽的中点
        g_Myapp.ANumberLAW = [ANLong, ANWeight];//记录一个数字区域中点

        //存储键盘范围起始坐标
        setStorageData(g_Myapp.SaveName, "PayBoundsBegin", g_Myapp.PayBoundsBegin);

        //存储一个数字区域中点
        setStorageData(g_Myapp.SaveName, "ANumberLAW", g_Myapp.ANumberLAW);
    }
    log(g_Myapp.PayBoundsBegin + " " + g_Myapp.ANumberLAW);
    sleep(800);
    //输入密码
    for (let index = 0; index < password.length; index++) {
        switch (password[index]) {
            case '0':
                click(g_Myapp.PayBoundsBegin[0] + 3 * g_Myapp.ANumberLAW[0], 
                    g_Myapp.PayBoundsBegin[1] + 7 * g_Myapp.ANumberLAW[1]); //点击按键6的中点
                sleep(400);
                break;
            case '1':
                click(g_Myapp.PayBoundsBegin[0] + g_Myapp.ANumberLAW[0], 
                    g_Myapp.PayBoundsBegin[1] + g_Myapp.ANumberLAW[1]); //点击按键1的中点
                sleep(400);
                break;
            case '2':
                click(g_Myapp.PayBoundsBegin[0] + 3 * g_Myapp.ANumberLAW[0], 
                    g_Myapp.PayBoundsBegin[1] + g_Myapp.ANumberLAW[1]); //点击按键2的中点
                sleep(400);
                break;
            case '3':
                click(g_Myapp.PayBoundsBegin[0] + 5 * g_Myapp.ANumberLAW[0], 
                    g_Myapp.PayBoundsBegin[1] + g_Myapp.ANumberLAW[1]); //点击按键3的中点
                sleep(400);    
                break;
            case '4':
                click(g_Myapp.PayBoundsBegin[0] + g_Myapp.ANumberLAW[0], 
                    g_Myapp.PayBoundsBegin[1] + 3 * g_Myapp.ANumberLAW[1]); //点击按键4的中点
                sleep(400);
                break;
            case '5':
                click(g_Myapp.PayBoundsBegin[0] + 3 * g_Myapp.ANumberLAW[0], 
                    g_Myapp.PayBoundsBegin[1] + 3 * g_Myapp.ANumberLAW[1]); //点击按键5的中点
                sleep(400);
                break;
            case '6':
                click(g_Myapp.PayBoundsBegin[0] + 5 * g_Myapp.ANumberLAW[0], 
                    g_Myapp.PayBoundsBegin[1] + 3 * g_Myapp.ANumberLAW[1]); //点击按键6的中点
                sleep(400);
                break;
            case '7':
                click(g_Myapp.PayBoundsBegin[0] + g_Myapp.ANumberLAW[0], 
                    g_Myapp.PayBoundsBegin[1] + 5 * g_Myapp.ANumberLAW[1]); //点击按键6的中点
                sleep(400);
                break;
            case '8':
                click(g_Myapp.PayBoundsBegin[0] + 3 * g_Myapp.ANumberLAW[0], 
                    g_Myapp.PayBoundsBegin[1] + 5 * g_Myapp.ANumberLAW[1]); //点击按键6的中点
                sleep(400);
                break;
            case '9':
                click(g_Myapp.PayBoundsBegin[0] + 5 * g_Myapp.ANumberLAW[0], 
                    g_Myapp.PayBoundsBegin[1] + 5 * g_Myapp.ANumberLAW[1]); //点击按键6的中点
                sleep(400);
                break;
            default:
                break;
        }  
    }
}

//---------------------------------------------------------------------------------------------
//---------------------------------定时执行，亮屏与解锁---------------------------------------------------

//定时执行
function RegularExecution() {
    while (g_Myapp.FixedTimeFlag) {
        var myDate = new Date();
        if(myDate.getHours() == g_Myapp.TimeHour  &&
            myDate.getMinutes() == g_Myapp.TimeMinute &&
            myDate.getSeconds() == 0 &&
            myDate.getSeconds() <= 5){
            log("时间到")
            break;
        }
        sleep(500)
    }
    sleep(1000);
}

//自动亮屏解锁屏幕
//password 锁屏密码
//mode 解锁模式
function AutomaticUnlocking(password, mode) {
    for (let index = 0; index < 2; index++) {
        if(!device.isScreenOn()){  //判断是熄是亮
            device.wakeUp();     //没亮则点亮
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