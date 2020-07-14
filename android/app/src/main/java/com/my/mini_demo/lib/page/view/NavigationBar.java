package com.my.mini_demo.lib.page.view;

import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.view.View;
import android.widget.Toolbar;

import androidx.appcompat.content.res.AppCompatResources;

import com.my.mini_demo.R;

/**
 * 自定义导航栏
 */
public class NavigationBar extends Toolbar {

    public NavigationBar(Context context) {
        super(context);
        init(context);
    }

    private void init(Context context) {
        Drawable drawable = AppCompatResources.getDrawable(context, R.drawable.my_ic_arrow_back);

        setBackgroundColor(Color.CYAN);
        setNavigationIcon(drawable);
        setNavigationOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                onBack(v.getContext());
            }
        });
    }

    public void onBack(Context context) {
        if (context instanceof Activity) {
            ((Activity) context).onBackPressed();
        } else if (context instanceof ContextWrapper) {
            onBack(((ContextWrapper) context).getBaseContext());
        }
    }
}
