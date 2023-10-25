package com.thesis.atc_project.controls;

import android.content.Context;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;
import com.thesis.atc_project.models.User;

import org.json.JSONException;
import org.json.JSONObject;

public class AuthController {
    private User activeUser;
    private final String API_URL = "https://atc.takacsnet.hu";

    public AuthController() {
        this.activeUser = null;
    }

    public AuthController(User u) {
        this.activeUser = u;
    }

    public User getActiveUser() {
        return activeUser;
    }

    public void setActiveUser(User activeUser) {
        this.activeUser = activeUser;
    }

    /**
     * Performs a connection to the API and tries to log in with the credentials provided
     * @param email The email of the user
     * @param password The password of the user
     * @param context The context the try is performed from
     */
    public void tryPerformLoginWithEmailAndPassword(Context context, String email, String password){
        final String loginUrl = API_URL + "/CONTROLS/login.php";
        JSONObject postBody = new JSONObject();
        try {
            postBody.put("email", email);
            postBody.put("password", password);
        }catch (JSONException e){
            e.printStackTrace();
        }
        RequestQueue queue = Volley.newRequestQueue(context);
        JsonObjectRequest loginRequest = new JsonObjectRequest(Request.Method.POST, loginUrl, postBody,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Gson gson = new Gson();
                        try{
                            String err = response.get("ERROR").toString();
                            Toast errorToast = new Toast(context);
                            errorToast.setDuration(Toast.LENGTH_LONG);
                            errorToast.setText("ERROR: " + err);
                            errorToast.show();
                        }catch (JSONException e){
                            System.out.println("No error in login!");
                        }
                        activeUser = gson.fromJson(response.toString(), User.class);
                        Toast successToast = new Toast(context);
                        successToast.setDuration(Toast.LENGTH_SHORT);
                        successToast.setText("Login successful!");
                        successToast.show();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast t = new Toast(context);
                t.setDuration(Toast.LENGTH_LONG);
                t.setText("Error while logging in: " + error.toString());
                t.show();
            }
        });
        queue.add(loginRequest);
    }
}
