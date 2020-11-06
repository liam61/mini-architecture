package com.my.mini_demo.lib.utils;

import org.json.JSONException;
import org.json.JSONObject;

public class JsonUtil {
    public static String getStringValue(String json, String key, String defaultValue) {
        try {
            JSONObject paramJson = new JSONObject(json);

            if (paramJson.has(key)) {
                return paramJson.optString(key);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return defaultValue;
    }

    public static int getIntValue(String json, String key, int defaultValue) {
        try {
            JSONObject paramJson = new JSONObject(json);

            if (paramJson.has(key)) {
                return paramJson.optInt(key);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return defaultValue;
    }
}
