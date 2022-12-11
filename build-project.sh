rm -r out
mkdir out

JS_FILES='lua_libs/minecraft_classes/* '
LUA_FILES='lua_libs/javascript_types/*'
ROBOT_FILES='bots/*'

cp lua_libs/javascript_functions.lua out
mkdir out/minecraft_classes
mkdir out/javascript_types

for f in $JS_FILES
do
    FILE_NAME=${f##*/}
    echo "Building file $f"
    node index.js $f > out/minecraft_classes/${FILE_NAME%.*}.lua
done

for f in $LUA_FILES
do
    cp $f out/javascript_types/
done

for f in $ROBOT_FILES
do
    FILE_NAME=${f##*/}
    node index.js $f > out/${FILE_NAME%.*}.lua
done

#rm -r out