package com.my.mini_demo.lib.web;

import android.text.TextUtils;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.Toast;

public class MyWebChromeClient extends WebChromeClient {

    @Override
    public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
        if (message.startsWith("native::")) {
            String text = message.substring(8);

            if (!TextUtils.isEmpty((text))) {
                Toast.makeText(view.getContext(), text, Toast.LENGTH_LONG).show();
            }
            result.confirm();
        }
        return true;
    }
}
