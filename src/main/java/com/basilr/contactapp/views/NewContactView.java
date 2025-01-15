package com.basilr.contactapp.views;

import com.basilr.contactapp.models.Contact;
import com.basilr.contactapp.services.ContactService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;

import java.time.LocalDate;

@Route("newcontact")
public class NewContactView extends VerticalLayout {

    public NewContactView() {

        getStyle().set("background-color", "#d8d8d9").set("height", "100vh");

        // titel
        H3 title = new H3("Neuer Kontakt");
        title.getStyle()
                .set("font-size", "24px")
                .set("font-weight", "bold")
                .set("margin", "10px 0");

        VerticalLayout header = new VerticalLayout(title);
        header.setWidthFull();
        header.setAlignItems(Alignment.CENTER);
        header.setSpacing(false);
        header.setPadding(false);

        // Profilbild platzhalter
        Image profileImage = new Image("https://excellence.truman.edu/files/2022/02/Photo-Placeholder-Image-150x150-1.jpg", "Profilbild");
        profileImage.setWidth("150px");
        profileImage.setHeight("150px");

        Button uploadButton = new Button(new Icon(VaadinIcon.PLUS));
        uploadButton.getStyle()
                .set("color", "#007bff")
                .set("background-color", "#d8d8d9")
                .set("margin-top", "100px")
                .set("margin-left", "0px")
                .set("padding", "-20px");


        HorizontalLayout profileSection = new HorizontalLayout(profileImage, uploadButton);
        profileSection.setSpacing(true);
        profileSection.setAlignItems(Alignment.CENTER);

        // namen
        TextField firstNameField = new TextField("Vorname");
        firstNameField.setPlaceholder("z.B. Max");
        TextField lastNameField = new TextField("Name");
        lastNameField.setPlaceholder("z.B. Mustermann");
        HorizontalLayout nameFields = new HorizontalLayout(firstNameField, lastNameField);
        nameFields.setSpacing(true);

        // kontaktieren
        EmailField emailField = new EmailField("E-Mail");
        emailField.setPlaceholder("beispiel@beispiel.com");
        TextField phoneField = new TextField("Telefon");
        phoneField.setPlaceholder("+41 12 345 67 89");
        // probiert mit numberfield aber geht nicht wegen funktion


        HorizontalLayout contactFields = new HorizontalLayout(emailField, phoneField);
        contactFields.setSpacing(true);

        // business felder
        TextField departmentField = new TextField("Abteilung");
        departmentField.setPlaceholder("z.B. IT");
        TextField supervisorField = new TextField("Vorgesetzter");
        supervisorField.setPlaceholder("z.B. Max Mustermann");
        HorizontalLayout businessFields = new HorizontalLayout(departmentField, supervisorField);
        businessFields.setSpacing(true);

        // position und standort
        TextField positionField = new TextField("Position");
        positionField.setPlaceholder("z.B. Chef");
        TextField branchField = new TextField("Niederlassung");
        branchField.setPlaceholder("z.B. Basel");
        HorizontalLayout locationalFields = new HorizontalLayout(positionField, branchField);
        locationalFields.setSpacing(true);

        // eintrittsdatum

        DatePicker entryDateField = new DatePicker("Eintrittsdatum");
        entryDateField.setPlaceholder("z.B. " + String.valueOf(LocalDate.now()));
        //entryDateField.setLocale(Locale.GERMAN);

        // abbrechen und fertigstellen
        Button cancelButton = new Button("Abbrechen", event -> getUI().ifPresent(ui -> ui.navigate(MainView.class)));
        cancelButton.getStyle()
                .set("background-color", "black")
                .set("color", "white")
                .set("border", "none")
                .set("padding", "10px 20px");

        Button saveButton = new Button("Speichern", event -> {
            Notification notification = Notification.show("Kontakt gespeichert!", 3000, Notification.Position.BOTTOM_CENTER);
            notification.addThemeVariants(NotificationVariant.LUMO_SUCCESS);

            LocalDate selectedDate = entryDateField.getValue();
            String formattedDate = (selectedDate != null) ? selectedDate.toString() : "kein Datum ausgewählt";

            Contact newContact = new Contact(
                    firstNameField.getValue(),
                    lastNameField.getValue(),
                    emailField.getValue(),
                    phoneField.getValue(),
                    departmentField.getValue(),
                    supervisorField.getValue(),
                    positionField.getValue(),
                    branchField.getValue(),
                    formattedDate
            );
            ContactService.saveContact(newContact);
            getUI().ifPresent(ui -> ui.navigate(MainView.class));
        });
        saveButton.getStyle()
                .set("background-color", "black")
                .set("color", "white")
                .set("border", "none")
                .set("padding", "10px 20px");

        HorizontalLayout buttons = new HorizontalLayout(cancelButton, saveButton);
        buttons.setSpacing(true);

        // alles zusammenfügen
        add(
                header,
                profileSection,
                nameFields,
                contactFields,
                businessFields,
                locationalFields,
                entryDateField,
                buttons
        );
        setSpacing(true);
        setPadding(true);
        setAlignItems(Alignment.CENTER);
    }
}
