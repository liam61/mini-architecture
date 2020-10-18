package com.my.mini_demo.lib.service;

import android.content.Context;
import android.net.Uri;
import android.util.Log;
import android.widget.LinearLayout;

import com.my.mini_demo.lib.api.ApiManager;
import com.my.mini_demo.lib.config.AppConfig;
import com.my.mini_demo.lib.interfaces.IBridge;
import com.my.mini_demo.lib.interfaces.OnEventListener;
import com.my.mini_demo.lib.utils.Event;
import com.my.mini_demo.lib.utils.JsonUtil;
import com.my.mini_demo.lib.web.MyWebView;

import java.io.File;

/**
 * 小程序 Service 层，加载 service.html
 */
public class AppService extends LinearLayout implements IBridge {

    private MyWebView mServiceWebView;
    private OnEventListener mListener;
    private AppConfig mAppConfig;
    private ApiManager mApiManager;

    public AppService(Context context, OnEventListener listener, AppConfig appConfig, ApiManager apiManager) {
        super(context);

        mAppConfig = appConfig;
        mApiManager = apiManager;
        mListener = listener;
        mServiceWebView = new MyWebView(context, this);

        // 现在是利用了 webview 提供的 js 运行环境
        addView(mServiceWebView, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
    }

    public void subscribeHandler(String event, String params, int viewId) {
        Log.d("MiniDemo", String.format("subscribeHandler is called by native! event=%s, params=%s, viewId=%s",
                event, params, viewId));
        
        String jsFun = String.format("javascript:subscribeHandler('%s', %s, %s)",
                event, params, viewId);
        mServiceWebView.loadUrl(jsFun);
    }

    @Override
    public void publish(String event, String params, String viewId) {
        if (mListener == null) {
            return;
        }

        // prefix 在 framework 中拼接
        if ("custom_event_serviceReady".equals(event)) {
            mAppConfig.initConfig(params);
            mListener.onServiceReady();
        } else {
            // custom_event_appDataChange | custom_event_nativeAlert
            mListener.notifyPageSubscribers(event, params, Integer.parseInt(viewId));
        }
    }

    @Override
    public void invoke(String event, String params, String callbackId) {
        Event e = new Event(event, params, callbackId);
        mApiManager.invokeApi(e, this);
    }

    @Override
    public void callback(String callbackId, String result) {
        mServiceWebView.loadUrl(String.format("javascript:callbackHandler(%s, %s)",
                callbackId, result));
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();

        // 小程序目录中加载 service.html
        File serviceFile = new File(mAppConfig.getMiniAppSourcePath(getContext()), "service.html");
        String servicePath = Uri.fromFile(serviceFile).toString();
        mServiceWebView.loadUrl(servicePath);
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();

        removeAllViews();
        mServiceWebView.destroy();
    }
}
