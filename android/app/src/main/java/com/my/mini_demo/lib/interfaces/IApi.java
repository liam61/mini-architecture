package com.my.mini_demo.lib.interfaces;

import android.content.Intent;

import org.json.JSONObject;

public interface IApi {
    /**
     * 可调用的 api
     */
    String[] apis();

    /**
     * 接收到 api 调用时，处理相应逻辑
     */
    void invoke(String event, JSONObject param, ICallback callback);

    /**
     * Activity onCreate 时回调
     */
    void onCreate();

    /**
     * Activity onDestroy 时回调
     */
    void onDestroy();

    /**
     * Activity onActivityResult 时回调
     */
    void onActivityResult(int requestCode, int resultCode, Intent data, ICallback callback);
}
