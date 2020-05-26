# PDA-frontend
## Get Started

If you have not yet installed React Native, you can use [this tutorial](https://facebook.github.io/react-native/docs/getting-started.html).

Use ```git clone``` to get project. Then go to the root folder of project and install all node modules using ```yarn install-all``` command.

## Installation
In the root directory, install dependenices use following command every time
```yarn install-all``` 

## Release History
// No relase 
## Run on Android 

#### Participant
1. You have to connect hardware device using [ADB](https://developer.android.com/studio/command-line/adb.html) or run [emulator](https://developer.android.com/studio/run/emulator-commandline.html).
2. Invoke ```yarn android-participant-debug``` command.
3. Open app from Mobile menu

#### Trainer
1. You have to connect hardware device using [ADB](https://developer.android.com/studio/command-line/adb.html) or run [emulator](https://developer.android.com/studio/run/emulator-commandline.html).
2. Invoke ```yarn android-trainer-debug``` command.
3. Open app from Mobile menu

## Run on iOS
1. You have to get  [Xcode](https://developer.apple.com/xcode/) installed on your machine.
2. Invoke ```react-native run-ios``` command.

## Android - Generate Signed APK 
#### Participant
Invoke ```yarn android-trainer-release``` command

#### Trainer
Invoke ```yarn android-trainer-release``` command

## IOS - build
1. Run this on terminal from root folder "bash ./GenerateIosBuild"
2. Open xCode
3. From AppDelegate.m replace "jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];" line to "jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];"
4. Change schema into Generic IOS Device
5. Click Product -> Archive

Please refer to [Wiki](https://github.com/PDA-Open-Source/PDA-MOBILE/wiki) for further details.



