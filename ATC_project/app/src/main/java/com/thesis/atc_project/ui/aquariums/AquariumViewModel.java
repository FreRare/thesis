package com.thesis.atc_project.ui.aquariums;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class AquariumViewModel extends ViewModel {

    private final MutableLiveData<String> mText;

    public AquariumViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is gallery fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}