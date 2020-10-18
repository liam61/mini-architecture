package com.my.mini_demo.hostapi;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.text.TextUtils;

import com.my.mini_demo.lib.interfaces.IApi;
import com.my.mini_demo.lib.interfaces.ICallback;

import org.json.JSONObject;

/**
 * custom api：打开链接
 */
public class OpenLink implements IApi {

    private Context mContext;

    public OpenLink(Context context) {
        mContext = context;
    }

    @Override
    public String[] apis() {
        return new String[]{"openLink"};
    }

    @Override
    public void invoke(String event, JSONObject param, ICallback callback) {
        String url = param.optString("url");

        if (!TextUtils.isEmpty(url)) {
            Intent intent = new Intent();
            intent.setAction(Intent.ACTION_VIEW);
            Uri uri = Uri.parse(url);

            intent.setData(uri);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            // 启动 Activity 以加载 url
            mContext.startActivity(intent);
            callback.onSuccess(null);
        } else {
            callback.onFail();
        }
    }

    @Override
    public void onCreate() {

    }

    @Override
    public void onDestroy() {

    }
}
