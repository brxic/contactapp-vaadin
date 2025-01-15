# ContactApp-Vaadin

A **contact management application** developed with [Vaadin](https://vaadin.com/). The application allows you to efficiently manage, add, and edit contacts.

> **Note:** The project documentation and code comments are in German because this project was created as part of an assignment at an IT school in Germany/Switzerland.

## Features
- **Add Contacts**: Save new contacts with names and details.
- **View Contacts**: Display a list of all saved contacts.
- **Edit Contacts**: Update existing contact information.
- **Data Management**: Use JSON files for storing and managing contact data.

## Technologies
- **Java**: The primary programming language.
- **Vaadin Framework**: For modern UI development.
- **Maven**: For build and dependency management.
- **JSON**: For data storage and retrieval.
- **Spring Boot (if applicable)**: For backend support.

## Requirements
- **Java 17** or higher
- **Maven** installed
- **Git** for version control

## Installation and Running the Application
1. **Clone the repository**:
   ```bash
   git clone https://github.com/brxic/contactapp-vaadin.git
   cd contactapp-vaadin
   ```

2. **Install dependencies**:
   Ensure all dependencies are installed via Maven:
   ```bash
   mvn install
   ```

3. **Start the application**:
   ```bash
   mvn spring-boot:run
   ```

4. **Access in the browser**:
   The application will be available at [http://localhost:8080](http://localhost:8080).

## Project Structure
- **src/main/java**: Main application code.
  - `com.brixic.contactapp.models`: Data models like `Contact`.
  - `com.brixic.contactapp.services`: Services for data handling.
  - `com.brixic.contactapp.views`: Vaadin UI components.
- **src/main/resources**: Resources such as `application.properties` and JSON data.
- **target**: Automatically generated files after building.
- **pom.xml**: Maven configuration file.
