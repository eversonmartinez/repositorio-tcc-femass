FROM maven:3-eclipse-temurin-22-alpine AS builder


WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn package -DskipTests

FROM openjdk:22-jdk-slim

EXPOSE 8080
WORKDIR /app
COPY --from=builder /app/target/repositorioDeTcc-0.0.1-SNAPSHOT.jar /app/repositorioDeTcc.jar
CMD ["java", "-jar", "repositorioDeTcc.jar"]