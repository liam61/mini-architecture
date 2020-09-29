package com.my.mini_demo.lib.interfaces;

public interface IBridge {

    /**
     * 发布事件，由 Service 层或 View 层的 jSBridge 调用
     */
    void publish(String event, String params, String viewIds);

    /**
     * 调用事件，由 Service 层或 View 层的 jSBridge 调用
     */
    void invoke(String event, String params, String callbackId);

    /**
     * 事件处理完成后的回调
     */
    void callback(String callbackId, String result);
}
