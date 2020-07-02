package com.my.mini_demo.lib.web;

import android.content.Context;
import android.os.Build;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.my.mini_demo.lib.config.MiniConfig;
import com.my.mini_demo.lib.interfaces.IBridge;

public class MyWebView extends WebView {

    public MyWebView(Context context, IBridge bridge) {
        super(context);
        init();
        setJsBridge(new JsBridge(bridge));
    }

    public int getViewId() {
        return hashCode();
    }

    private void init() {
        WebSettings settings = getSettings();

        //设置WebView中启用JavaScript执行。
        settings.setJavaScriptEnabled(true);

        settings.setDisplayZoomControls(false);
        settings.setAllowContentAccess(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setSavePassword(false);
        settings.setPluginState(WebSettings.PluginState.ON);
        settings.setAppCacheEnabled(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setGeolocationEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setDefaultTextEncodingName("utf-8");

        if (Build.VERSION.SDK_INT >= 21) {
            settings.setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        String userAgent = settings.getUserAgentString();
        settings.setUserAgentString(String.format("%s My(version/%s)", userAgent, MiniConfig.VERSION));
        setVerticalScrollBarEnabled(false);
        setHorizontalScrollBarEnabled(false);
    }

    public void setJsBridge(JsBridge jsBridge) {
        addJavascriptInterface(jsBridge, "jsCore");
    }

    @Override
    public void destroy() {
        setWebViewClient(null);
//        setWebChromeClient(null);
        removeJavascriptInterface("jsCore");
        super.destroy();
    }
}
