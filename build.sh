#!/bin/bash

echo "Packing Video Speeder..."
(zip -1rq build.zip * -x .git LICENSE README.md build.zip build.sh @) && echo "Finished packing Web Extension. Find it in build.zip file"
