package com.my.mini_demo.lib.api;

import android.content.Context;
import android.content.Intent;

import com.my.mini_demo.lib.interfaces.IApi;
import com.my.mini_demo.lib.interfaces.ICallback;

public abstract class BaseApi implements IApi {

    private Context mContext;

    public BaseApi(Context context) {
        mContext = context;
    }

    public Context getContext() {
        return mContext;
    }

    @Override
    public void onCreate() {
    }

    @Override
    public void onDestroy() {
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data, ICallback callback) {
    }
}
