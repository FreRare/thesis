package com.thesis.atc_project.ui.configurator;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class ConfiguratorViewModel extends ViewModel {

    private final MutableLiveData<String> mText;

    public ConfiguratorViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is slideshow fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}