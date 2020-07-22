package com.my.mini_demo.lib.service;

import android.content.Context;
import android.util.Log;

import com.eclipsesource.v8.JavaCallback;
import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Array;
import com.eclipsesource.v8.V8Object;
import com.my.mini_demo.lib.api.ApiManager;
import com.my.mini_demo.lib.config.AppConfig;
import com.my.mini_demo.lib.interfaces.IBridge;
import com.my.mini_demo.lib.interfaces.OnEventListener;
import com.my.mini_demo.lib.utils.Event;
import com.my.mini_demo.lib.utils.FileUtil;
import com.my.mini_demo.lib.utils.JsonUtil;

import java.io.File;

/**
 * 小程序 Service 层，加载 app-service.js（v8 worker 实现）
 */
public class AppService2 implements IBridge, JavaCallback {

    public static final String GLOBAL = "window";

    private V8 mServiceWorker;
    private OnEventListener mListener;
    private AppConfig mAppConfig;
    private ApiManager mApiManager;


    public AppService2(Context context, OnEventListener listener, AppConfig appConfig, ApiManager apiManager) {
        mServiceWorker = V8.createV8Runtime(AppService2.GLOBAL);
        mListener = listener;
        mAppConfig = appConfig;
        mApiManager = apiManager;

        initWorker(context);
    }

    private void initWorker(Context context) {
        // JavaScriptInterface
        mServiceWorker.registerJavaMethod(this,
                "publish", "publish", new Class[]{String.class, String.class, String.class});
        mServiceWorker.registerJavaMethod(this,
                "invoke", "invoke", new Class[]{String.class, String.class, String.class});
        mServiceWorker.registerJavaMethod(this,
                "console", "log", new Class[]{String.class});


        // 小程序目录中加载 app-service.js
        File serviceFile = new File(mAppConfig.getMiniAppSourcePath(context), "app-service.js");
        String content = FileUtil.readString(serviceFile);
        mServiceWorker.executeScript(content);

        Log.e("MiniDemo", "service inited");
    }

    public void subscribeHandler(String event, String params, int viewId) {
        V8Array arguments = new V8Array(mServiceWorker);
        arguments.push(event);
        arguments.push(params);
        arguments.push(viewId);
        mServiceWorker.executeVoidFunction("subscribeHandler", arguments);
    }

    public void console(String message) {
        Log.e("[INFO:CONSOLE]", message);
    }

    /**
     * 不会再走 JavascriptInterface 中调用
     */
    @Override
    public void publish(String event, String params, String viewIds) {
        if (mListener == null) {
            return;
        }

        // prefix 在 framework 中拼接
        if ("custom_event_serviceReady".equals(event)) {
            mAppConfig.initConfig(params);
            mListener.onServiceReady();
        } else {
            // custom_event_appDataChange | custom_event_nativeAlert
            mListener.notifyPageSubscribers(event, params, JsonUtil.parse2IntArray(viewIds));
        }
    }

    @Override
    public void invoke(String event, String params, String callbackId) {
        Event e = new Event(event, params, callbackId);
        mApiManager.invokeApi(e, this);
    }

    @Override
    public void callback(String callbackId, String result) {
        V8Array arguments = new V8Array(mServiceWorker);
        arguments.push(callbackId);
        arguments.push(result);
        mServiceWorker.executeVoidFunction("callbackHandler", arguments);
    }

    public void onDestroy() {
        mServiceWorker.release(true);
    }

    @Override
    public Object invoke(V8Object v8Object, V8Array v8Array) {
        Log.d("MiniDemo", v8Object + ", " + v8Array);
        return null;
    }
}
