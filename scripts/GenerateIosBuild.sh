react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios


# Scheme name to identify application
schemename=$1
# Build target for UAT,PROD
buildtarget=$2

# Export File
exportPlistFile=$3

echo "********** Create folder **********"
mkdir build
mkdir build/ios
DIR="build/ios/${schemename}"
 if [ -d "${DIR}" ]; then
    printf '%s\n' "Removing Lock (${DIR})"
    rm -rf "${DIR}"
 fi
 mkdir "build/ios/${schemename}"

archiveLocation="${DIR}/"${schemename}".xcarchive"
ipaLocation="${DIR}"
exportplist="ios/config/${exportPlistFile}"
workspace="ios/pda.xcworkspace"

echo "********** clean the app **********"
xcodebuild clean -workspace "${workspace}" -scheme "${schemename}"

echo "********** build the app **********"
xcodebuild build -workspace "${workspace}" -scheme "${schemename}" -sdk iphoneos  -configuration "${buildtarget}"

echo "********** create the archive **********"
xcodebuild archive -workspace "${workspace}" -scheme "${schemename}" -archivePath "${archiveLocation}"

echo "********** create the ipa : 'allowProvisioningUpdates' used for auto signing **********"
xcodebuild -exportArchive -archivePath "${archiveLocation}" -exportPath "${ipaLocation}" -exportOptionsPlist "${exportplist}" #-allowProvisioningUpdates

echo "********** Done-ios-build  ${ipaLocation} **********"