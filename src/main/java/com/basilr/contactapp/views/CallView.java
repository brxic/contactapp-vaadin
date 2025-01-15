package com.basilr.contactapp.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;

@Route("call")
public class CallView extends VerticalLayout {

    public CallView() {

        getStyle().set("background-color", "#d8d8d9").set("height", "100vh");

        // header
        VerticalLayout header = new VerticalLayout();
        header.setWidthFull();
        header.getStyle().set("position", "relative");
        header.setAlignItems(Alignment.CENTER);

        // titel
        H3 title = new H3("Direktwahl");
        title.getStyle()
                .set("font-size", "24px")
                .set("font-weight", "bold")
                .set("margin", "10px 0");

        // trenlinie
        Div separator = new Div();
        separator.getStyle()
                .set("background-color", "black")
                .set("height", "2px")
                .set("width", "100%")
                .set("margin", "0");

        // Headerelemente adden
        header.add(title, separator);
        header.setSpacing(false);
        header.setPadding(false);

        // eingabefeld
        TextField numberField = new TextField();
        numberField.setPlaceholder("Nummer eingeben...");
        numberField.setWidth("300px");
        numberField.getStyle()
                .set("border", "none")
                //.set("border-bottom", "2px solid black")
                .set("background-color", "#d8d8d9")
                .set("margin-top", "15px")
                .set("outline", "none");

        // Nummernblock
        VerticalLayout keypad = new VerticalLayout();
        keypad.setAlignItems(Alignment.CENTER);

        String[] keys = {"1", "2", "3", "4", "5", "6", "7", "8", "9"};
        for (int i = 0; i < keys.length; i += 3) {
            HorizontalLayout row = new HorizontalLayout();
            row.setAlignItems(Alignment.CENTER);
            for (int j = i; j < i + 3; j++) {
                final String key = keys[j];
                Button button = new Button(key);
                button.setWidth("60px");
                button.setHeight("60px");
                button.getStyle()
                        .set("border-radius", "50%") // Runde Buttons
                        .set("color", "black")
                        .set("font-weight", "bold")
                        .set("font-size", "20px")
                        .set("padding", "0")
                        .set("box-sizing", "border-box")
                        .set("background-color", "#b7c3cf");
                button.addClickListener(event -> numberField.setValue(numberField.getValue() + key));
                row.add(button);
            }
            keypad.add(row);
        }

        // andere buttons
        HorizontalLayout lastRow = new HorizontalLayout();
        lastRow.setAlignItems(Alignment.CENTER);

        // stern
        Button starButton = new Button(new Icon(VaadinIcon.ASTERISK));
        starButton.setWidth("60px");
        starButton.setHeight("60px");
        starButton.getStyle()
                .set("border-radius", "50%")
                .set("color", "black")
                .set("background-color", "#b7c3cf");
        starButton.addClickListener(event -> numberField.setValue(numberField.getValue() + "*"));

        // 0
        Button zeroButton = new Button("0");
        zeroButton.setWidth("60px");
        zeroButton.setHeight("60px");
        zeroButton.getStyle()
                .set("border-radius", "50%")
                .set("color", "black")
                .set("font-weight", "bold")
                .set("font-size", "20px")
                .set("padding", "0")
                .set("box-sizing", "border-box")
                .set("background-color", "#b7c3cf");
        zeroButton.addClickListener(event -> numberField.setValue(numberField.getValue() + "0"));

        //löschen
        Button clearButton = new Button(new Icon(VaadinIcon.BACKSPACE));
        clearButton.setWidth("60px");
        clearButton.setHeight("60px");
        clearButton.getStyle()
                .set("border-radius", "50%")
                .set("color", "black")
                .set("background-color", "#b7c3cf");
        clearButton.addClickListener(event -> {
            String currentText = numberField.getValue();
            if (!currentText.isEmpty()) {
                numberField.setValue(currentText.substring(0, currentText.length() - 1));
            }
        });

        lastRow.add(starButton, zeroButton, clearButton);
        keypad.add(lastRow);

        // anrufen knopf
        Button callButton = new Button(new Icon(VaadinIcon.PHONE));
        callButton.getStyle()
                .set("background-color", "green")
                .set("color", "white")
                .set("border-radius", "50%")
                .set("width", "60px")
                .set("height", "60px");

        // haupt layout
        VerticalLayout mainLayout = new VerticalLayout(header, numberField, keypad, callButton);
        mainLayout.setAlignItems(Alignment.CENTER);
        mainLayout.setSpacing(true);
        mainLayout.setPadding(true);

        // alles hinzufügen
        add(mainLayout);
    }
}
