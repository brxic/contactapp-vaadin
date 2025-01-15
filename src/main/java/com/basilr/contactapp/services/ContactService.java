package com.basilr.contactapp.services;

import com.basilr.contactapp.models.Contact;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ContactService {

    private static final String FILE_PATH = "src/main/resources/contacts.json";
    private static final ObjectMapper mapper = new ObjectMapper();

    // Kontakte laden
    public static List<Contact> loadContacts() {
        try {
            File file = new File(FILE_PATH);
            if (file.exists()) {
                return mapper.readValue(file, new TypeReference<>() {});
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    // Kontakt speichern
    public static void saveContact(Contact contact) {
        List<Contact> contacts = loadContacts();
        contacts.add(contact);
        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File(FILE_PATH), contacts);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
