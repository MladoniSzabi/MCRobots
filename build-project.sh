rm -r out
mkdir out

JS_FILES='lua_libs/minecraft_classes'
LUA_FILES='lua_libs/javascript_types/'
ROBOT_FILES='bots'

compile_directory() {
    mkdir out/${@#*/}
    js_files=`ls $@`
    for f in $js_files
    do
        FILE_NAME="$@/${f##*/}"
        compile_path $FILE_NAME
    done
}

compile_path() {
    f=$@
    if [ -d $f ]; then
        compile_directory $f
        return 0
    fi

    echo "Building file $f"
    outputFile="out/${f#*/}"
    outputFile="${outputFile%.*}.lua"
    node index.js $f > $outputFile
} 

cp lua_libs/javascript_functions.lua out
mkdir out/javascript_types

compile_directory $JS_FILES

for f in $LUA_FILES
do
    cp -r $f out/javascript_types/
done

compile_directory $ROBOT_FILES
