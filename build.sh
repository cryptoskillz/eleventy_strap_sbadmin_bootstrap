# Detect param or set default to local:
if [ -z $1 ]
then
echo -e 'No environment param set.\n Defaulting to local'
export ELEVENTY_ENV='local'
else 
export ELEVENTY_ENV=$1
fi

wipeOutOldBuild () {
    echo 'Wiping out old build directory'
    rm -rf ./_site/**
}

#delete the files in the site dir
wipeOutOldBuild
#run eleventy
eleventy 