package com.my.mini_demo.lib.web;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.my.mini_demo.lib.interfaces.IBridge;

public class JsBridge {

    private IBridge mBridge;
    private Handler mHandler = new Handler(Looper.getMainLooper());

    public JsBridge(IBridge bridge) {
        mBridge = bridge;
    }

    @JavascriptInterface
    public void publish(final String event, final String params, final String viewIds) {
        Log.d("MiniDemo", String.format("publish bridge is called! event=%s, params=%s, viewIds=%s",
                event, params, viewIds));
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                if (mBridge != null) {
                    mBridge.publish(event, params, viewIds);
                }
            }
        });
    }

    @JavascriptInterface
    public void invoke(final String event, final String params, final String callbackId) {
        Log.d("MiniDemo", String.format("invoke bridge is called! event=%s, params=%s, callbackId=%s",
                event, params, callbackId));
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                if (mBridge != null) {
                    mBridge.invoke(event, params, callbackId);
                }
            }
        });
    }
}
