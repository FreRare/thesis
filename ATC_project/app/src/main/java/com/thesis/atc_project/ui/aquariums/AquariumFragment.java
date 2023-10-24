package com.thesis.atc_project.ui.aquariums;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.thesis.atc_project.databinding.FragmentAquariumsBinding;

public class AquariumFragment extends Fragment {

    private FragmentAquariumsBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        AquariumViewModel galleryViewModel =
                new ViewModelProvider(this).get(AquariumViewModel.class);

        binding = FragmentAquariumsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textAquariums;
        galleryViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}