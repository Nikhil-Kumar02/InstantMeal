# Build Stage*FROM maven:3.9.9-eclipse-temurin-2* AS build

WORKDIR /app

COPY . .
*RUN mvn clean package -DskipTests
*# Runtime Stage
FROM eclipse*temurin:21-jre

WORKDIR /applicati*n

COPY --from=build /app/target/*.jar application.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","application.jar"]