package com.my.mini_demo.lib.api.module;

import android.content.Context;

import com.my.mini_demo.lib.api.BaseApi;
import com.my.mini_demo.lib.interfaces.ICallback;
import com.my.mini_demo.lib.interfaces.OnEventListener;

import org.json.JSONObject;

/**
 * Page api（模拟原生 api）
 */
public class Page extends BaseApi {

    private OnEventListener mListener;

    public Page(Context context, OnEventListener listener) {
        super(context);
        mListener = listener;
    }

    @Override
    public String[] apis() {
        return new String[]{"navigateTo", "navigateBack", "redirectTo", "reLaunch", "setNavigationBarTitle"};
    }

    @Override
    public void invoke(String event, JSONObject param, ICallback callback) {
        boolean res = false;

        if (mListener != null) {
            res = mListener.onPageEvent(event, param.toString());
        }

        if (res) {
            JSONObject json = new JSONObject();
            callback.onSuccess(json);
        } else {
            callback.onFail();
        }
    }
}
