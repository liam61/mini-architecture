package com.my.mini_demo.lib.utils;

import android.content.Context;
import android.os.AsyncTask;
import android.text.TextUtils;

import com.my.mini_demo.lib.main.MiniService;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * 文件工具类
 * ../miniDemo/
 * ../miniDemo/$appId/
 * ../miniDemo/$appId/source/ 存放当前小程序源码
 * ../miniDemo/framework/  存放小程序框架
 */
public class FileUtil {

    public static String getPath(Context context) {
        return context.getFilesDir() + "/miniDemo";
    }

    public static File getMiniSourceDir(Context context, String appId) {
        File appDir = new File(getPath(context), appId);

        if (!appDir.exists() || !appDir.isDirectory()) {
            appDir.mkdirs();
        }

        File sourceDir = new File(appDir, "source");

        if (!sourceDir.exists() || !sourceDir.isDirectory()) {
            sourceDir.mkdirs();
        }
        return sourceDir;
    }

    public static File getFrameworkDir(Context context) {
        File frameworkDir = new File(getPath(context), "framework");

        if (!frameworkDir.exists() || !frameworkDir.isDirectory()) {
            frameworkDir.mkdirs();
        }
        return frameworkDir;
    }

    public static boolean unzipFile(InputStream in, String dir) {
        boolean result = false;
        ZipInputStream zis = null;
        FileOutputStream fos = null;

        try {
            zis = new ZipInputStream(in);
            ZipEntry zipEntry = zis.getNextEntry();
            byte[] buffer = new byte[4096];

            while (zipEntry != null) {
                String fileName = zipEntry.getName();

                if (zipEntry.isDirectory()) {
                    File newDir = new File(dir, fileName);
                    newDir.mkdirs();
                } else {
                    File newFile = new File(dir, fileName);
                    fos = new FileOutputStream(newFile);
                    int len;

                    while ((len = zis.read(buffer)) > 0) {
                        fos.write(buffer, 0, len);
                    }
                    fos.flush();
                    fos.close();
                }
                zipEntry = zis.getNextEntry();
            }

            result = true;
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (zis != null) {
                    zis.close();
                }
                if (fos != null) {
                    fos.close();
                }
                in.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    public static void loadMiniApp(Context context, String appId, String appPath, LoadFileCallback callback) {
        new LoadFileTask(context, callback).executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR,
                "app", appId, appPath);
    }

    public static void loadFramework(Context context) {
        new LoadFileTask(context).executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR,
                "framework");
    }

    private static class LoadFileTask extends AsyncTask<String, Void, Boolean> {

        private Context mContext;
        private LoadFileCallback mCallback;

        private LoadFileTask(Context context) {
            this.mContext = context;
        }

        private LoadFileTask(Context context, LoadFileCallback callback) {
            this.mContext = context;
            this.mCallback = callback;
        }

        @Override
        protected Boolean doInBackground(String... params) {
            String type = params[0]; // app | framework
            String appId = "";
            String dirPath = "";

            if (params.length > 1) {
                appId = params[1];
                dirPath = params[2];
            }

            String outputPath;

            if ("app".equals(type)) {
                // appPath 为空则使用 appId
                if (TextUtils.isEmpty(dirPath)) {
                    dirPath = appId + ".zip";
                }
                outputPath = FileUtil.getMiniSourceDir(mContext, appId).getAbsolutePath();
            } else {
                dirPath = MiniService.FRAMEWORK;
                outputPath = FileUtil.getFrameworkDir(mContext).getAbsolutePath();
            }

            InputStream in = null;
            try {
                // 从 assets 获取
                in = mContext.getAssets().open(dirPath);
            } catch (IOException e) {
                e.printStackTrace();
            }

            return unzipFile(in, outputPath);
        }

        @Override
        protected void onPostExecute(Boolean aBoolean) {
            if (mCallback != null) {
                mCallback.onResult(aBoolean);
            }
        }
    }

    public interface LoadFileCallback {
        void onResult(boolean result);
    }
}
