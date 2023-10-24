package com.thesis.atc_project.ui.configurator;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.thesis.atc_project.databinding.FragmentConfiguratorBinding;

public class ConfiguratorFragment extends Fragment {

    private FragmentConfiguratorBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        ConfiguratorViewModel slideshowViewModel =
                new ViewModelProvider(this).get(ConfiguratorViewModel.class);

        binding = FragmentConfiguratorBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textConfigurator;
        slideshowViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}