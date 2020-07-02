package com.my.mini_demo.lib.api.module;

import android.content.Context;
import android.content.res.Resources;
import android.os.Build;
import android.util.DisplayMetrics;

import com.my.mini_demo.lib.api.BaseApi;
import com.my.mini_demo.lib.interfaces.ICallback;

import org.json.JSONException;
import org.json.JSONObject;

public class SystemInfo extends BaseApi {
    private String model;
    private float pixelRatio;
    private int screenWidth;
    private int screenHeight;
    private int windowWidth;
    private int windowHeight;
    private String language;
    private String version;
    private String system;
    private String platform;
    private String SDKVersion;

    public SystemInfo(Context context) {
        super(context);
    }

    @Override
    public String[] apis() {
        return new String[]{"getSystemInfo"};
    }

    @Override
    public void onCreate() {
        super.onCreate();

        int statusBarHeight = 0;
        Resources resources = getContext().getResources();
        int resId = resources.getIdentifier("status_bar_height", "dimen", "android");

        if (resId > 0) {
            statusBarHeight = resources.getDimensionPixelSize(resId);
        }

        DisplayMetrics dm = getContext().getResources().getDisplayMetrics();

        this.model = Build.MODEL;
        this.pixelRatio = dm.density;
        this.screenWidth = dm.widthPixels;
        this.screenHeight = dm.heightPixels;
        this.windowWidth = dm.widthPixels;
        this.windowHeight = dm.heightPixels - statusBarHeight;
        this.language = "zh-CN";
        this.version = "1.0";
        this.system = Build.VERSION.RELEASE;
        this.platform = "android";
        this.SDKVersion = "0.0.1";
    }

    @Override
    public void invoke(String event, JSONObject param, ICallback callback) {
        try {
            JSONObject result = new JSONObject();
            result.put("model", model);
            result.put("pixelRatio", pixelRatio);
            result.put("screenWidth", screenWidth);
            result.put("screenHeight", screenHeight);
            result.put("windowWidth", windowWidth);
            result.put("windowHeight", windowHeight);
            result.put("language", language);
            result.put("version", version);
            result.put("system", system);
            result.put("platform", platform);
            result.put("SDKVersion", SDKVersion);

            callback.onSuccess(result);
        }  catch (JSONException e) {
            callback.onFail();
        }
    }
}
