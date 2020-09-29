package com.my.mini_demo.lib.utils;

import android.os.Parcel;
import android.os.Parcelable;
import android.text.TextUtils;

import androidx.annotation.Nullable;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Objects;

public class Event implements Parcelable {
    private String name;
    private String param;
    private String callbackId;

    protected Event(Parcel in) {
        this.name = in.readString();
        this.param = in.readString();
        this.callbackId = in.readString();
    }

    public Event(String name, String param, String callbackId) {
        this.name = name;
        this.param = param;
        this.callbackId = callbackId;
    }

    public String getName() {
        return name;
    }

    public String getCallbackId() {
        return callbackId;
    }

    public JSONObject getParam() {
        if (!TextUtils.isEmpty(param)) {
            try {
                return new JSONObject(param);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return new JSONObject();
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(this.name);
        dest.writeString(this.param);
        dest.writeString(this.callbackId);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<Event> CREATOR = new Creator<Event>() {
        @Override
        public Event createFromParcel(Parcel in) {
            return new Event(in);
        }

        @Override
        public Event[] newArray(int size) {
            return new Event[size];
        }
    };

    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + (param != null ? param.hashCode() : 0);
        result = 31 * result + (callbackId != null ? callbackId.hashCode() : 0);
        return result;
    }

    @Override
    public boolean equals(@Nullable Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;

        Event event = (Event) obj;

        if (!Objects.equals(name, event.name)) return false;
        if (!Objects.equals(param, event.param)) return false;
        return Objects.equals(callbackId, event.callbackId);
    }
}
