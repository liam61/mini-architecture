package com.my.mini_demo.lib.utils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JsonUtil {

    public static int[] parse2IntArray(String string) {
        int[] ids;

        try {
            JSONArray jsonArray = new JSONArray(string);
            int len = jsonArray.length();

            if (len > 0) {
                ids = new int[len];
                for (int i = 0; i < len; i++) {
                    ids[i] = jsonArray.getInt(i);
                }
                return ids;
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        ids = new int[1];
        return ids;
    }

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
