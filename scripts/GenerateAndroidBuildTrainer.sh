
clear
# Remove Bundle
rm android/app/src/trainer/assets/index.android.bundle
# Create Folder
mkdir android/app/src/trainer/assets

# Generate Bundle to trainer Dir 
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/trainer/assets/index.android.bundle --assets-dest android/app/src/trainer/res/

# Assemble build
cd android && ./gradlew clean && ./gradlew assembleTrainerRelease -x bundleTrainerReleaseJsAndAssets
cd ..
# cd android && ./gradlew clean && ./gradlew assembleTrainerRelease

# Copy file to Build Folder ------------------- START
echo "            /********************* Copy file to Build Folder *************************************/"
# variables
export GRADLE_PATH=./android/app/build.gradle   # path to the gradle file
export GRADLE_FIELD="versionName"   # field name
# logic
export VERSION_TMP=$(grep $GRADLE_FIELD $GRADLE_PATH | awk '{print $2}')    # get value versionName"0.1.0"
export VERSION=$(echo $VERSION_TMP | sed -e 's/^"//'  -e 's/"$//')  # remove quotes 0.1.0

IFS=' ' # space is set as delimiter
read -ra ADDR <<< "$VERSION" # str is read into an array as tokens separated by IFS
VERSION_NAME="$(echo ${ADDR[1]} | sed -e 's/^"//'  -e 's/"$//')"

mkdir -p bin build/android/v.$VERSION_NAME/trainer
cp -R $PWD/android/app/build/outputs/apk/trainer/release/. build/android/v.$VERSION_NAME/trainer
# Copy file to Build Folder ------------------- END

cd build/android/v.$VERSION_NAME/trainer

for file in app-*-release.apk
do
# release apk
      mv "$file" "${file/app-trainer-release.apk/fw-trainer-v.$VERSION_NAME.apk}"

# universal apk
  mv "$file" "${file/app-trainer-universal-release.apk/fw-trainer-v.$VERSION_NAME.apk}"

# armeabi-v7a apk
  mv "$file" "${file/app-trainer-armeabi-v7a-release.apk/fw-trainer-armeabi-v7a-v.$VERSION_NAME.apk}"

# arm64-v8a apk
  mv "$file" "${file/app-trainer-arm64-v8a-release.apk/fw-trainer-arm64-v8a-v.$VERSION_NAME.apk}"

# x86 apk
  mv "$file" "${file/app-trainer-x86-release.apk/fw-trainer-x86-v.$VERSION_NAME.apk}"

done

# Unbutu - open floder
xdg-open .
# MAC - open folder
open .

echo                                                                                
echo                                                                                
echo                                                                                
echo "            /**********************************************************/"
echo "                                      Trainer                           "
echo "                    Install app-trainer-release.apk on android device   "
echo "                                        OR                              "
echo "                                publish to play store                   "
echo "            /**********************************************************/"
echo                                                                                
echo                                                                                
echo        
