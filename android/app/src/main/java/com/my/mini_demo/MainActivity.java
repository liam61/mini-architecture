package com.my.mini_demo;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;

import com.my.mini_demo.lib.main.MiniService;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final String appId = "mini1";
        final String userId = "lawler61";
        final String appPath = "miniDemo.zip";

        findViewById(R.id.button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                MiniService.launchHome(getApplicationContext(), userId, appId, appPath);
            }
        });
    }
}
