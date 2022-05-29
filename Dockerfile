FROM openjdk:11
WORKDIR /app
ADD target/*.jar ./app.jar
EXPOSE ${PORT}
CMD java -jar ./app.jar