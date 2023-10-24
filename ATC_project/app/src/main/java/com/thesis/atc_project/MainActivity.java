package com.thesis.atc_project;

import android.os.Bundle;
import android.view.Menu;
import com.google.android.material.navigation.NavigationView;

import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.AppCompatActivity;

import com.thesis.atc_project.databinding.ActivityMainBinding;

import java.util.HashSet;
import java.util.Set;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration mAppBarConfiguration;
    private NavController navController;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);

        com.thesis.atc_project.databinding.ActivityMainBinding binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setSupportActionBar(binding.appBarMain.toolbar);

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;
        Set<Integer> topLevelDestinations = new HashSet<>(); // To store active menu items
        // Checking if user is logged in
        boolean isUserLoggedIn = this.checkUserLoginStatus();
        navigationView.getMenu().clear();
        if(isUserLoggedIn){
            topLevelDestinations.add(R.id.nav_home);
            topLevelDestinations.add(R.id.nav_aquariums);
            topLevelDestinations.add(R.id.nav_configurator);
            topLevelDestinations.add(R.id.nav_profile);
            topLevelDestinations.add(R.id.nav_logout);
            navigationView.inflateMenu(R.menu.activity_logged_in_drawer);
        }else{
            topLevelDestinations.add(R.id.nav_login);
            topLevelDestinations.add(R.id.nav_register);
            topLevelDestinations.add(R.id.nav_help);
            navigationView.inflateMenu(R.menu.activity_logged_out_drawer);
        }
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        mAppBarConfiguration = new AppBarConfiguration.Builder(topLevelDestinations)
                .setOpenableLayout(drawer)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        // Setting up menu click listener
        navigationView.setNavigationItemSelectedListener(item->{
            int itemId = item.getItemId();
            if(itemId == R.id.nav_home){
                this.navController.navigate(R.id.nav_home);
                return true;
            }else if(itemId == R.id.nav_aquariums){
                this.navController.navigate(R.id.nav_aquariums);
                return true;
            }else if(itemId == R.id.nav_configurator){
                this.navController.navigate(R.id.nav_configurator);
                return true;
            }else if(itemId == R.id.nav_profile){
                this.navController.navigate(R.id.nav_profile);
                return true;
            }else if(itemId == R.id.nav_login){
                this.navController.navigate(R.id.nav_login);
                return true;
            }else if(itemId == R.id.nav_register){
                this.navController.navigate(R.id.nav_register);
                return true;
            }else if(itemId == R.id.nav_logout){
                this.navController.navigate(R.id.nav_logout);
                return true;
            }else if(itemId == R.id.nav_help){
                this.navController.navigate(R.id.nav_help);
                return true;
            }
            return false;
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }

    private boolean checkUserLoginStatus(){
        // TODO: This function should return if a user is logged in or no
        return false;
    }
}