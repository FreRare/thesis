package com.thesis.atc_project.models;

public class Aquarium {

    private int id;
    private String name;
    private int length;
    private int width;
    private int height;

    public Aquarium(int id, String name, int len, int width, int height){
        this.id = id;
        this.name = name;
        this.length = len;
        this.width = width;
        this.height = height;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }
}
