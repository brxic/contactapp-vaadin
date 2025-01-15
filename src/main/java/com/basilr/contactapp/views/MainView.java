package com.basilr.contactapp.views;

import com.basilr.contactapp.models.Contact;
import com.basilr.contactapp.services.ContactService;
import com.vaadin.flow.component.AttachEvent;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.listbox.ListBox;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

import java.util.List;

@Route("")
public class MainView extends VerticalLayout {

    private final ListBox<Contact> contactList;
    private final VerticalLayout infoLayout;

    public MainView() {
        // background farbe und volle höhe des geräts
        getStyle().set("background-color", "#d8d8d9").set("height", "100vh");

        // titel
        Span title = new Span("Kontakte");
        title.getStyle()
                .set("font-size", "24px")
                .set("font-weight", "bold")
                .set("text-align", "center")
                .set("display", "block")
                .set("margin", "0 auto");

        // buttons oben links
        // kontakt hinzufügen
        Button addContactButton = new Button(new Icon(VaadinIcon.PLUS));
        addContactButton.getStyle()
                .set("background-color", "#d8d8d9")
                .set("color", "#007bff")
                .set("border", "none")
                .set("border-radius", "5px")
                .set("padding", "10px")
                .set("margin-right", "175px");
        addContactButton.addClickListener(event -> getUI().ifPresent(ui -> ui.navigate(NewContactView.class)));

        // direktwahl
        Button callButton = new Button(new Icon(VaadinIcon.PHONE));
        callButton.getStyle()
                .set("background-color", "#d8d8d9")
                .set("color", "#28a745")
                .set("border", "none")
                .set("border-radius", "5px")
                .set("padding", "10px");
        callButton.addClickListener(event -> getUI().ifPresent(ui -> ui.navigate(CallView.class)));

        // Buttons horizontal anordnen also links
        HorizontalLayout buttonLayout = new HorizontalLayout(addContactButton, callButton);
        buttonLayout.setSpacing(true);
        buttonLayout.setAlignItems(FlexComponent.Alignment.CENTER);
        buttonLayout.getStyle()
                .set("margin-left", "0")
                .set("margin-top", "10px");

        // Buttons links und ttel zentriert
        VerticalLayout header = new VerticalLayout();
        header.setWidthFull();
        header.getStyle().set("position", "relative");

        // Wrapper für den Titel (damit er zentriert ist)
        Div titleWrapper = new Div(title);
        titleWrapper.getStyle()
                .set("position", "absolute")
                .set("top", "10px")
                .set("left", "50%")
                .set("transform", "translateX(-50%)") // zentriert den titl relativ zum header
                .set("text-align", "center");

        // alle elemente zum header
        header.add(buttonLayout, titleWrapper);
        header.setSpacing(false); // Kein zusätzlicher Abstand
        header.setPadding(false);


        // trennlinie
        Div separator = new Div();
        separator.getStyle()
                .set("background-color", "black")
                .set("height", "2px")
                .set("width", "100%")
                .set("margin", "0px");

        // contacts liste
        contactList = new ListBox<>();
        contactList.setRenderer(new com.vaadin.flow.data.renderer.ComponentRenderer<>(contact -> {
            VerticalLayout layout = new VerticalLayout(
                    new Span(contact.getFullName()), // name fett
                    new Span(contact.getDepartment()) // abteilung
            );
            layout.getComponentAt(0).getStyle().set("font-weight", "bold");
            layout.getStyle().set("border-bottom", "1px solid black");
            layout.setSpacing(false);
            return layout;
        }));
        contactList.getStyle().set("background-color", "#d8d8d9").set("border-right", "2px solid black");
        contactList.setHeight("auto");
        refreshContactList();

        // platzhalter box für layout
        VerticalLayout placeholderBox = new VerticalLayout();
        placeholderBox.getStyle()
                .set("background-color", "#d8d8d9")
                .set("color", "gray")
                .set("text-align", "center");
        placeholderBox.setWidth("70%");
        placeholderBox.add(new Span("Bitte wählen Sie einen Kontakt aus."));
        placeholderBox.setVisible(true);

        // details
        VerticalLayout detailView = new VerticalLayout();
        detailView.getStyle()
                .set("background-color", "#d8d8d9")
                .set("display", "flex")
                .set("align-items", "center")
                .set("justify-content", "top")
                .set("height", "100%");
        detailView.setWidth("70%");
        detailView.setVisible(false);

        Image profileImage = new Image("https://excellence.truman.edu/files/2022/02/Photo-Placeholder-Image-150x150-1.jpg", "Profilbild");
        profileImage.setWidth("150px");
        profileImage.setHeight("150px");

        Button infoButton = new Button(new Icon(VaadinIcon.INFO_CIRCLE));
        Button detailCallButton = new Button(new Icon(VaadinIcon.PHONE));
        Button messageButton = new Button(new Icon(VaadinIcon.CHAT));

        // Info knopf
        infoButton.getStyle()
                .set("background-color", "#d8d8d9")
                .set("color", "#007bff")
                .set("border", "none")
                .set("border-radius", "5px")
                .set("width", "50px")
                .set("height", "50px");

        // Call knopf
        detailCallButton.getStyle()
                .set("background-color", "#d8d8d9")
                .set("color", "green")
                .set("border", "none")
                .set("border-radius", "5px")
                .set("width", "50px")
                .set("height", "50px");

        // Message knopf
        messageButton.getStyle()
                .set("background-color", "#d8d8d9")
                .set("color", "#007bff")
                .set("border", "none")
                .set("border-radius", "5px")
                .set("width", "50px")
                .set("height", "50px");

        HorizontalLayout buttonLayoutDetail = new HorizontalLayout(infoButton, detailCallButton, messageButton);
        buttonLayoutDetail.setSpacing(true);
        buttonLayoutDetail.getStyle()
                .set("margin-top", "10px");

        Div separatorDetail = new Div();
        separatorDetail.getStyle()
                .set("background-color", "black")
                .set("height", "2px")
                .set("width", "100%")
                .set("margin-top", "10px");

        Span nameSpan = new Span();
        Span emailSpan = new Span();
        Span phoneSpan = new Span();
        Span departmentSpan = new Span();
        Span positionSpan = new Span();
        Span supervisorSpan = new Span();
        Span branchSpan = new Span();
        Span entryDateSpan = new Span();

        infoLayout = new VerticalLayout(
                nameSpan, emailSpan, phoneSpan, departmentSpan, positionSpan, supervisorSpan, branchSpan, entryDateSpan
        );
        infoLayout.setSpacing(true);
        infoLayout.setVisible(false);

        // Kontakt wählen und details anzeigen
        contactList.addValueChangeListener(event -> {
            Contact selectedContact = event.getValue();

            // infobox schliessen
            infoLayout.setVisible(false);

            if (selectedContact != null) {
                placeholderBox.setVisible(false);
                detailView.setVisible(true);

                // kontaktinfos aktualisieren
                nameSpan.setText("Name: " + selectedContact.getFullName());
                emailSpan.setText("E-Mail: " + selectedContact.getEmail());
                phoneSpan.setText("Telefon: " + selectedContact.getPhone());
                departmentSpan.setText("Abteilung: " + selectedContact.getDepartment());
                positionSpan.setText("Position: " + selectedContact.getPosition());
                supervisorSpan.setText("Vorgesetzter: " + selectedContact.getSupervisor());
                branchSpan.setText("Niederlassung: " + selectedContact.getBranch());
                entryDateSpan.setText("Eintrittsdatum: " + selectedContact.getEntryDate());

                // Info knopf zeigt Kontaktinformationen an
                infoButton.addClickListener(infoEvent -> infoLayout.setVisible(true));

                // Call knopf in der Detailansicht navigiert zur Call view
                detailCallButton.addClickListener(Event -> getUI().ifPresent(ui -> ui.navigate(CallView.class)));
            } else {
                placeholderBox.setVisible(true);
                detailView.setVisible(false);
            }
        });

        VerticalLayout topSection = new VerticalLayout(profileImage, buttonLayoutDetail, separatorDetail);
        topSection.setSpacing(false);
        topSection.setAlignItems(FlexComponent.Alignment.CENTER);
        topSection.setWidthFull();

        detailView.add(topSection, infoLayout);

        // mainlayout
        HorizontalLayout mainLayout = new HorizontalLayout(contactList, placeholderBox, detailView);
        mainLayout.setSizeFull();
        mainLayout.setFlexGrow(1, contactList);
        mainLayout.setFlexGrow(2, placeholderBox);
        mainLayout.setFlexGrow(2, detailView);
        mainLayout.getStyle().set("gap", "20px");

        add(header, separator, mainLayout);
        setWidthFull();
        setHeightFull();
    }

    private void refreshContactList() {
        List<Contact> contacts = ContactService.loadContacts();
        contactList.setItems(contacts);
    }

    @Override
    protected void onAttach(AttachEvent attachEvent) {
        super.onAttach(attachEvent);
    }
}
