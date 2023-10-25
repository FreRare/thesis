package com.thesis.atc_project.models;

import com.google.gson.annotations.SerializedName;

public class User {
    @SerializedName("email")
    private String email;
    @SerializedName("password")
    private String password;
    @SerializedName("firstName")
    private String firstName;
    @SerializedName("lastName")
    private String lastName;

    public User(String email, String password, String firstName, String lastName){
        if(email.isEmpty() || password.isEmpty() || firstName.isEmpty() || lastName.isEmpty()){
            System.err.println("Invalid parameters in constructor!");
            return;
        }
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
