# Build*Stage
FROM maven:3.9.9-eclipse-tem*rin-21 AS build

WORKDIR /app

COP* . .

RUN mvn clean package -Dskip*ests

# Runtime Stage
FROM eclipse*temurin:21-jre

WORKDIR /applicati*n

COPY --from=build /app/target/**jar application.jar

EXPOSE 8080

*NTRYPOINT ["java", "-jar", "applic*tion.jar"]