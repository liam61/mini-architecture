package com.my.mini_demo.lib.web;

import android.content.Context;
import android.text.TextUtils;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.annotation.Nullable;

import com.my.mini_demo.lib.config.AppConfig;

public class MyWebViewClient extends WebViewClient {

    private AppConfig mAppConfig;

    public MyWebViewClient(AppConfig appConfig) {
        mAppConfig = appConfig;
    }

    @Nullable
    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        String url = request.getUrl().toString();
        WebResourceResponse resource = interceptResource(view.getContext(), url);
        return resource != null ? resource : super.shouldInterceptRequest(view, request);
    }

    /**
     * 拦截 Image, Upload， Download 等 api 放置的临时文件
     */
    private WebResourceResponse interceptResource(Context context, String url) {
        return null;

//        String resName = url.substring("someScheme://".length());
//        String resDir = mAppConfig.getMiniAppTempPath(context);
//        File file = new File(resDir, resName);
//        return new WebResourceResponse("image/*", "uft-8", new FileInputStream(file));
    }
}
