# --- Build React ---
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY frontend .
RUN yarn build

# --- Build Spring Boot ---
FROM maven:3.9.6-eclipse-temurin-17 AS backend
WORKDIR /app
COPY backend/pom.xml .
RUN mvn dependency:go-offline
COPY backend .
COPY --from=frontend /app/frontend/build src/main/resources/static
RUN mvn clean package -DskipTests

# --- Run app ---
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=backend /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]