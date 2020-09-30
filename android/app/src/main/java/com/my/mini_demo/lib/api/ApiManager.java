package com.my.mini_demo.lib.api;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.text.TextUtils;
import android.util.Log;
import android.util.Pair;

import com.my.mini_demo.lib.api.module.Page;
import com.my.mini_demo.lib.api.module.SystemInfo;
import com.my.mini_demo.lib.config.AppConfig;
import com.my.mini_demo.lib.interfaces.IApi;
import com.my.mini_demo.lib.interfaces.IBridge;
import com.my.mini_demo.lib.interfaces.ICallback;
import com.my.mini_demo.lib.interfaces.OnEventListener;
import com.my.mini_demo.lib.main.MiniService;
import com.my.mini_demo.lib.utils.Event;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * api 统一管理
 */
public class ApiManager {

    private Activity mActivity;
    private final Map<String, IApi> APIS = new HashMap<>();

    public ApiManager(Activity activity, OnEventListener listener, AppConfig appConfig) {
        mActivity = activity;

        initSdkApi(listener, appConfig);
    }

    /**
     * Activity onCreate 时调用
     */
    public void onCreate() {
        for (Map.Entry<String, IApi> entry : APIS.entrySet()) {
            IApi api = entry.getValue();
            if (api != null) {
                api.onCreate();
            }
        }
    }

    /**
     * Activity onDestroy 时调用
     */
    public void onDestroy() {
        for (Map.Entry<String, IApi> entry : APIS.entrySet()) {
            IApi api = entry.getValue();
            if (api != null) {
                api.onDestroy();
            }
        }

        APIS.clear();
    }

    public void invokeApi(Event event, IBridge bridge) {
        ICallback callback = new ApiCallback(event, bridge);
        IApi api = APIS.get(event.getName());

        if (api == null) {
            // 看 extendsApi 中是否存在
            Map<String, IApi> extendsApi = MiniService.getConfig().getExtendsApi();

            if (extendsApi != null && !extendsApi.isEmpty()) {
                api = extendsApi.get(event.getName());
            }
        }

        if (api != null) {
            api.invoke(event.getName(), event.getParam(), callback);
        }
    }

    private void initSdkApi(OnEventListener listener, AppConfig appConfig) {
        load(new Page(mActivity, listener));
        load(new SystemInfo(mActivity));
        // ...
    }
    
    private void load(IApi api) {
        if (api != null && api.apis() != null && api.apis().length > 0) {
            String[] apiNames = api.apis();
            for (String name : apiNames) {
                if (!TextUtils.isEmpty(name)) {
                    APIS.put(name, api);
                }
            }
        }
    }

    /**
     * api callback 实现类
     */
    private class ApiCallback implements ICallback {
        private Event event;
        private IBridge bridge;

        private ApiCallback(Event event, IBridge bridge) {
            this.event = event;
            this.bridge = bridge;
        }

        @Override
        public void onSuccess(JSONObject result) {
            String res = assembleResult(result, event.getName(), "ok");
            Log.d("MiniDemo", String.format("call api success! event=%s, result=%s",
                    event.getName(), res));

            if (bridge != null) {
                bridge.callback(event.getCallbackId(), res);
            }
        }

        @Override
        public void onFail() {
            Log.d("MiniDemo", String.format("call api fail! event=%s",
                    event.getName()));

            if (bridge != null) {
                bridge.callback(event.getCallbackId(),
                        assembleResult(null, event.getName(), "fail"));
            }
        }

        @Override
        public void onCancel() {
            if (bridge != null) {
                bridge.callback(event.getCallbackId(),
                        assembleResult(null, event.getName(), "cancel"));
            }
        }

        @Override
        public void startActivityForResult(Intent intent, int requestCode) {
            PackageManager pm = mActivity.getPackageManager();

            if (intent.resolveActivity(pm) != null) {
                mActivity.startActivityForResult(intent, requestCode);
            } else {
                onFail();
            }
        }

        private String assembleResult(JSONObject data, String event, String status) {
            if (data == null) {
                data = new JSONObject();
            }

            try {
                data.put("status", event + ", " + status);
                data.put("success", status.equals("ok"));
            } catch (JSONException e) {
                e.printStackTrace();
            }
            return data.toString();
        }
    }
}
