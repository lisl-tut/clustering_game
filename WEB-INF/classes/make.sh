#/usr/bin/sh

LIB="${CATALINA_HOME}lib/servlet-api.jar"
sudo javac -classpath $LIB *.java
