package com.my.mini_demo.lib.page;

import android.content.Context;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

import com.my.mini_demo.R;
import com.my.mini_demo.lib.config.AppConfig;
import com.my.mini_demo.lib.interfaces.IBridge;
import com.my.mini_demo.lib.interfaces.OnEventListener;
import com.my.mini_demo.lib.page.view.NavigationBar;
import com.my.mini_demo.lib.web.MyWebChromeClient;
import com.my.mini_demo.lib.web.MyWebView;
import com.my.mini_demo.lib.web.MyWebViewClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;

/**
 * 小程序 View 层，加载相应的 xxxPage.html
 */
public class MiniPage extends LinearLayout implements IBridge {

    private Context mContext;
    private AppConfig mAppConfig;
    private String mPagePath;
    private String mOpenType;
    private MyWebView mCurWebView;
    private NavigationBar mNavBar;
    private FrameLayout mWebLayout;
    private OnEventListener mListener;

    public MiniPage(Context context, String pagePath, AppConfig appConfig) {
        super(context);

        mContext = context;
        mAppConfig = appConfig;
        mPagePath = pagePath;

        init();
    }

    private void init() {
        // 设置 page layout
        inflate(mContext, R.layout.my_page, this);
        LinearLayout topLayout = findViewById(R.id.page_top);
        mWebLayout = findViewById(R.id.page_view);

        mNavBar = new NavigationBar(mContext);
        topLayout.addView(mNavBar, new LayoutParams(LayoutParams.MATCH_PARENT, 140));

        MyWebView webView = new MyWebView(mContext, this);
        // 控制 webview 中的网页跳转依然在 webview 中打开
        webView.setWebViewClient(new MyWebViewClient(mAppConfig));
        webView.setWebChromeClient(new MyWebChromeClient());
        mCurWebView = webView;

        mWebLayout.addView(webView, new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));

        Log.e("MiniDemo", "page inited");
    }

    public int getViewId() {
        return mCurWebView != null ? mCurWebView.getViewId() : 0;
    }

    public boolean onLaunchHome(String url) {
        return loadUrl(url, "appLaunch");
    }

    public boolean onNavigateTo(String url) {
        return loadUrl(url, "navigateTo");
    }

    /**
     * 导航回到此界面
     */
    public boolean onNavigateBack() {
        mOpenType = "navigateBack";
        return onDomContentLoaded();
    }

    public boolean onRedirectTo(String url) {
        return false;
    }

    public boolean onReLaunch(String url) {
        return false;
    }

    public void setNavigationBarTitle(String title) {
        // 调用原生的 Toolbar setTitle
        mNavBar.setTitle(title);
    }

    private boolean loadUrl(String url, String openType) {
        if (TextUtils.isEmpty(url) || mCurWebView == null) {
            return false;
        }

        mPagePath = url;
        mOpenType = openType;

        return post(new Runnable() {
            @Override
            public void run() {
                Uri uri = Uri.parse(mPagePath);
                String path = uri.getPath();

                if (path == null) {
                    return;
                }

                mNavBar.setTitle(mAppConfig.getPageTitle(mPagePath));
                // 加载 pages/xxx.html
                File viewFile = new File(mAppConfig.getMiniAppSourcePath(getContext()), mPagePath);
                String viewPath = Uri.fromFile(viewFile).toString();
                mCurWebView.loadUrl(viewPath);
            }
        });
    }

    public void setEventListener(OnEventListener listener) {
        this.mListener = listener;
    }

    /**
     * DOM 加载完成
     */
    private boolean onDomContentLoaded() {
        if (mListener != null) {
            String eventName = "onAppRoute";
            String eventParams;

            try {
                JSONObject json = new JSONObject();
                json.put("webviewId", getViewId());
                json.put("openType", mOpenType);

                if (!TextUtils.isEmpty(mPagePath)) {
                    Uri uri = Uri.parse(mPagePath);
                    json.put("path", mAppConfig.getPath(uri.getPath()));
                    // Set<String> keys = uri.getQueryParameterNames(); // foreach
                }

                eventParams = json.toString();
                mListener.notifyServiceSubscribers(eventName, eventParams, getViewId());
                return true;
            } catch (JSONException e) {
                Log.e("MiniDemo", "onDomContentLoaded assembly params exception");
            }
        }
        return false;
    }

    public void subscribeHandler(String event, String params, int[] viewIds) {
        if (viewIds == null || viewIds.length == 0) {
            return;
        }

        int count = mWebLayout.getChildCount();
        for (int i = 0; i < count; i++) {
            MyWebView webView = (MyWebView) mWebLayout.getChildAt(i);

            for (int viewId : viewIds) {
                if (viewId == webView.getViewId()) {
                    String jsFun = String.format("javascript:subscribeHandler('%s', %s)",
                            event, params);
                    webView.loadUrl(jsFun);
                    break;
                }
            }
        }
    }

    @Override
    public void publish(String event, String params, String viewIds) {
        if ("custom_event_DOMContentLoaded".equals(event)) {
            onDomContentLoaded();
        } else {
            mListener.notifyServiceSubscribers(event, params, getViewId());
        }
    }

    @Override
    public void invoke(String event, String params, String callbackId) { }

    @Override
    public void callback(String callbackId, String result) { }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();

        int count = mWebLayout.getChildCount();

        for (int i = 0; i < count; i++) {
            MyWebView webView = (MyWebView) mWebLayout.getChildAt(i);
            webView.destroy();
        }

        mWebLayout.removeAllViews();
        removeAllViews();
    }
}
