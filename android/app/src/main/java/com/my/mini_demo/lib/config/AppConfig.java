package com.my.mini_demo.lib.config;

import android.content.Context;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;

import com.my.mini_demo.lib.utils.FileUtil;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONStringer;

import java.io.File;

public class AppConfig {

    private String mAppId;
    private String mUserId;
    private JSONObject mConfig;
    private WindowConfig mWindowConfig;


    public AppConfig(String appId, String userId) {
        mAppId = appId;
        mUserId = userId;
    }

    public String getAppId() {
        return mAppId;
    }

    public String getUserId() {
        return mUserId;
    }

    /**
     * @param config json 字符串
     */
    public void initConfig(String config) {
        try {
            JSONObject obj = new JSONObject(config);
            String paramStr = obj.optString("config");
            mConfig = new JSONObject(paramStr);
        } catch(JSONException e) {
            e.printStackTrace();
        }

        JSONObject windowJson = mConfig.optJSONObject("window");
        if (windowJson != null) {
            mWindowConfig = new WindowConfig();
            mWindowConfig.navigationBarTitleText = windowJson.optString("navigationBarTitleText");
            mWindowConfig.pages = windowJson.optJSONObject("pages");
        }
    }

    public String getMiniAppSourcePath(Context context) {
        return FileUtil.getMiniSourceDir(context, mAppId).getAbsolutePath() + File.separator;
    }

    public String getPageTitle(String url) {
        if (mWindowConfig == null) {
            return "";
        }

        if (mWindowConfig.pages == null)  {
            return mWindowConfig.navigationBarTitleText;
        }

        JSONObject pageConfig = mWindowConfig.pages.optJSONObject(getPath(url));

        if (pageConfig == null)  {
            return mWindowConfig.navigationBarTitleText;
        }
        return pageConfig.optString("navigationBarTitleText");
    }

    private String getPath(String url) {
        if (TextUtils.isEmpty(url)) {
            return "";
        }

        Uri uri = Uri.parse(url);
        String pagePath = uri.getPath();

        if (TextUtils.isEmpty(pagePath)) {
            return "";
        }

        int index = pagePath.lastIndexOf(".");
        
        if (index > 0) {
            pagePath = pagePath.substring(0, index);
        }
        return pagePath;
    }

    public String getRootPath() {
        if (mConfig == null) {
            return "";
        }

        // 打包时注入
        String root = mConfig.optString("root");
        return TextUtils.isEmpty(root) ? "" : root + ".html";
    }

    private static class WindowConfig {
        String navigationBarTitleText; // 导航栏标题
        JSONObject pages; // 界面标题配置
    }
}
