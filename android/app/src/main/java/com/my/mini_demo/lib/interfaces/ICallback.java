package com.my.mini_demo.lib.interfaces;

import android.content.Intent;

import org.json.JSONObject;

public interface ICallback {

    void onSuccess(JSONObject result);

    void onFail();

    void onCancel();

    void startActivityForResult(Intent intent, int requestCode);
}
