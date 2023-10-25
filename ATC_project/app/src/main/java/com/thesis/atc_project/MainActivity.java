package com.thesis.atc_project;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;

import com.google.android.material.navigation.NavigationView;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.AppCompatActivity;

import com.thesis.atc_project.ui.activities.Home;
import com.thesis.atc_project.ui.activities.Login;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private DrawerLayout drawerLayout;
    private NavigationView navigationView;
    private Toolbar toolbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        /*------------Hooks-------------*/
        drawerLayout = findViewById(R.id.drawer_layout);
        navigationView = findViewById(R.id.nav_view);
        toolbar = findViewById(R.id.toolbar);

        /*------------Checking login--------------*/
        boolean isLoggedInUser = this.checkUserLoginStatus();
        navigationView.getMenu().clear();
        if(isLoggedInUser){
            navigationView.inflateMenu(R.menu.activity_logged_in_drawer);
        }else{
            navigationView.inflateMenu(R.menu.activity_logged_out_drawer);
        }
        invalidateOptionsMenu();
        /*------------------Layout----------------------*/
        setSupportActionBar(toolbar);
        /*------------------Drawer----------------------*/
        navigationView.bringToFront();
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.menu_drawer_open, R.string.menu_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        navigationView.setNavigationItemSelectedListener(this);

        BackPressedCallback bcb = new BackPressedCallback(this.drawerLayout);
        getOnBackPressedDispatcher().addCallback(this, bcb);
    }

    class BackPressedCallback extends OnBackPressedCallback{
        private final DrawerLayout drawerLayout;
        public BackPressedCallback(DrawerLayout drawerLayout){
            super(true);
            this.drawerLayout = drawerLayout;
        }
        @Override
        public void handleOnBackPressed() {
            if(drawerLayout.isDrawerOpen(GravityCompat.START)){
                drawerLayout.closeDrawer(GravityCompat.START);
            }else{
                getOnBackPressedDispatcher().onBackPressed();
            }
        }
    }

    private boolean checkUserLoginStatus() {
        // TODO: This function should return if a user is logged in or no
        return true;
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        int itemId = item.getItemId();
        if(itemId == R.id.nav_home){
            Intent intent = new Intent(this, Home.class);
            startActivity(intent);
            this.finish();
            return true;
        }else if(itemId == R.id.nav_login){
            Intent i = new Intent(this, Login.class);
            startActivity(i);
            this.finish();
            return true;
        }
        return false;
    }
}