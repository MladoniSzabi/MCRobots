isAntlr=$(ls transpiler/ | grep antlr-4.*-complete.jar)
if [ "$isAntlr" = "" ]; then
    echo "You must have an antlr4 jar in the transpiler folder."
    exit
fi

alias antlr4='java -jar $(pwd)/transpiler/antlr-4.10.1-complete.jar'
alias grun='java org.antlr.v4.gui.TestRig'

if [ "$1" = "debug" ]; then
    antlr4 -lib transpiler -o grun -Xexact-output-dir -no-listener transpiler/Javascript.g4
    CLASSPATH=$(pwd)/transpiler/antlr-4.10.1-complete.jar:.
    cd grun
    javac -classpath "$CLASSPATH" Javascript*.java
    echo "Enter text:"
    java -cp "$CLASSPATH" org.antlr.v4.gui.TestRig Javascript program -gui
    cd ..
    rm -r grun
else
    antlr4 -Dlanguage=JavaScript -lib transpiler -o lib -visitor -Xexact-output-dir transpiler/Javascript.g4 -no-listener
fi