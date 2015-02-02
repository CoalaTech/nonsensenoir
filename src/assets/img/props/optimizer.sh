#!/bin/bash

OUTPUT_FOLDER="optimized/"
echo $OUTPUT_FOLDER
mkdir -p $OUTPUT_FOLDER

for name in *
do
	if [ "${name/*./}" = "png" ]; then
		# echo $name $OUTPUT_FOLDER$name
		# cp $name $OUTPUT_FOLDER$name
		pngcrush -rem allb -brute -reduce $name $OUTPUT_FOLDER$name
	fi
done