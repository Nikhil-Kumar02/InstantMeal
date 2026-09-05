FROM eclipse-temurin:21-jre

WORKDIR /application

COPY target/*.jar application.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","application.jar"]