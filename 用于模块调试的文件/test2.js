/*
 * @Author       : Orange
 * @Date         : 2020-11-04 11:40:46
 * @FilePath     : \食现抢单\用于模块调试的文件\test2.js
 * @Email        : orange2blue@qq.com
 * @LastEditTime : 2020-11-04 13:01:23
 */

    // if (desc("使用密码").depth(15).exists()) {//如果设置了指纹，那么改用密码支付
    //     var ActiveUsePSWD = desc("使用密码").findOne().click();
    // }

    if(className("android.widget.Button").idContains("4a9edb0").depth(24).exists()){
        toastLog("已经减过价了，小橙将帮你直接购买")
    }else if(className("android.widget.Button").depth(24).exists()){
        className("android.widget.Button").depth(24).findOne().click();
    }