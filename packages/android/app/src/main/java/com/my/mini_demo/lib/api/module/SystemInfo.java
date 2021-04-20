package com.my.mini_demo.lib.api.module;

import android.content.Context;
import android.os.Build;
import android.util.DisplayMetrics;

import com.my.mini_demo.lib.config.MiniConfig;
import com.my.mini_demo.lib.interfaces.IApi;
import com.my.mini_demo.lib.interfaces.ICallback;

import org.json.JSONException;
import org.json.JSONObject;

public class SystemInfo implements IApi {

    private Context mContext;

    private String model;
    private float pixelRatio;
    private int screenWidth;
    private int screenHeight;
    private String language;
    private String version;
    private String system;
    private String platform;
    private String SDKVersion;

    public SystemInfo(Context context) {
        mContext = context;
    }

    @Override
    public String[] apis() {
        return new String[]{"getSystemInfo"};
    }

    @Override
    public void onCreate() {
        DisplayMetrics dm = mContext.getResources().getDisplayMetrics();

        this.model = Build.MODEL;
        this.pixelRatio = dm.density;
        this.screenWidth = dm.widthPixels;
        this.screenHeight = dm.heightPixels;
        this.language = "zh-CN";
        this.version = "0.0.2";
        this.system = Build.VERSION.RELEASE;
        this.platform = "android";
        this.SDKVersion = MiniConfig.VERSION;
    }

    @Override
    public void invoke(String event, JSONObject param, ICallback callback) {
        try {
            JSONObject result = new JSONObject();
            result.put("model", model);
            result.put("pixelRatio", pixelRatio);
            result.put("screenWidth", screenWidth);
            result.put("screenHeight", screenHeight);
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

    @Override
    public void onDestroy() {

    }
}
