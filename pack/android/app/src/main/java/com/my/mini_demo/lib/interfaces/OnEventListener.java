package com.my.mini_demo.lib.interfaces;

public interface OnEventListener {

    /**
     * Service 层触发，表示自己已准备完
     */
    void onServiceReady();

    /**
     * Service 层触发，通知 View 层的 Subscriber
     */
    void notifyPageSubscribers(String event, String params, int[] viewIds);

    /**
     * Page 层触发，通知 Service 层的 Subscriber
     */
    void notifyServiceSubscribers(String event, String params, int viewId);

    /**
     * Service 层触发，通知 Page 层处理界面相关 api 事件
     */
    boolean onPageEvent(String event, String params);
}
