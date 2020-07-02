package com.my.mini_demo.lib.main;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;

import androidx.annotation.Nullable;

import com.my.mini_demo.lib.config.MiniConfig;
import com.my.mini_demo.lib.utils.FileUtil;

/**
 * mini 进程 Service，提前创建进程并初始化
 */
public class MiniService extends Service {

    public static final String FRAMEWORK = "framework.zip";

    private static MiniConfig mConfig;

    public static MiniConfig getConfig() {
        return mConfig;
    }

    public static void start(final Context context, MiniConfig config) {
        mConfig = config;

        // 加载小程序框架
        FileUtil.loadFramework(context);

        Intent intent = new Intent(context, MiniService.class);
        context.startService(intent);
    }

    public static void launchHome(Context context, String userId, String appId, String appPath) {
        Intent intent = new Intent(context, MiniActivity.class);
        intent.putExtra(MiniActivity.APP_ID, appId);
        intent.putExtra(MiniActivity.USER_ID, userId);
        intent.putExtra(MiniActivity.APP_PATH, appPath);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        // 进入小程序界面
        context.startActivity(intent);
    }

//    @Override
//    public int onStartCommand(Intent intent, int flags, int startId) {
//        return super.onStartCommand(intent, flags, startId);
//    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


}
