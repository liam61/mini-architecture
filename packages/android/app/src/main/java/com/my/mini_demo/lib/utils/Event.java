package com.my.mini_demo.lib.utils;

import android.text.TextUtils;

import org.json.JSONException;
import org.json.JSONObject;

public class Event {
    private String mName;
    private String mParam;
    private String mCallbackId;

    public Event(String name, String param, String callbackId) {
        mName = name;
        mParam = param;
        mCallbackId = callbackId;
    }

    public String getName() {
        return mName;
    }

    public String getCallbackId() {
        return mCallbackId;
    }

    public JSONObject getParam() {
        if (!TextUtils.isEmpty(mParam)) {
            try {
                return new JSONObject(mParam);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return new JSONObject();
    }
}
