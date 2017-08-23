#/usr/bin/sh

LIB="${CATALINA_HOME}lib/servlet-api.jar"
LIB2='../lib/*'

sudo javac -classpath $LIB:$LIB2 *.java
