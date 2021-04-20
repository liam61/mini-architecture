package com.my.mini_demo.lib.interfaces;

import org.json.JSONObject;

public interface ICallback {

    void onSuccess(JSONObject result);

    void onFail();

    void onCancel();
}
