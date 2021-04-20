package com.my.mini_demo.lib.config;

import android.content.Context;
import android.net.Uri;
import android.text.TextUtils;

import com.my.mini_demo.lib.utils.FileUtil;
import com.my.mini_demo.lib.utils.JsonUtil;

import org.json.JSONException;
import org.json.JSONObject;

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

    /**
     * @param config json 字符串
     */
    public void initConfig(String config) {
        String paramStr = JsonUtil.getStringValue(config, "config", null);
        try {
            mConfig = new JSONObject(paramStr);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JSONObject windowJson = mConfig.optJSONObject("window");
        if (windowJson != null) {
            mWindowConfig = new WindowConfig(
                    windowJson.optString("navigationBarTitleText"), windowJson.optJSONObject("pages"));
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

        String pageTitle = mWindowConfig.pages.optString(getPath(url));

        if (TextUtils.isEmpty((pageTitle)))  {
            return mWindowConfig.navigationBarTitleText;
        }
        return pageTitle;
    }

    public String getPath(String url) {
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

        // 打包时注入 root
        String root = mConfig.optString("root");
        return TextUtils.isEmpty(root) ? "" : root + ".html";
    }

    private static class WindowConfig {
        String navigationBarTitleText; // 导航栏标题
        JSONObject pages; // 界面标题配置

        WindowConfig(String title, JSONObject pages) {
            this.navigationBarTitleText = title;
            this.pages = pages;
        }
    }
}
