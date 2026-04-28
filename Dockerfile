# --- Build React ---
FROM node:22-alpine AS frontend
WORKDIR /app/frontend
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_BASE_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend .
RUN npm run build

# --- Build Spring Boot ---
FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
COPY --from=frontend /app/frontend/dist src/main/resources/static
RUN mvn clean package -DskipTests -q

# --- Runtime ---
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]