package com.basilr.contactapp.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Contact {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String department;
    private String supervisor;
    private String position;
    private String branch;
    private String entryDate;

    // Parameterloser Konstruktor
    public Contact() {}

    // Konstruktor mit Parametern
    public Contact(String firstName, String lastName, String email, String phone, String department, String supervisor, String position, String branch, String entryDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.supervisor = supervisor;
        this.position = position;
        this.branch = branch;
        this.entryDate = entryDate;
    }

    // getter setter stuff
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(String supervisor) {
        this.supervisor = supervisor;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(String entryDate) {
        this.entryDate = entryDate;
    }

    // getter für fullName für die liste
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
