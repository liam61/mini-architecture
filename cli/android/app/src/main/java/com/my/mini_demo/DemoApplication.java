package com.my.mini_demo;

import android.app.ActivityManager;
import android.app.Application;
import android.content.Context;

import com.my.mini_demo.hostapi.OpenLink;
import com.my.mini_demo.lib.config.MiniConfig;
import com.my.mini_demo.lib.main.MiniService;

/**
 * 获取 Application 提前加载服务进程
 */
public class DemoApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        // 如果已经打开 demoApp 则预加载
        if (isMainProcess(this)) {
            MiniConfig config = new MiniConfig.Builder()
                    .loadExtendsApi(new OpenLink(getApplicationContext()))
                    .build();
            MiniService.start(getApplicationContext(), config);
        }
    }

    public static boolean isMainProcess(Context context) {
        boolean res = true;
        String processName = getProcessName(context);

        if (processName != null) {
            res = processName.equals(context.getPackageName());
        }
        return res;
    }

    public static String getProcessName(Context context) {
        int pid = android.os.Process.myPid();
        String processName = "";

        ActivityManager manager = (ActivityManager) context.getApplicationContext()
                .getSystemService(Context.ACTIVITY_SERVICE);

        if (manager != null) {
            for (ActivityManager.RunningAppProcessInfo process: manager.getRunningAppProcesses()) {
                if (process.pid == pid) {
                    processName = process.processName;
                }
            }
        }
        return processName;
    }
}
