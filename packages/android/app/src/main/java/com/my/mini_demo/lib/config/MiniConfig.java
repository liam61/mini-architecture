package com.my.mini_demo.lib.config;

import android.text.TextUtils;

import com.my.mini_demo.lib.interfaces.IApi;

import java.util.HashMap;
import java.util.Map;

public class MiniConfig {

    public static final String VERSION = "0.0.5-beta2";

    private Builder mBuilder;

    private MiniConfig(Builder builder) {
        mBuilder = builder;
    }

    public Map<String, IApi> getExtendsApi() {
        return mBuilder.extendsApi;
    }

    public static class Builder {
        private Map<String, IApi> extendsApi = new HashMap<>();

        public Builder loadExtendsApi(IApi api) {
            if (api != null && api.apis() != null && api.apis().length > 0) {
                String[] apiNames = api.apis();

                for (String name : apiNames) {
                    if (!TextUtils.isEmpty(name)) {
                        extendsApi.put(name, api);
                    }
                }
            }
            return this;
        }

        public MiniConfig build() {
            return new MiniConfig(this);
        }
    }
}
